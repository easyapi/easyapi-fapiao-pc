<template>
  <div class="Invoice-details">
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../assets/images/logo.png" alt="" style="margin-right: 8px; width:25px; height: 25px;">
      <BreadcrumbItem to="/" style="color: #333">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">发票抬头管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <!-- <span style="color: #333333;font-size: 16px;display: block;height: 57px;line-sheight: 57px;">发票抬头</span> -->
      <h3 class="h3-title">发票抬头</h3>
      <Modal
        v-model="showModal"
        :title="modalTitle">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
          <FormItem label="公司名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入发票抬头" @on-change="autocomplete"
                   :disabled="!ifManageCompany"/>
            <div class="query-results" v-if="this.queryTitleList!==''">
              <ul>
                <li v-for="(result, index) in queryTitleList" :key="index" @click="chooseRise(index)">
                  {{result.name}}
                </li>
              </ul>
            </div>
          </FormItem>
          <FormItem label="纳税人识别号" prop="taxNumber">
            <Input v-model="formValidate.taxNumber" placeholder="请输入纳税人识别号" :disabled="!ifManageCompany"/>
          </FormItem>
          <FormItem label="开户行" prop="bank">
            <Input v-model="formValidate.bank" placeholder="请输入开户行"/>
          </FormItem>
          <FormItem label="开户行账号" prop="bankAccount">
            <Input v-model="formValidate.bankAccount" placeholder="请输入开户行账号"/>
          </FormItem>
          <FormItem label="地址" prop="address">
            <Input v-model="formValidate.address" placeholder="请输入地址"/>
          </FormItem>
          <FormItem label="电话" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入电话"/>
          </FormItem>
          <FormItem>
            <Checkbox v-model="ifDefault">设为默认</Checkbox>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>


      <div class="address">
        <div style="float:left" v-for="companyData in tableData">
          <div class="get-company" v-if="companyData.ifDefault===false"
               @click.stop="updateDefaultCompany(companyData.companyId)">
            <p class="userName">
              <span style="color: #515a6e;">{{companyData.name}}</span>
              <span v-if="companyData.ifDefault===false" style="color: #2d8cf0;">设为默认</span>
            </p>
            <p class="company-informations" style="margin-top:10px;">{{companyData.taxNumber || '——'}}</p>
            <p class="company-informations">{{companyData.bank || '——'}}</p>
            <p class="company-informations">{{companyData.bankAccount || '——'}}</p>
            <p class="company-informations">{{companyData.address || '——'}}</p>
            <p class="company-informations">{{companyData.phone || '——'}}</p>
            <div class="btn">
              <Button size="small" style="font-size: 14px" @click.stop="addInvoiceTitleFn(0,companyData.companyId)">修改
              </Button>
              <Button size="small" style="font-size: 14px" @click.stop="deleteCompany(companyData.companyId)">删除
              </Button>
            </div>
          </div>
          <div class="get-company" style="border: solid 1px #2d8cf0;position: relative"
               v-if="companyData.ifDefault===true">
            <p class="userName">
              <span style="color: #515a6e;">{{companyData.name}}</span>
              <!-- <span
                style="width: 40px;height: 18px;background-color: #2d8cf0;border-radius: 2px; color: #fff;margin-top:8px;line-height:18px;font-size: 14px;text-align: center">默认</span> -->
              <span style="margin-top:-3px">
                <Button size="small" type="primary">默认</Button>
              </span>
            </p>
            <p class="company-informations" style="margin-top:10px;">{{companyData.taxNumber || '——'}}</p>
            <p class="company-informations">{{companyData.bank || '——'}}</p>
            <p class="company-informations">{{companyData.bankAccount || '——'}}</p>
            <p class="company-informations">{{companyData.address || '——'}}</p>
            <p class="company-informations">{{companyData.phone || '——'}}</p>
            <div class="btn">
              <Button size="small" style="font-size: 14px" @click.stop="addInvoiceTitleFn(0,companyData.companyId)">修改
              </Button>
              <Button size="small" style="font-size: 14px" @click.stop="deleteCompany(companyData.companyId)">删除
              </Button>
            </div>
            <img src="../../assets/images/default.png" alt="" style="position: absolute;bottom:0px;right: 0px;">
          </div>
        </div>
        <div class="add-the-address" @click="addInvoiceTitleFn(1)" v-if="this.tableData.length < 6">
          <img src="../../assets/images/plus.png" alt="" style="display: block;margin:70px auto;">
        </div>
      </div>


      <p class="tpPading-10 btPading-10">注意：发票抬头最多可以添加6个</p>
      <!-- <div class="page-box flex-r">
        <Page :total='page.total' :page-size="page.size" :current="page.current" @on-change="changePage"
              show-elevator></Page>
      </div> -->
    </div>
  </div>
</template>
<script>
  import {queryServiceURl} from '../../api/api'
  import {
    getCompanyList,
    getCompany,
    createCompany,
    updateCompany,
    updateDefaultCompany,
    deleteCompany
  } from '../../api/company'

  export default {
    name: '',
    components: {},
    data() {
      return {
        showModal: false,
        modalTitle: '添加发票',
        modalType: null,
        queryTitleList: '',
        companyId: '',//保存发票抬头ID
        ifManageCompany: true,//是否可以管理公司抬头
        message: '',
        code: '',
        formValidate: {
          name: '',
          taxNumber: '',
          bank: '',
          bankAccount: '',
          address: '',
          phone: '',
        },
        ifDefault: true,
        disabled: false,
        ruleValidate: {
          name: [
            {required: true, message: '请输入发票抬头', trigger: 'blur'}
          ],
          taxNumber: [
            {required: true, message: '请输入纳税人识别号', trigger: 'blur'},
          ],
          bank: [
            {required: true, message: '请输入开户行', trigger: 'blur'}
          ],
          bankAccount: [
            {required: true, message: '请输入开户行账号', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入注册地址', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入注册电话', trigger: 'blur'}
          ],
        },
        tableData: [],
        page: {
          current: 1,
          size: 6,
          total: 0,
        }
      }
    },
    methods: {
      //设置默认抬头
      updateDefaultCompany(companyId) {
        updateDefaultCompany(companyId).then(res => {
            if (res.data.code === 1) {
              this.getCompanyList()
            }
          }
        ).catch(error => {
          console.log(error.response)
        });
      },
      //修改抬头
      updateCompany(companyId) {
        let data = {
          accessToken: localStorage.getItem('accessToken'),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
        updateCompany(companyId, data).then(res => {
            if (res.data.code === 1) {
              this.getCompanyList()
            }
          }
        ).catch(error => {
          console.log(error.response)
        });
      },
      //自动补齐
      autocomplete() {
        if (this.formValidate.name.length < 4) {
          return;
        }
        this.$ajax.get(queryServiceURl, {
          params: {
            accessToken: localStorage.getItem('accessToken'),
            name: this.formValidate.name
          }
        }).then(res => {
          this.code = res.data.code;
          if (res.data.code !== 0) {
            this.message = '',
              this.queryTitleList = res.data.content
          } else {
            this.message = res.data.message
          }
        }).catch(error => {
          console.log(error)
          this.$Notice.error({
            title: error.response.data.message,
            desc: error ? '' : 'Here is the notification description. Here is the notification description. '
          });
        });
      },
      chooseRise(index) {
        this.formValidate.name = this.queryTitleList[index].name;
        this.formValidate.taxNumber = this.queryTitleList[index].taxNumber;
        this.formValidate.bank = this.queryTitleList[index].bank;
        this.formValidate.bankAccount = this.queryTitleList[index].bankAccount;
        this.formValidate.address = this.queryTitleList[index].address;
        this.formValidate.phone = this.queryTitleList[index].phone;
        this.queryTitleList = [];
      },
      //获取抬头列表
      getCompanyList() {
        let params = {
          page: this.page.current - 1,
          size: this.page.size,
        }
        getCompanyList(params).then(res => {
          if (res.data.code === 0) {
            this.tableData = [];
            this.page.total = 0;
          } else {
            this.tableData = res.data.content;
            this.page.total = Number(res.data.totalElements);
          }
        }).catch(error => {
          console.log(error)
          this.$Message.warning(error.response.data.message)
        });
      },
      getCompany() {
        getCompany(this.companyId).then(res => {
          let data = res.data.content;
          this.formValidate.name = data.name;
          this.formValidate.taxNumber = data.taxNumber;
          this.formValidate.bank = data.bank;
          this.formValidate.bankAccount = data.bankAccount;
          this.formValidate.address = data.address;
          this.formValidate.phone = data.phone;
          this.ifDefault = data.ifDefault;
        }).catch(error => {
          console.log(error.response)
        });
      },
      getIfManageCompany() {
        this.$ajax.get('https://fapiao-api.easyapi.com/shop/0/setting?field=ifManageCompany', {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          if (res.data.code == '1' && res.data.content) {
            for (let setting of res.data.content) {
              if (setting.field === 'ifManageCompany') {
                this.ifManageCompany = setting.value;
              }
            }
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      //添加或编辑发票抬头
      addInvoiceTitleFn(t, id) {
        this.modalType = t;
        if (t === 0) {
          this.companyId = id;
          this.modalTitle = "编辑发票";
          this.showModal = true;
          this.getCompany();
        } else if (t === 1) {
          if (this.tableData.length < 6) {
            this.modalTitle = "添加发票";
            this.showModal = true;
          } else if (this.tableData.length === 6) {
            this.$Message.warning("发票最多只能添加6个")
          }
        }
      },
      //删除地址
      deleteCompany(companyId) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确定要删除该抬头吗？</p>',
          onOk: () => {
            deleteCompany(companyId).then(res => {
              this.$Message.info(res.data.message);
              this.getCompanyList()
            }).catch(error => {
              console.log(error.response)
            });
          }
        });
      },
      //提交地址
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.modalType === 0) {
              let data = {}
              data.accessToken = localStorage.getItem('accessToken');
              data.name = this.formValidate.name;
              data.taxNumber = this.formValidate.taxNumber;
              data.bank = this.formValidate.bank;
              data.bankAccount = this.formValidate.bankAccount;
              data.address = this.formValidate.address;
              data.phone = this.formValidate.phone;
              data.ifDefault = this.ifDefault;
              updateCompany(this.companyId, data).then(res => {
                if (res.data.code === 1) {
                  this.$Message.success('编辑成功!');
                  this.handleReset('formValidate')
                  this.getCompanyList();
                }
              }).catch(error => {
                console.log(error.response)
              });
            } else if (this.modalType === 1) {
              let data = {}
              data.accessToken = localStorage.getItem('accessToken');
              data.name = this.formValidate.name;
              data.taxNumber = this.formValidate.taxNumber;
              data.bank = this.formValidate.bank;
              data.bankAccount = this.formValidate.bankAccount;
              data.address = this.formValidate.address;
              data.phone = this.formValidate.phone;
              data.ifDefault = this.ifDefault;
              createCompany(data).then(res => {
                if (res.data.code === 1) {
                  this.$Message.success('添加成功!');
                  this.handleReset('formValidate')
                  this.getCompanyList();
                }
              }).catch(error => {
                console.log(error.response)
              });
            }
          } else {
            this.$Message.error('请将信息填写完整!');
          }
        })
      },
      handleReset(name) {
        this.showModal = false;
        this.ifDefault = true;
        this.$refs[name].resetFields();
      },
      //分页
      changePage(current) {
        this.page.current = current;
        this.getCompanyList()
      },
    },
    mounted() {
      this.getIfManageCompany()
      this.getCompanyList()
    }
  }

</script>
<style scoped lang="stylus">
  @import '../../assets/styles/invoice.styl'
  .set-title {
    padding-left: 10px;

    span {
      // color: #18c1d6;
      font-size: 18px;
      // border-right: 2px solid #18c1d6;
      padding: 10px 10px 10px 0;
      cursor: pointer;
    }

    img {
      margin-left: 10px;
    }
  }

  .Invoice-details {
    padding: 20px 40px;
    height: auto;
    background-color: #ffffff;
    border: solid 1px #dddddd;
  }

  .query-results {
    width: 100%;
    height: auto;
  }

  .query-results ul {
    border: 1px solid #e8eaec;
    border-top: none;
    padding-left: 10px;
  }

  .query-results ul li {
    cursor: pointer;
  }

  .btn {
    line-height: 45px;
    height: 45px;
  }

  .btn button {
    font-size: 12px;
    color: #2d8cf0;
  }

  .btn button:nth-child(2) {
    margin-left: 10px;
  }

  .ivu-breadcrumb {
    padding: 10px 0px 14px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }

  .address {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .get-company {
    width: 305px;
    height: 200px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    padding: 10px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .get-company:hover {
    border: 1px solid #2d8cf0;
  }

  .get-company .userName {
    height: 37px;
    line-height: 37px;
    border-bottom: solid 1px #dddddd;
    font-size: 14px;
    color: #333333;
    display: flex;
    justify-content: space-between;
  }

  .get-company .userName span:first-child {
    width: 220px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .get-company .company-informations {
    font-size: 14px;
    color: #515a6e;;
  width
  :
  280px;
  overflow
  :
  hidden;
  white-space
  :
  nowrap;
  text-overflow
  :
  ellipsis
  }
  .add-the-address {
    width: 305px;
    height: 200px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    cursor: pointer;
    overflow: hidden;
  }

  .add-the-address:hover {
    box-shadow: 0px 2px 11px 0px rgba(0, 0, 0, 0.05);
  }

</style>
