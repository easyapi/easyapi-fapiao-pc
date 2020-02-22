<template>
  <div class="demand">
    <h2 class="set-title">
      <!-- <span @click="()=>{this.$router.go(-1)}">
        <Icon type="ios-arrow-back"/>返回
      </span> -->
      <img src="../../assets/images/logo.png" alt style="margin-right: 10px;">发票索取
    </h2>
    <div class="set-content">
      <div class="invoice-nature">
        <p class="invoice">发票形式</p>
        <div style="display: flex;height: 120px;">
          <div
            class="electronic-invoice"
            :class="{SelectedStyle:property==='电子'}"
            @click="selectedProperty('电子')"
          >
            <span style="color: #333333;font-size: 14px;">电子发票</span>
            <span style="font-size: 12px;color: #999999;">最快5分钟开具</span>
            <img
              v-if=" this.property==='电子'"
              src="../../assets/images/default.png"
              alt
              style="position: absolute;bottom:0px;right: 0px;"
            >
          </div>
          <!-- <div
            class="electronic-invoice"
            style="margin-left:20px;"
            :class="{SelectedStyle:property==='纸质'}"
            @click="selectedProperty('纸质')"
          >
            <span style="color: #333333;font-size: 14px;">纸质发票</span>
            <span style="font-size: 12px;color: #999999;">预计2天送达</span>
            <img
              v-if=" this.property==='纸质'"
              src="../../assets/images/default.png"
              alt
              style="position: absolute;bottom:0px;right: 0px;"
            >
          </div>-->
        </div>
      </div>
      <div class="invoice-nature">
        <p class="invoice">发票抬头</p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="抬头类型" prop="type">
            <RadioGroup v-model="formValidate.type">
              <Radio label="企业">企业</Radio>
              <Radio label="个人">个人</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="姓名" prop="purchaserName" v-show="formValidate.type === '个人'">
            <Input v-model="formValidate.purchaserName" placeholder="可输入个人姓名或事业单位名称" style="width: 200px"></Input>
          </FormItem>
          <div class="invioce-title" v-show="formValidate.type === '企业'">
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
              <ul v-if="showInfo">
                <li class="flex-r">
                  <span>发票抬头信息：&nbsp;&nbsp;&nbsp;</span>
                  <p>{{item.name}}</p>
                </li>
                <li class="flex-r">
                  <span>纳税人识别号：&nbsp;&nbsp;&nbsp;</span>
                  <p>{{item.taxNumber}}</p>
                </li>
              </ul>
              <a
                v-if="item.ifDefault != true"
                @click="setDefault(item.companyId)"
                style="padding:10px;"
              >设为默认</a>
              <a @click="addInvoiceTitleFn(0,item.companyId)" style="padding:10px;" v-if="ifManageCompany!=0">编辑</a>
              <a @click="handleDel(item.companyId)" style="padding:10px;" v-if="ifManageCompany!=0">删除</a>
            </div>
            <div class="invoice-content add-title" @click="addInvoiceTitleFn(1)" v-if="ifManageCompany!=0"></div>
          </div>
        </Form>
      </div>
      <div class="invoice-nature">
        <p class="invoice">发票信息</p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <!-- <FormItem label="发票类型" prop="category">
            <RadioGroup v-model="formValidate.category">
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
          <FormItem label="开票备注">
            <Input v-model="formValidate.remark" placeholder="可输入开票备注" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="接收手机" prop="mobile" v-if=" this.property==='电子'">
            <Input v-model="formValidate.mobile" placeholder="请输入手机号码" style="width: 200px;"></Input>
          </FormItem>
          <FormItem label="接收邮箱" prop="email" v-if=" this.property==='电子'">
            <Input v-model="formValidate.email" placeholder="请输入邮箱" style="width: 200px;"></Input>
          </FormItem>
        </Form>
      </div>
      <div
        class="invoice-nature"
        style="border-bottom:1px solid #ddd;height: 250px;"
        v-if=" this.property!=='电子'"
      >
        <p class="invoice">邮寄信息</p>
        <div class="invoice-content" style="height: 182px">
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
            v-if="defaultAddress!==null"
          >{{defaultAddress.district + defaultAddress.addr}}</p>
          <a v-if="showAddressInfo" @click="jumpPage('/address')">更改邮寄地址</a>
          <a v-if="!showAddressInfo" @click="jumpPage('/address')">填写邮寄信息</a>
        </div>
      </div>

      <Button class="btn" @click="handleSubmit('formValidate')">提交</Button>
      <p style="color: #999999;font-size: 12px;margin-bottom: 20px;">请仔细核对开票信息</p>
    </div>
    <Modal v-model="showModal" :title="modalTitle">
      <Form ref="formInline" :model="formInline" :rules="rules" :label-width="100">
        <FormItem label="发票抬头" prop="name">
          <Input v-model="formInline.name" placeholder="请输入发票抬头" @on-change="autocomplete"></Input>
          <div class="query-results" v-if="this.makeUp!==''">
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
          <Input v-model="formInline.taxNumber" placeholder="请输入纳税人识别号"></Input>
        </FormItem>
        <FormItem label="开户行" prop="bank">
          <Input v-model="formInline.bank" placeholder="请输入开户行及账号"></Input>
        </FormItem>
        <FormItem label="开户行账号" prop="bankAccount">
          <Input v-model="formInline.bankAccount" placeholder="请输入开户行账号"></Input>
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model="formInline.address" placeholder="请输入地址"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formInline.phone" placeholder="请输入电话"></Input>
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
  import {
    invoiceMoneyUrl,
    invoiceAddressUrl,
    queryServiceURl,
    companyUrl,orderPriceUrl,
    companiesUrl,
    outOrderListUrl
  } from "../../api/api";

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
        username: "",
        accessToken: "",
        makeUp: "",
        property: "电子",
        ids: "",
        outOrderId: "",
        price: "",
        formValidate: {
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
          this.companyId = id;
          this.modalTitle = "编辑发票抬头";
          this.showModal = true;
          this.getCompany(id);
        } else if (t === 1) {
          if (this.companyList.length < 5) {
            this.modalTitle = "添加发票抬头";
            this.showModal = true;
            this.getCompanyList();
          } else if (this.companyList.length === 5) {
            this.$Message.warning("发票最多只能添加5个");
          }
        }
      },
      // 删除
      handleDel(id) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>您确定要删除该条记录吗？</p>",
          onOk: () => {
            this.$ajax({
              method: "DELETE",
              url: companyUrl + "/" + id,
              params: {
                accessToken: this.accessToken
              }
            })
              .then(res => {
                this.$Message.info("删除成功");
                this.getCompanyList();
              })
              .catch(error => {
                console.log(error.response);
              });
          }
        });
      },
      getCompany(id) {
        this.$ajax({
          method: "GET",
          url: companyUrl + "/" + id,
          params: {
            accessToken: this.accessToken
          }
        })
          .then(res => {
            let data = res.data.content;
            this.formInline.name = data.name;
            this.formInline.taxNumber = data.taxNumber;
            this.formInline.bank = data.bank;
            this.formInline.bankAccount = data.bankAccount;
            this.formInline.address = data.address;
            this.formInline.phone = data.phone;
            this.ifDefault = data.ifDefault;
          })
          .catch(error => {
            console.log(error.response);
          });
      },
      // 抬头填写重置
      titleReset(name) {
        this.showModal = false;
        this.ifDefault = true;
        this.$refs[name].resetFields();
      },
      // 选择抬头
      selectCompany(id) {
        this.companyId = id;
      },
      // 设为默认
      setDefault(id) {
        this.$ajax({
          method: "PUT",
          url: companyUrl + "/" + id,
          data: {
            accessToken: this.accessToken,
            username: this.username,
            ifDefault: true
          }
        })
          .then(res => {
            if (res.data.code === "1") {
              this.$Message.success("操作成功!");
              this.getCompanyList();
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      },
      // 获取订单价格
      getOrderPrice(){
        if(this.$route.query.no){
        this.$ajax({
              method: "GET",
              url: orderPriceUrl+this.$route.query.no,
              params: {
              }
            })
              .then(res => {
                this.price = res.data.content.price;
                this.outOrderId = res.data.content.outOrderId;
              })
              .catch(error => {
                console.log(error.response);
              });
      }else{
        setTimeout(()=>{
          this.$Message.warning("未能获取到订单号；请检查是否正确传入！");
        },2000);

      }
      },
      //提交地址
      titleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
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
              obj.username = this.username;
              this.$ajax({
                method: "PUT",
                url: companyUrl + "/" + this.companyId,
                data: obj
              })
                .then(res => {
                  if (res.status === 200) {
                    this.$Message.success("编辑成功!");
                    this.handleReset('formInline');
                    this.getCompanyList();
                  }
                })
                .catch(error => {
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
              this.$ajax({
                method: 'POST',
                url: companyUrl,
                data: obj
              })
                .then(res => {
                  if (res.status === 200) {
                    this.$Message.success("添加成功!");
                    this.handleReset('formInline');
                    this.getCompanyList();
                  }
                })
                .catch(error => {
                  console.log(error.response);
                });
            }
          } else {
            this.$Message.error("请将信息填写完整!");
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
        this.$ajax({
          method: "GET",
          url: companiesUrl,
          params: {
            accessToken: this.accessToken,
            username: this.username
          }
        })
          .then(res => {
            if (res.status == 200) {
              this.companyList = res.data.content;
              this.showInfo = true;
              for (let k of this.companyList) {
                if (k.ifDefault == true) {
                  this.companyId = k.companyId;
                }
              }
            } else {
              this.showInfo = false;
              this.companyList = null;
            }
          })
          .catch(error => {
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
        this.$ajax({
          method: "GET",
          url: invoiceAddressUrl + this.username + "/default",
          params: {
            accessToken: this.accessToken,
            username: this.username
          }
        })
          .then(res => {
            if (res.data.code === "1") {
              this.defaultAddress = res.data.content;
              this.showAddressInfo = true;
            } else if (res.data.code === 0) {
              this.showAddressInfo = false;
              this.defaultAddress = null;
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      },
      //自动补齐
      autocomplete() {
        if (this.formInline.name.length < 4) {
          return;
        }
        this.$ajax({
          method: "GET",
          url: queryServiceURl,
          params: {
            accessToken: this.accessToken,
            name: this.formInline.name
          }
        })
          .then(res => {
            this.code = res.data.code;
            if (res.data.code !== 0) {
              (this.message = ""), (this.makeUp = res.data.content);
            } else {
              this.message = res.data.message;
            }
          })
          .catch(error => {
            console.log(error.response.data.message);
          });
      },
      //1.获取我的开票账户信息
      getUser() {
        this.$ajax({
          method: "GET",
          url: invoiceMoneyUrl + this.username + "/invoice/money",
          params: {
            accessToken: this.accessToken,
            username: this.username
          }
        })
          .then(res => {
            if (res.data.code === "1") {
              this.formValidate.email = res.data.content.email;
              this.formValidate.mobile = res.data.content.mobile;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let obj = this.formValidate;
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
            obj.username = this.username;
            obj.outOrderIds = this.outOrderId;
            obj.property = this.property;
            obj.email = this.formValidate.email;
            obj.addrMobile = this.formValidate.mobile;

            if (this.type === '个人') {
              obj.purchaserName = this.formValidate.purchaserName;
              obj.companyId = '';
            } else if (this.type === '企业') {
              obj.purchaserName = '';
            }
            this.$ajax({
              method: "POST",
              url: 'https://fapiao-api.easyapi.com/merge-make',
              params: obj,
              headers: {"Content-Type": "application/x-www-form-urlencoded"}
            })
              .then(res => {
                if (res.data.code === "1") {
                  this.$Message.success("提交成功");
                  this.$router.push({
                    path: "/",
                    query: {
                      username: this.username,
                      taxNumber: localStorage.getItem("taxNumber"),
                      accessToken: this.accessToken
                    }
                  });
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.warning(error.response.data.message);
              });
          } else {
            this.$Message.error("请将信息填写完整!");
          }
        });
      },
      jumpPage(url) {
        this.$router.push({path: url, query: {username: this.username}});
      }
    },
    //计算属性
    computed: {},
    created() {
      this.username = this.$route.query.username;
      localStorage.setItem('accessToken',this.$route.query.accessToken);
      this.accessToken = this.$route.query.accessToken;
      this.ids = this.$route.query.id;
      this.formValidate.remark = this.$route.query.remark;
    },
    mounted() {
      this.getCompanyList();
      this.getIfManageCompany();
      this.getOrderPrice();
      this.getAddressList();
      this.getUser();
    },
    watch: {}
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
    height: auto;
    background-color: #ffffff;
    border: solid 1px #dddddd;
  }

  .set-content {
    margin: 0px 20px;
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
    border: 1px solid #18c1d6;
  }

  .invoice-nature .electronic-invoice:hover span {
    color: #18c1d6 !important;
  }

  .SelectedStyle {
    border: solid 1px #18c1d6 !important;
  }

  .SelectedStyle span {
    color: #18c1d6 !important;
  }

  .invoice-nature .electronic-invoice span {
    display: block;
    text-align: center;
  }

  .invoice-content {
    width: 390px
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
    background-color: #18c1d6;
    color: #ffffff;
    font-size: 14px;
    margin-top: 20px;
  }

  .btn:hover {
    background-color: #18c1d6 !important;
    border-color: #18c1d6 !important;
    color: #fff;
  }

  .selecting {
    border: 1px solid #18c1d6 !important;
    color: #18c1d6;
  }
</style>
