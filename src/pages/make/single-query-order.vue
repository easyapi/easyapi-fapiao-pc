<template>
  <div class="demand">
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../assets/images/logo.png" alt="" style="margin-right: 8px; width:25px; height: 25px;">
      <BreadcrumbItem to="/" style="color: #333;">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">订单开票</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="invoice-nature">
        <h3 class="h3-title">发票形式</h3>
        <div style="display: flex;height: 120px;">
          <div
            class="electronic-invoice"
            :class="{SelectedStyle:property==='电子'}"
            @click="selectedProperty('电子')"
          >
            <span style="color: #333333;font-size: 14px;">电子发票</span>
            <span style="font-size: 12px;color: #999999;">最快5分钟开具</span>
            <img v-if=" this.property==='电子'" src="../../assets/images/default.png" alt
                 style="position: absolute;bottom:0px;right: 0px;">
          </div>
          <!--<div-->
          <!--class="electronic-invoice"-->
          <!--style="margin-left:20px;"-->
          <!--:class="{SelectedStyle:property==='纸质'}"-->
          <!--@click="selectedProperty('纸质')"-->
          <!--&gt;-->
          <!--<span style="color: #333333;font-size: 14px;">纸质发票</span>-->
          <!--<span style="font-size: 12px;color: #999999;">预计2天送达</span>-->
          <!--<img-->
          <!--v-if=" this.property==='纸质'"-->
          <!--src="../../assets/images/default.png"-->
          <!--alt-->
          <!--style="position: absolute;bottom:0px;right: 0px;"-->
          <!--&gt;-->
          <!--</div>-->
        </div>
      </div>
      <div class="invoice-nature">
        <h3 class="h3-title">发票抬头</h3>
        <Form ref="invoiceForm" :model="invoiceForm" :rules="ruleValidate" :label-width="80">
          <FormItem label="抬头类型" prop="type">
            <RadioGroup v-model="invoiceForm.type" @on-change="selectType">
              <Radio label="企业">企业</Radio>
              <Radio label="个人">个人</Radio>
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
              :class="{'selecting':companyId === item.companyId}"
              @click="selectCompany(item.companyId)"
            >
              <img
                v-if="companyId === item.companyId"
                src="../../assets/images/default.png"
                alt
                style="position: absolute;bottom:0px;right: 0px;"
              >
              <ul v-if="showInfo" style="margin-bottom:15px">
                <li class="flex-r">
                  <span>发票抬头信息：&nbsp;&nbsp;&nbsp;</span>
                  <p>{{item.name}}</p>
                </li>
                <li class="flex-r">
                  <span>纳税人识别号：&nbsp;&nbsp;&nbsp;</span>
                  <p>{{item.taxNumber}}</p>
                </li>
              </ul>
              <Button size="small" style="margin-left:22px; font-size: 14px"><a
                @click="addInvoiceTitleFn(0, item.companyId)" v-if="ifManageCompany!=0">编辑</a></Button>
              <Button size="small" style="margin-left:10px; font-size: 14px" v-if="ifManageCompany!=0"><a
                @click="deleteCompany(item.companyId)" v-if="ifManageCompany">删除</a></Button>
              <a
                v-if="item.ifDefault != true"
                @click="setDefault(item.companyId)"
                style="padding:10px; margin-left:120px"
              >设为默认</a>
              <Button v-if="item.ifDefault == true" size="small" style="margin-left: 13px; margin-left:136px"
                      type="primary">默认
              </Button>
              <!-- <a
                v-if="item.ifDefault != true"
                @click="setDefault(item.companyId)"
                style="padding:10px;"
              >设为默认</a> -->
              <!-- <a @click="addInvoiceTitleFn(0,item.companyId)" style="padding:10px;" v-if="ifManageCompany!=0">编辑</a> -->
              <!-- <a @click="deleteCompany(item.companyId)" style="padding:10px;" v-if="ifManageCompany!=0">删除</a> -->
            </div>
            <div class="invoice-content add-title" @click="addInvoiceTitleFn(1)"
                 v-if="ifManageCompany!=0 && companyList.length < 6"></div>
          </div>
          <p class="tpPading-10 btPading-10" style="margin-top:-20px">注意：发票抬头最多可以添加6个</p>
        </Form>
      </div>
      <div class="invoice-nature">
        <h3 class="h3-title">发票信息</h3>
        <Form ref="invoiceForm" :model="invoiceForm" :rules="ruleValidate" :label-width="80">
          <!-- <FormItem label="发票类型" prop="category">
            <RadioGroup v-model="invoiceForm.category">
              <Radio label="增值税普通发票">增值税普通发票</Radio>
              <Radio label="增值税专用发票" v-if=" this.property!=='电子'">增值税专用发票</Radio>
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
          </FormItem>
          <FormItem label="接收手机" prop="mobile" v-if=" this.property==='电子'" style="margin-top:25px;">
            <Input v-model="invoiceForm.mobile" placeholder="请输入手机号码" style="width: 200px;"/>
          </FormItem>
          <FormItem label="接收邮箱" prop="email" v-if=" this.property==='电子'" style="margin-top:25px;">
            <Input v-model="invoiceForm.email" placeholder="请输入邮箱" style="width: 200px;"/>
          </FormItem>
        </Form>
      </div>
      <div
        class="invoice-nature"
        style="height: 250px;"
        v-if=" this.property!=='电子'"
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
          >{{defaultAddress.province }}&nbsp;&nbsp;&nbsp;&nbsp;{{defaultAddress.city}}</p>
          <p
            class="address-informations"
            style="margin-bottom:5px"
            v-if="defaultAddress!==null"
          >{{defaultAddress.district}}{{defaultAddress.addr}}</p>
          <a v-if="showAddressInfo" @click="jumpPage('/address')">更改邮寄地址</a>
          <a v-if="!showAddressInfo" @click="jumpPage('/address')">填写邮寄信息</a>
        </div>
      </div>

      <Button class="btn" @click="handleSubmit('invoiceForm')">提交</Button>
      <!-- <p style="color: #999999;font-size: 12px;margin-bottom: 20px;">请仔细核对开票信息</p> -->
      <p class="tpPading-10 btPading-10">请仔细核对开票信息</p>
    </div>
    <Modal v-model="showModal" :title="modalTitle">
      <Form ref="formInline" :model="formInline" :rules="rules" :label-width="120">
        <FormItem label="发票抬头" prop="name">
          <Input v-model="formInline.name" placeholder="请输入发票抬头" @on-change="autocomplete"/>
          <div class="query-results" v-if="makeUp!==[]"
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
          <Input v-model="formInline.taxNumber" placeholder="请输入纳税人识别号"/>
        </FormItem>
        <FormItem label="开户行" prop="bank">
          <Input v-model="formInline.bank" placeholder="请输入开户行及账号"/>
        </FormItem>
        <FormItem label="开户行账号" prop="bankAccount">
          <Input v-model="formInline.bankAccount" placeholder="请输入开户行账号"/>
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model="formInline.address" placeholder="请输入地址"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formInline.phone" placeholder="请输入电话"/>
        </FormItem>
        <FormItem>
          <Checkbox v-model="ifDefault">设为默认</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="titleSubmit('formInline')">确定</Button>
        <Button @click="titleReset('formInline')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {queryShopOrder, getState} from "../../api/query";
  import {
    getCompanyList,
    getCompany,
    createCompany,
    updateCompany,
    updateDefaultCompany,
    deleteCompany,
    getCompanyCodeList
  } from "../../api/company";
  import {getDefaultAddress} from "../../api/address";
  import {getCustomer} from "../../api/customer";

  export default {
    name: "",
    components: {},
    data() {
      return {
        companyList: "",
        showInfo: false,
        showModal: false,
        ifDefault: true,
        defaultAddress: "",
        companyId: null,
        ifManageCompany: 1,//是否可以管理公司抬头
        showAddressInfo: false,
        modalTitle: "添加发票抬头",
        accessToken: "",
        taxNumber: "",
        makeUp: [],
        property: "电子",
        outOrder: "",
        price: "",
        invoiceForm: {
          type: "企业",
          category: "增值税电子普通发票",
          email: "",
          mobile: "",
          remark: "",
          purchaserName: "个人"
        },
        formInline: {
          name: "",
          taxNumber: "",
          bank: "",
          bankAccount: "",
          address: "",
          phone: ""
        },
        rules: {
          name: [{required: true, message: "请输入发票抬头", trigger: "blur"}],
          taxNumber: [
            {required: true, message: "请输入纳税人识别号", trigger: "blur"}
          ],
          bank: [
            {required: true, message: "请输入开户行", trigger: "blur"}
          ],
          bankAccount: [
            {required: true, message: "请输入开户行账号", trigger: "blur"}
          ],
          address: [
            {required: true, message: "请输入注册地址", trigger: "blur"}
          ],
          phone: [{required: true, message: "请输入注册电话", trigger: "blur"}]
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
          ],
          remark: [
            {required: true, message: "请输入备注", trigger: "blur"},
            {type: "string", min: 20, message: "不超20个字", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      selectedProperty(type) {
        this.property = type;
      },
      //添加或编辑发票抬头
      addInvoiceTitleFn(t, id) {
        this.modalType = t;
        if (t === 0) {
          this.makeUp = [];
          this.companyId = id;
          this.modalTitle = "编辑发票抬头";
          this.showModal = true;
          this.getCompany(id);
        } else if (t === 1) {
          if (this.companyList.length < 6) {
            this.makeUp = [];
            this.titleReset('formInline');
            this.modalTitle = "添加发票抬头";
            this.showModal = true;
            this.getCompanyList();
          } else if (this.companyList.length === 6) {
            this.$Message.warning("发票最多只能添加6个");
          }
        }
      },
      // 删除
      deleteCompany(companyId) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>您确定要删除该条记录吗？</p>",
          onOk: () => {
            deleteCompany(companyId).then(res => {
              this.$Message.info("删除成功");
              this.getCompanyList();
            }).catch(error => {
              console.log(error.response);
            });
          }
        });
      },
      getCompany(companyId) {
        getCompany(companyId).then(res => {
          let data = res.data.content;
          this.formInline.name = data.name;
          this.formInline.taxNumber = data.taxNumber;
          this.formInline.bank = data.bank;
          this.formInline.bankAccount = data.bankAccount;
          this.formInline.address = data.address;
          this.formInline.phone = data.phone;
          this.ifDefault = data.ifDefault;
        }).catch(error => {
          console.log(error.response);
        });
      },
      // 抬头填写重置
      titleReset(name) {
        this.showModal = false;
        this.ifDefault = true;
        this.$refs[name].resetFields();
        this.makeUp = [];
      },
      // 选择抬头
      selectCompany(id) {
        this.companyId = id;
        for (let k of this.companyList) {
          if (k.companyId == id) {
            this.companyId = k.companyId;
            this.invoiceForm.purchaserName = k.name;
            this.invoiceForm.purchaserTaxpayerNumber = k.taxNumber;
            this.invoiceForm.purchaserAddress = k.address;
            this.invoiceForm.purchaserPhone = k.phone;
            this.invoiceForm.purchaserBank = k.bank;
            this.invoiceForm.purchaserBankAccount = k.bankAccount;
            this.invoiceForm.companyId = k.companyId;
          }
        }
      },
      // 设为默认
      setDefault(companyId) {
        updateDefaultCompany(companyId).then(res => {
          if (res.data.code === 1) {
            this.$Message.success("操作成功");
            this.getCompanyList();
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      getShopOrder() {
        getState(this.outOrderNo).then(res => {
          if (res.data.code === 1 && res.data.content) {
            this.$router.replace({path: "/invoice/detail", query: {id: res.data.content[0].invoiceId}});
          }
        });
        queryShopOrder(this.outOrderNo).then(res => {
          if (res.data.code == 1) {
            this.outOrder = res.data.content;
            this.price = res.data.content.price;
          }
        });
      },
      selectType() {
        if (this.invoiceForm.type === "企业") {
          this.getCompanyList();
        } else if (this.invoiceForm.type === "个人") {
          this.invoiceForm.purchaserName = "个人";
          this.invoiceForm.purchaserTaxpayerNumber = "";
          this.invoiceForm.address = "";
          this.invoiceForm.phone = "";
          this.invoiceForm.purchaserBank = "";
          this.invoiceForm.purchaserBankAccount = "";
          this.invoiceForm.companyId = "";
        }
      },
      //提交地址
      titleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (!valid) {
            return;
          }
          if (this.modalType === 0) {
            let obj = {};
            obj.accessToken = this.accessToken;
            obj.name = this.formInline.name;
            obj.taxNumber = this.formInline.taxNumber;
            obj.bank = this.formInline.bank;
            obj.bankAccount = this.formInline.bankAccount;
            obj.address = this.formInline.address;
            obj.phone = this.formInline.phone;
            obj.ifDefault = this.ifDefault;
            updateCompany(this.companyId, obj).then(res => {
              if (res.status === 200) {
                this.$Message.success("编辑成功");
                this.handleReset('formInline');
                this.getCompanyList();
              }
            }).catch(error => {
              console.log(error.response);
            });
          } else if (this.modalType === 1) {
            let obj = {};
            obj.accessToken = this.accessToken;
            obj.name = this.formInline.name;
            obj.taxNumber = this.formInline.taxNumber;
            obj.bank = this.formInline.bank;
            obj.bankAccount = this.formInline.bankAccount;
            obj.address = this.formInline.address;
            obj.phone = this.formInline.phone;
            obj.ifDefault = this.ifDefault;
            createCompany(obj).then(res => {
              if (res.status === 200) {
                this.$Message.success("添加成功");
                this.handleReset('formInline');
                this.getCompanyList();
              }
            }).catch(error => {
              console.log(error.response);
            });
          }
        });
      },
      // 重置
      handleReset(name) {
        this.showModal = false;
        this.ifDefault = true;
        this.$refs[name].resetFields();
      },
      chooseRise(index) {
        this.formInline.name = this.makeUp[index].name;
        this.formInline.taxNumber = this.makeUp[index].taxNumber;
        this.formInline.bank = this.makeUp[index].bank;
        this.formInline.bankAccount = this.makeUp[index].bankAccount;
        this.formInline.address = this.makeUp[index].address;
        this.formInline.phone = this.makeUp[index].phone;
        this.makeUp = [];
      },
      getCompanyList() {
        getCompanyList({}).then(res => {
          if (res.data.code == 1) {
            this.companyList = res.data.content;
            this.showInfo = true;
            for (let k of this.companyList) {
              if (k.ifDefault == true) {
                this.companyId = k.companyId;
                this.invoiceForm.purchaserName = k.name;
                this.invoiceForm.purchaserTaxpayerNumber = k.taxNumber;
                this.invoiceForm.purchaserAddress = k.address;
                this.invoiceForm.purchaserPhone = k.phone;
                this.invoiceForm.purchaserBank = k.bank;
                this.invoiceForm.purchaserBankAccount = k.bankAccount;
                this.invoiceForm.companyId = k.companyId;
              }
            }
          } else {
            this.showInfo = false;
            this.companyList = [];
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      getIfManageCompany() {
        this.$ajax({
          method: 'GET',
          url: 'https://fapiao-api.easyapi.com/shop/0/setting?field=ifManageCompany',
          params: {
            accessToken: this.accessToken
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
      //3.获取默认邮寄地址
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
          console.log(error.response);
        });
      },
      //自动补齐
      autocomplete() {
        if (this.formInline.name.length < 4) {
          return;
        }
        getCompanyCodeList({name: this.formInline.name}).then(res => {
          this.code = res.data.code;
          if (res.data.code !== 0) {
            (this.message = ""), (this.makeUp = res.data.content);
          } else {
            this.message = res.data.message;
          }
        }).catch(error => {
          console.log(error.response.data.message);
        });
      },
      //1.获取我的开票账户信息
      getCustomer() {
        getCustomer({taxNumber: this.taxNumber}).then(res => {
          if (res.data.code === 1) {
            this.invoiceForm.email = res.data.content.email;
            this.invoiceForm.mobile = res.data.content.mobile;
          }
        }).catch(error => {
          console.log(error);
        });
      },
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.$Modal.confirm({
              title: '是否开票',
              content: '<p>确认抬头信息并开票吗？</p>',
              onOk: () => {
                let obj = this.invoiceForm;
                obj.accessToken = this.accessToken;
                if (this.property === '纸质') {
                  if (this.defaultAddress == null) {
                    return this.$Message.warning("请填写邮寄地址");
                  }
                  obj.addressId = this.defaultAddress.addressId;
                }
                if (this.companyId === null) {
                  return this.$Message.warning("请选择开票抬头");
                }
                obj.companyId = this.companyId;
                obj.outOrderNo = this.outOrder.outOrderNo;
                obj.items = this.outOrder.items;
                obj.property = this.property;
                if (obj.property === '电子') {
                  obj.category = "增值税电子普通发票";
                }
                obj.email = this.invoiceForm.email;
                obj.addrMobile = this.invoiceForm.mobile;
                this.$ajax({
                  method: "POST",
                  url: "https://fapiao-api.easyapi.com/invoice/make",
                  data: obj,
                }).then(res => {
                  if (res.data.code === 1) {
                    this.$Message.success("提交成功");
                    this.$router.go(0)
                  }
                }).catch(error => {
                  console.log(error);
                  this.$Message.warning(error.response.data.message);
                });
              },
              onCancel: () => {
              }
            });
          }
        });
      },
      jumpPage(url) {
        this.$router.push({path: url});
      }
    },
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
        this.accessToken = localStorage.getItem("accessToken");
      } else if (this.accessToken === "") {
        this.$Message.error('accessToken不能为空');
      }
      if (this.$route.query.outOrderNo) {
        localStorage.setItem("outOrderNo", this.$route.query.outOrderNo);
        this.outOrderNo = localStorage.getItem("outOrderNo");
      } else if (this.outOrderNo === "") {
        this.$Message.error("outOrderNo不能为空！");
      }
      this.accessToken = localStorage.getItem("accessToken");
      this.taxNumber = localStorage.getItem("taxNumber");
      this.outOrderNo = localStorage.getItem("outOrderNo");
    },
    mounted() {
      this.getCompanyList();
      this.getIfManageCompany();
      this.getShopOrder();
      this.getAddressList();
      this.getCustomer();
    }
  };
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
      border-right: 2px solid #2d8cf0 2 d8cf02d8cf0;
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
    border: solid 1px #e1e6eb;
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

  .invioce-title > .invoice-content:nth-child(3n) {
    margin-right 0;
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
    color: #666;
    display: flex;
    justify-content: space-between;
  }

  .address-informations {
    font-size: 14px;
    color: #515a6e;
    height: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }

  .btn {
    width: 88px;
    height: 34px;
    background-color: #2d8cf0;
    color: #ffffff;
    font-size: 14px;
    margin-top: 20px;
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
</style>
