<template>
  <div class="demand">
    <!-- <h2 class="set-title">
      <span @click="()=>{this.$router.go(-1)}">
        <Icon type="ios-arrow-back"/>返回
      </span>
      <img src="../../assets/images/logo.png" alt style="margin-right: 10px;">发票索取
    </h2> -->
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../assets/images/logo.png" alt="" style="margin-right: 8px; width:25px; height: 25px;">
      <BreadcrumbItem to="/" style="color: #333;">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333" to="/out-order">索取发票</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">开具发票</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="invoice-nature">
        <!-- <p class="invoice">发票形式</p> -->
        <h3 class="h3-title">发票形式</h3>
        <div style="display: flex;height: 120px;">
          <div
            v-show="showType"
            class="electronic-invoice"
            :class="{SelectedStyle:invoiceForm.property==='电子'}"
            @click="selectedProperty('电子')"
          >
            <span style="color: #333333;font-size: 14px;">电子发票</span>
            <span style="font-size: 12px;color: #999999;">最快5分钟开具</span>
            <img
              v-if="invoiceForm.property==='电子'"
              src="../../assets/images/default.png"
              alt
              style="position: absolute;bottom:0px;right: 0px;"
            >
          </div>
          <div
            v-show="!showType"
            class="electronic-invoice"
            style="margin-left:20px;"
            :class="{SelectedStyle:invoiceForm.property==='纸质'}"
            @click="selectedProperty('纸质')"
          >
            <span style="color: #333333;font-size: 14px;">纸质发票</span>
            <span style="font-size: 12px;color: #999999;">预计2天送达</span>
            <img
              v-if="invoiceForm.property==='纸质'"
              src="../../assets/images/default.png"
              alt
              style="position: absolute;bottom:0px;right: 0px;"
            >
          </div>
        </div>

      </div>
      <div class="invoice-nature">
        <!-- <p class="invoice">发票抬头</p> -->
        <h3 class="h3-title">发票抬头</h3>
        <Form ref="invoiceForm" :model="invoiceForm" :rules="ruleValidate" :label-width="80">
          <FormItem label="抬头类型" prop="type">
            <RadioGroup v-model="invoiceForm.type">
              <Radio label="企业">企业</Radio>
              <Radio label="个人">个人</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-show="invoiceForm.type==='企业'&&invoiceForm.property==='纸质'" label="发票类型" prop="type">
            <RadioGroup v-model="invoiceForm.category">
              <Radio label="增值税普通发票">增值税普通发票</Radio>
              <Radio label="增值税专用发票">增值税专用发票</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="发票抬头" prop="purchaserName" v-show="invoiceForm.type === '个人'">
            <Input v-model="invoiceForm.purchaserName" placeholder="可输入个人姓名或事业单位名称" style="width: 200px"/>
          </FormItem>
          <div class="invioce-title" v-show="invoiceForm.type === '企业'">
            <div
              class="invoice-content"
              v-for="(item,index) in companyList"
              :key="index"
              :class="{'selecting':invoiceForm.companyId === item.companyId}"
              @click="selectCompany(item.companyId)"
            >
              <img
                v-if="companyId === item.companyId"
                src="../../assets/images/default.png"
                alt
                style="position: absolute;bottom:0px;right: 0px;"
              >
              <ul v-if="showInfo" class="invoice-list" style="margin-bottom:15px">
                <li class="flex-r">
                  <span>发票抬头信息：</span>
                  <p>{{item.name}}</p>
                </li>
                <li class="flex-r">
                  <span>纳税人识别号：</span>
                  <p>{{item.taxNumber}}</p>
                </li>
              </ul>
              <Button size="small" style="margin-left:22px; font-size: 14px"><a
                @click="addInvoiceTitleFn(0,item.companyId)">编辑</a></Button>
              <Button size="small" style="margin-left:10px; font-size: 14px"><a @click="handleDel(item.companyId)"
                                                                                v-if="ifManageCompany">删除</a></Button>
              <a
                v-if="item.ifDefault != true"
                @click="setDefault(item.companyId)"
                style="padding:10px; margin-left:120px"
              >设为默认</a>
              <Button v-if="item.ifDefault == true" size="small" style="margin-left: 13px; margin-left:136px"
                      type="primary">默认
              </Button>
            </div>
            <div class="invoice-content add-title" @click="addInvoiceTitleFn(1)"
                 v-if="ifManageCompany && companyList.length < 6"></div>
            <p class="tpPading-10 btPading-10" style="margin-top:-20px">注意：发票抬头最多可以添加6个</p>
          </div>
        </Form>
      </div>
      <div class="invoice-nature">
        <!-- <p class="invoice">发票信息</p> -->
        <h3 class="h3-title">发票信息</h3>
        <Form ref="invoiceForm" :model="invoiceForm" :rules="ruleValidate" :label-width="80">
          <!-- <FormItem label="发票类型" prop="category">
            <RadioGroup v-model="invoiceForm.category">
              <Radio label="增值税普通发票">增值税普通发票</Radio>
              <Radio label="增值税专用发票" v-if=" invoiceForm.property!=='电子'">增值税专用发票</Radio>
            </RadioGroup>
          </FormItem>-->

          <FormItem label="发票金额">
            <span>{{price}}元</span>
          </FormItem>
          <!--<FormItem label="发票内容">-->
          <!--<span></span>-->
          <!--</FormItem>-->
          <FormItem label="开票备注" style="margin-top:25px;">
            <Input v-model="invoiceForm.remark" placeholder="可输入开票备注" style="width: 200px"/>
            <Poptip placement="right" width="400">
              <Icon class="md-help" type="md-help" />
              <div class="api" slot="content">
                <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></img>
              </div>
            </Poptip>
          </FormItem>
          <FormItem label="接收手机" prop="mobile" v-if=" invoiceForm.property==='电子'" style="margin-top:25px;">
            <Input v-model="invoiceForm.mobile" placeholder="请输入手机号码" style="width: 200px;"/>
          </FormItem>
          <FormItem label="接收邮箱" prop="email" v-if=" invoiceForm.property==='电子'" style="margin-top:25px;">
            <Input v-model="invoiceForm.email" placeholder="请输入邮箱" style="width: 200px;"/>
          </FormItem>
        </Form>
      </div>
      <div
        class="invoice-nature"
        style="height: 250px;"
        v-if=" invoiceForm.property!=='电子'"
      >
        <!-- <p class="invoice">邮寄信息</p> -->
        <h3 class="h3-title">邮寄信息</h3>
        <div class="invoice-content" style="height: 182px; border:1px solid #2d8cf0">
          <p class="userName" v-if="defaultAddress!==null">
            <span>{{defaultAddress.name}}</span>
          </p>
          <p
            class="address-informations"
            style="margin-top:10px;"
            v-if="defaultAddress!==null"
          >{{defaultAddress.mobile}}</p>
          <p
            class="address-informations"
            v-if="defaultAddress!==null"
          >{{defaultAddress.province }} {{defaultAddress.city}}</p>
          <p
            class="address-informations"
            style="margin-bottom:5px"
            v-if="defaultAddress!==null"
          >{{defaultAddress.district + defaultAddress.addr}}</p>
          <a v-if="showAddressInfo" @click="jumpPage('/address')">更改邮寄地址</a>
          <a v-if="!showAddressInfo" @click="jumpPage('/address')">填写邮寄信息</a>
        </div>
      </div>

      <Button class="btn" @click="handleSubmit('invoiceForm')">提交</Button>
      <Button class="btn" to="/out-order">返回</Button>
      <!-- <p style="color: #999999;font-size: 12px;margin-bottom: 20px;">请仔细核对开票信息</p> -->
      <p class="tpPading-10 btPading-10">请仔细核对开票信息</p>
    </div>
    <Modal v-model="showModal" :title="modalTitle">
      <Form ref="companyForm" :model="companyForm" :rules="rules" :label-width="120">
        <FormItem label="公司名称" prop="name">
          <Input v-model="companyForm.name" placeholder="请输入发票抬头" @on-change="autocomplete"
                 :disabled="!ifManageCompany"/>
          <div class="query-results" v-if="makeUp!==''"
               style="position: absolute; z-index: 999; background: white; width: 368px">
            <ul>
              <li
                v-for="(result, index) in makeUp"
                :key="index"
                @click="chooseRise(index)"
              >{{result.name}}
              </li>
            </ul>
          </div>
        </FormItem>
        <FormItem label="纳税人识别号" prop="taxNumber">
          <Input v-model="companyForm.taxNumber" placeholder="请输入纳税人识别号" :disabled="!ifManageCompany"/>
        </FormItem>
        <FormItem label="开户行" prop="bank">
          <Input v-model="companyForm.bank" placeholder="请输入开户行及账号"/>
        </FormItem>
        <FormItem label="开户行账号" prop="bankAccount">
          <Input v-model="companyForm.bankAccount" placeholder="请输入开户行账号"/>
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model="companyForm.address" placeholder="请输入地址"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="companyForm.phone" placeholder="请输入电话"/>
        </FormItem>
        <FormItem>
          <Checkbox v-model="ifDefault">设为默认</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="titleSubmit('companyForm')">确定</Button>
        <Button @click="titleReset('companyForm')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {
    getCompanyList, getCompany, updateCompany, createCompany, deleteCompany, updateDefaultCompany, getCompanyCodeList
  } from '../../api/company'
  import {
    getDefaultAddress
  } from '../../api/address'
  import {
    getCustomer
  } from '../../api/customer'
  import {getShopInfo} from '../../api/shop'

  export default {
    name: "",
    components: {},
    data() {
      return {
        companyList: "",
        showType: "",
        showInfo: false,
        showModal: false,

        defaultAddress: "",
        ifManageCompany: true,//是否可以管理公司抬头
        showAddressInfo: false,
        modalTitle: "添加发票抬头",
        makeUp: "",
        ids: "",
        price: "",
        scrollTop: '',
        invoiceForm: {
          category: "增值税普通发票",
          property: "",
          type: "企业",
          email: "",
          mobile: "",
          remark: "",
          purchaserName: "个人",
          companyId: '',
          addressId: ''
        },
        companyForm: {
          companyId: "",
          name: "",
          taxNumber: "",
          bank: "",
          bankAccount: "",
          address: "",
          phone: "",
          ifDefault: true
        },
        rules: {
          name: [{required: true, message: "请输入发票抬头", trigger: "blur"}],
          taxNumber: [
            {required: true, message: "请输入纳税人识别号", trigger: "blur"}
          ],
        },
        ruleValidate: {
          type: [
            {required: true, message: "请选择开具类型", trigger: "change"}
          ],
          category: [
            {required: true, message: "请选择发票类型", trigger: "change"}
          ],
          mobile: [
            {required: true, message: "请填写接收手机", trigger: "blur"}
          ],
          purchaserName: [
            {required: true, message: "请输入发票抬头", trigger: "blur"}
          ],
          email: [
            {required: true, message: "请填写接收邮箱", trigger: "blur"},
            {type: "email", message: "请填写接收邮箱", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      //获取商店门户信息
      getShopImfor() {
        let params = {
          accessToken: localStorage.getItem("accessToken")
        };
        getShopInfo(params).then(res => {
          this.showType = res.data.content.ifElectronic
          if (this.showType) {
            this.invoiceForm.property = "电子"
            this.getCustomer();
          } else {
            this.invoiceForm.property = "纸质"
            this.getAddressList();
          }
        })
      },
      selectedProperty(type) {
        this.invoiceForm.property = type;
      },
      //添加或编辑发票抬头
      addInvoiceTitleFn(t, id) {
        this.modalType = t;
        if (t === 0) {
          this.makeUp = [];
          this.invoiceForm.companyId = id;
          this.modalTitle = "编辑发票抬头";
          this.showModal = true;
          this.getCompany(id);
        } else if (t === 1) {
          if (this.companyList.length < 6) {
            this.makeUp = [];
            this.titleReset('companyForm');
            this.modalTitle = "添加发票抬头";
            this.showModal = true;
            this.getCompanyList();
          } else if (this.companyList.length === 6) {
            this.$Message.warning("发票最多只能添加6个");
          }
        }
      },
      // 删除
      handleDel(id) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>您确定要删除该条记录吗？</p>",
          onOk: () => {
            deleteCompany(id).then(res => {
              this.$Message.info("删除成功");
              this.getCompanyList();
            }).catch(error => {
              this.$Message.error(error.response.data.message)
              console.log(error.response);
            });
          }
        });
      },
      getCompany(id) {
        getCompany(id).then(res => {
          let data = res.data.content;
          this.companyForm.name = data.name;
          this.companyForm.taxNumber = data.taxNumber;
          this.companyForm.bank = data.bank;
          this.companyForm.bankAccount = data.bankAccount;
          this.companyForm.address = data.address;
          this.companyForm.phone = data.phone;
          this.companyForm.ifDefault = data.ifDefault;
        }).catch(error => {
          this.$Message.error(error.response.data.message)
          console.log(error.response);
        });
      },
      // 抬头填写重置
      titleReset(name) {
        this.showModal = false;
        this.companyForm.ifDefault = true;
        this.$refs[name].resetFields();
      },
      // 选择抬头
      selectCompany(id) {
        this.invoiceForm.companyId = id;
      },
      // 设为默认
      setDefault(id) {
        updateDefaultCompany(id).then(res => {
          if (res.data.code === 1) {
            this.$Message.success("操作成功");
            this.getCompanyList();
          }
        }).catch(error => {
          this.$Message.error(error.response.data.message)
          console.log(error.response);
        });
      },
      //提交地址
      titleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (!valid) {
            return;
          }
          if (this.modalType === 0) {
            let obj = {};
            obj.name = this.companyForm.name;
            obj.taxNumber = this.companyForm.taxNumber;
            obj.bank = this.companyForm.bank;
            obj.bankAccount = this.companyForm.bankAccount;
            obj.address = this.companyForm.address;
            obj.phone = this.companyForm.phone;
            obj.ifDefault = this.companyForm.ifDefault;
            updateCompany(this.companyForm.companyId, obj).then(res => {
              if (res.status === 200) {
                this.$Message.success("编辑成功");
                this.handleReset('companyForm');
                this.getCompanyList();
              }
            }).catch(error => {
              this.$Message.error(error.response.data.message)
            });
          } else if (this.modalType === 1) {
            let obj = {};
            obj.name = this.companyForm.name;
            obj.taxNumber = this.companyForm.taxNumber;
            obj.bank = this.companyForm.bank;
            obj.bankAccount = this.companyForm.bankAccount;
            obj.address = this.companyForm.address;
            obj.phone = this.companyForm.phone;
            obj.ifDefault = this.companyForm.ifDefault;
            createCompany(obj).then(res => {
              if (res.status === 200) {
                this.$Message.success("添加成功");
                this.handleReset('companyForm');
                this.getCompanyList();
              }
            }).catch(error => {
              this.$Message.error(error.response.data.message)
            });
          }
        });
      },
      // 重置
      handleReset(name) {
        this.showModal = false;
        this.companyForm.ifDefault = true;
        this.$refs[name].resetFields();
      },
      chooseRise(index) {
        this.companyForm.companyId = this.makeUp[index].companyId;
        this.companyForm.name = this.makeUp[index].name;
        this.companyForm.taxNumber = this.makeUp[index].taxNumber;
        this.companyForm.bank = this.makeUp[index].bank;
        this.companyForm.bankAccount = this.makeUp[index].bankAccount;
        this.companyForm.address = this.makeUp[index].address;
        this.companyForm.phone = this.makeUp[index].phone;
        this.makeUp = [];
      },
      getCompanyList() {
        let params = {
          accessToken: localStorage.getItem("accessToken"),
        };
        getCompanyList(params).then(res => {
          if (res.data.code == 1) {
            this.companyList = res.data.content;
            this.showInfo = true;
            for (let k of this.companyList) {
              if (k.ifDefault == true) {
                this.companyForm.companyId = k.companyId;
              }
            }
          } else {
            this.showInfo = false;
            this.companyList = "";
          }
        }).catch(error => {
          this.$Message.error(error.response.data.message)
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
          this.$Message.error(error.response.data.message)
        });
      },
      //获取默认邮寄地址
      getAddressList() {
        getDefaultAddress().then(res => {
          if (res.data.code === 1) {
            this.defaultAddress = res.data.content;
            this.showAddressInfo = true;
          } else if (res.data.code === 0) {
            this.showAddressInfo = false;
            this.defaultAddress = null;
          }
        }).catch(error => {
          this.$Message.error(error.response.data.message)
        });
      },
      //自动补齐
      autocomplete() {
        getCompanyCodeList({name: this.companyForm.name}).then(res => {
          this.code = res.data.code;
          if (res.data.code !== 0) {
            (this.message = ""), (this.makeUp = res.data.content);
          } else {
            this.message = res.data.message;
          }
        })
      },
      //获取我的开票账户信息
      // getCustomer() {
      //   getCustomer({}).then(res => {
      //     if (res.data.code === 1) {
      //       this.showType = res.data.content.defaultCategory
      //       this.invoiceForm.email = res.data.content.email;
      //       this.invoiceForm.mobile = res.data.content.mobile;
      //     }
      //   }).catch(error => {
      //     this.$Message.error(error.response.data.message)
      //   });
      // },
      handleSubmit(name) {
        if (this.invoiceForm.property === '纸质') {
          if (this.defaultAddress == null) {
            return this.$Message.warning("请填写邮寄地址");
          }
          this.invoiceForm.addressId = this.defaultAddress.addressId;
        }
        else if (this.invoiceForm.property === '电子') {
          this.invoiceForm.addressId = null;
          this.invoiceForm.category = "增值税电子普通发票"
        }
        if (this.invoiceForm.type === '个人') {
          this.invoiceForm.purchaserName = this.invoiceForm.purchaserName;
          this.invoiceForm.companyId = '';
        } else if (this.invoiceForm.type === '企业') {
          if (!this.companyForm.companyId) {
            return this.$Message.warning("请选择开票抬头");
          }
          this.invoiceForm.companyId = this.companyForm.companyId;
          this.invoiceForm.purchaserName = '';
        }
        this.$refs[name].validate(valid => {
          if (!valid) {
            return;
          }
          let data = this.invoiceForm;
          data.accessToken = localStorage.getItem("accessToken");
          data.outOrderIds = this.ids;
          data.addrMobile = this.invoiceForm.mobile;
          console.log(data)
          this.$Modal.confirm({
            title: "提示",
            content: "<p>您确定要开具发票吗？</p>",
            onOk: () => {
              this.$ajax.post('https://fapiao-api.easyapi.com/merge-make', data, {}).then(res => {
                if (res.data.code === 1) {
                  this.$Message.success("提交成功");
                  this.$router.push({
                    path: "/",
                    query: {
                      taxNumber: localStorage.getItem("taxNumber"),
                      accessToken: localStorage.getItem("accessToken")
                    }
                  });
                }
              }).catch(error => {
                console.log(error);
                this.$Message.warning(error.response.data.message);
              });
            }
          });
        });
      },
      jumpPage(url) {
        this.scrollTop = document.documentElement.scrollTop;
        this.$router.push({
          path: url,
          query: {
            page: this.scrollTop,
          }
        });
      }
    },
    created() {
      this.ids = this.$route.query.id;
      this.price = this.$route.query.price;
    },
    mounted() {
      this.getIfManageCompany();
      this.getCompanyList();
      this.getShopImfor();
    },
    activated() {
    }
  }
  ;
</script>
<style>
  .invoice-nature .ivu-form-item {
    margin-bottom: 10px;
  }
</style>
<style scoped lang="stylus">
  @import '../../assets/styles/invoice.styl';

  .set-title {
    padding-left: 10px;

    span {
      color: #2d8cf0;
      font-size: 18px;
      border-right: 2px solid #2d8cf0;
      padding: 10px 10px 10px 0;
      cursor: pointer;
    }

    img {
      margin-left: 10px;
    }
  }

  .invioce-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    & > div {

    }

    .add-title {
      background: url('../../assets/images/add.png') no-repeat center;
      cursor: pointer;
    }
  }

  .typeButton {
    div {
      cursor: pointer;
      text-align: center;
      width: 100px;
      height: 35px;
      line-height: 35px;
      background: #f8f8f9;
      margin-left: 20px;
      margin-bottom: 10px;
      border-radius: 5px;
      float: left;
    }

    .active {
      background: #A9C2CC;
    }

    div:first-of-type {
      margin-left: 0 !important;
    }
  }

  .demand {
    background-color: #fff;
    padding: 20px 40px;
    height: auto;
    border: solid 1px #dddddd;
  }

  .set-content {
    // margin: 0px 20px;
  }

  .invoice-nature {
    height: auto;
  }

  .invoice-nature .invoice {
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #333333;
    font-size: 16px;
  }

  .invoice-nature .electronic-invoice {
    width: 140px;
    height: 76px;
    border-radius: 4px;
    border: solid 1px #ddd;
    padding-top: 20px;
    cursor: pointer;
    position: relative;
  }

  .invoice-nature .electronic-invoice:hover {
    border: 1px solid #2d8cf0;
  }

  .invoice-nature .electronic-invoice:hover span {
    color: #2d8cf0 !important;
  }

  .SelectedStyle {
    border: solid 1px #2d8cf0 !important;
  }

  .SelectedStyle span {
    color: #2d8cf0 !important;
  }

  .invoice-nature .electronic-invoice span {
    display: block;
    text-align: center;
  }

  .invoice-content {
    width: 360px
    height: 146px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    padding: 20px;
    position: relative;
  }

  .invioce-title > .invoice-content {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .invoice-content ul li {
    height: 30px;

    span {
      width: 120px;
      text-align right
    }

    p {
      flex: 1;
    }
  }

  .userName {
    height: 37px;
    line-height: 37px;
    border-bottom: solid 1px #dddddd;
    font-size: 14px;
    color: #333333;
    display: flex;
    justify-content: space-between;
  }

  .address-informations {
    font-size: 14px;
    color: #333333;
    height: auto;
  }

  .btn {
    width: 88px;
    height: 34px;
    background-color: #2d8cf0;
    color: #ffffff;
    font-size: 14px;
    margin-top: 20px;
    margin-right 5px
  }

  .btn:hover {
    background-color: #2d8cf0 !important;
    border-color: #2d8cf0 !important;
    color: #fff;
  }

  .selecting {
    border: 1px solid #2d8cf0 !important;
    color: #2d8cf0;
  }

  .ivu-breadcrumb {
    padding: 0 0 20px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }

  .invoice-list p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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

  .md-help{
    margin-left 5px
    cursor pointer
  }

</style>
