<template>
  <div class="Invoice-details">
    <h2 class="set-title">
      <span @click="()=>{this.$router.go(-1)}"><Icon type="ios-arrow-back"/>返回</span>
      <img src="../assets/images/logo.png" alt="" style="margin-right: 10px;">发票抬头管理
    </h2>
    <div class="set-content">
      <div class="txt-right tbPading-20">
        <Button type="primary" @click="addInvoiceTitleFn(1)" class="btn" v-if="ifManageCompany!=0">添加发票抬头</Button>
        <Modal
          v-model="showModal"
          :title="modalTitle">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="公司名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入发票抬头" @on-change="autocomplete" disabled></Input>
              <div class="query-results" v-if="this.queryTitleList!==''">
                <ul>
                  <li v-for="(result, index) in queryTitleList" :key="index" @click="chooseRise(index)">
                    {{result.name}}
                  </li>
                </ul>
              </div>
            </FormItem>
            <FormItem label="纳税人识别号" prop="taxNumber">
              <Input v-model="formValidate.taxNumber" placeholder="请输入纳税人识别号" disabled></Input>
            </FormItem>
            <FormItem label="开户行" prop="bank">
              <Input v-model="formValidate.bank" placeholder="请输入开户行"></Input>
            </FormItem>
            <FormItem label="开户行账号" prop="bankAccount">
              <Input v-model="formValidate.bankAccount" placeholder="请输入开户行账号"></Input>
            </FormItem>
            <FormItem label="地址" prop="address">
              <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
            </FormItem>
            <FormItem label="电话" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入电话"></Input>
            </FormItem>
            <FormItem>
              <Checkbox v-model="ifDefault">设为默认</Checkbox>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="handleSubmit('formValidate')" class="btn">确定</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </div>
        </Modal>
      </div>
      <Table border :stripe='true' :columns="tableTitle" :data="tableData"></Table>
      <p class="tpPading-10 btPading-10">注意：发票抬头最多可以添加5个</p>
      <div class="page-box flex-r">
        <Page :total='total' :page-size="pageSize" :current="current" @on-change="changePage" show-elevator></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import {companiesUrl, companyUrl, queryServiceURl} from '../api/api'

  export default {
    name: '',
    components: {},
    data() {
      return {
        username: '',
        showModal: false,
        modalTitle: '添加发票',
        modalType: null,
        queryTitleList: '',
        companyId: '',//保存发票抬头ID
        ifManageCompany: 1,//是否可以管理公司抬头
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
        tableTitle: [
          {
            title: '公司名称',
            key: 'name',
            align: 'center',
            width: 200
          },
          {
            title: '纳税人识别号',
            key: 'taxNumber',
            align: 'center'
          },
          {
            title: '开户行',
            key: 'bank',
            align: 'center'
          },
          {
            title: '开户行账号',
            key: 'bankAccount',
            align: 'center'
          },

          {
            title: '地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              let showDisplay = "none";
              if (params.row.ifDefault) {
                showDisplay = 'none'
              } else {
                showDisplay = "inline-block";
              }
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: showDisplay
                  },
                  on: {
                    click: () => {
                      this.$ajax({
                        method: 'PUT',
                        url: companyUrl + "/" + params.row.companyId,
                        data: {
                          accessToken: localStorage.getItem('accessToken'),
                          username: this.username,
                          ifDefault: true,
                        }
                      }).then(res => {
                        if (res.data.code === "1") {
                          this.$Message.success('操作成功!');
                          this.getCompanyList()
                        }
                      }).catch(error => {
                        console.log(error.response)
                      });
                    }
                  }
                }, '设为默认'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    background: '#18c1d6',
                    border: 'solid 1px #18c1d6',
                  },
                  on: {
                    click: () => {
                      this.addInvoiceTitleFn(0, params.row.companyId)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: this.ifManageCompany!=0?'inline-block':'none'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>您确定要删除该条记录吗？</p>',
                        onOk: () => {
                          this.$ajax({
                            method: 'delete',
                            url: companyUrl + '/' + params.row.companyId,
                            params: {
                              accessToken: localStorage.getItem('accessToken')
                            }
                          }).then(res => {
                            this.$Message.info('删除成功');
                            this.getCompanyList()
                          }).catch(error => {
                            console.log(error.response)
                          });
                        }
                      });
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        tableData: [],
        current: 1,
        pageSize: 5,
        total: 0,
      }
    },
    methods: {
      //自动补齐
      autocomplete() {
        if (this.formValidate.name.length < 4) {
          return;
        }
        this.$ajax({
          method: 'GET',
          url: queryServiceURl,
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
        let current = this.current - 1;
        this.$ajax({
          method: 'GET',
          url: companiesUrl,
          params: {
            accessToken: localStorage.getItem('accessToken'),
            username: this.username,
            page: current,
            size: this.pageSize,
          }
        }).then(res => {
          if (res.data.code === 0) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.content;
            this.total = Number(res.data.totalElements);
          }
        }).catch(error => {
          console.log(error)
          this.$Message.warning(error.response.data.message)
        });
      },
      getCompany() {
        let _that = this;
        this.$ajax({
          method: 'GET',
          url: companyUrl + '/' + this.companyId,
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
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
        this.$ajax({
          method: 'GET',
          url: 'https://fapiao-api.easyapi.com/shop/0/setting?field=ifManageCompany',
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
          if (this.tableData.length < 5) {
            this.modalTitle = "添加发票";
            this.showModal = true;
          } else if (this.tableData.length === 5) {
            this.$Message.warning("发票最多只能添加5个")
          }
        }
      },
      //提交地址
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.modalType === 0) {
              let obj = {}
              obj.accessToken = localStorage.getItem('accessToken');
              obj.name = this.formValidate.name;
              obj.taxNumber = this.formValidate.taxNumber;
              obj.bank = this.formValidate.bank;
              obj.bankAccount = this.formValidate.bankAccount;
              obj.address = this.formValidate.address;
              obj.phone = this.formValidate.phone;
              obj.ifDefault = this.ifDefault;
              obj.username = this.username;
              this.$ajax({
                method: 'PUT',
                url: companyUrl + '/' + this.companyId,
                data: obj,
              }).then(res => {
                if (res.data.code === "1") {
                  this.$Message.success('编辑成功!');
                  this.handleReset('formValidate')
                  this.getCompanyList();
                }
              }).catch(error => {
                console.log(error.response)
              });
            } else if (this.modalType === 1) {
              let obj = {}
              obj.accessToken = localStorage.getItem('accessToken');
              obj.name = this.formValidate.name;
              obj.taxNumber = this.formValidate.taxNumber;
              obj.bank = this.formValidate.bank;
              obj.bankAccount = this.formValidate.bankAccount;
              obj.address = this.formValidate.address;
              obj.phone = this.formValidate.phone;
              obj.ifDefault = this.ifDefault;
              obj.username = this.username;
              this.$ajax({
                method: 'POST',
                url: companyUrl,
                data: obj
              }).then(res => {
                if (res.data.code === "1") {
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
        this.current = current;
        this.getCompanyList()
      },
    },
    //计算属性
    computed: {},
    created() {
      this.username = this.$route.query.username;
    },
    mounted() {
      this.getIfManageCompany()
      this.getCompanyList()
    },
    watch: {}
  }
</script>
<style scoped lang="stylus">
  @import '../assets/styles/invoice.styl'
  .set-title {
    padding-left: 10px;

    span {
      color: #18c1d6;
      font-size: 18px;
      border-right: 2px solid #18c1d6;
      padding: 10px 10px 10px 0;
      cursor: pointer;
    }

    img {
      margin-left: 10px;
    }
  }

  .Invoice-details {
    background-color: #fff;
    padding: 20px 40px;
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
    border: solid 1px #18c1d6;
    background-color: #18c1d6;
  }
</style>
