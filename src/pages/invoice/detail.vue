<template>
  <div class="details">
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../assets/images/logo.png" alt="" style="margin-right: 8px; width: 25px; height: 25px;">
      <BreadcrumbItem to="/">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">发票详情</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="detail_button">
        <Button v-if="invoice.state===1 && invoice.electronicInvoiceUrl" @click="showInvoice">预览发票</Button>
        <Button v-if="invoice.state===1 && invoice.electronicInvoiceUrl">
          <a :href="invoice.electronicInvoiceUrl" target="_blank">下载发票</a>
        </Button>
      </div>
      <div class="table-container">
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>申请时间</span>
              <p>{{invoice.addTime}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>开票时间</span>
              <p>{{invoice.printTime}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票类型</span>
              <p>{{invoice.category}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票状态</span>
              <p>{{invoice.statements}}</p>
            </div>
          </Col>
          <Col v-show="invoice.category === '增值税电子普通发票'" span="12" class-name="">
            <div class="item-td flex-r">
              <span>电子邮箱</span>
              <p>{{invoice.email}}</p>
            </div>
          </Col>
          <Col v-show="invoice.category === '增值税普通发票'" span="12" class-name="">
            <div class="item-td flex-r">
              <span>邮寄地址</span>
              <p>{{invoice.purchaserAddress}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>手机号码</span>
              <p>{{invoice.addrMobile}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span style="min-width:120px">开票信息</span>
              <p>{{invoice.failMsg}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票备注</span>
              <p>{{invoice.remark}}</p>
            </div>
          </Col>
          <Col span="12" class-name="" v-if="invoice.code">
            <div class="item-td flex-r">
              <span style="min-width:120px">发票代码</span>
              <p>{{invoice.code}}</p>
            </div>
          </Col>
          <Col span="12" class-name="" v-if="invoice.code">
            <div class="item-td flex-r">
              <span>发票号码</span>
              <p>{{invoice.number}}</p>
            </div>
          </Col>
        </Row>
        <h3 style="margin: 20px 0;">购买方</h3>
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>名称</span>
              <p>{{invoice.purchaserName}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>纳税人识别号</span>
              <p>{{invoice.purchaserTaxpayerNumber}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r item-long">
              <span style="min-width:120px">开户行及账号</span>
              <p>{{invoice.purchaserBank}} {{invoice.purchaserBankAccount}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r item-long">
              <span style="min-width:120px">地址及电话</span>
              <p>{{invoice.purchaserAddress}} {{invoice.purchaserPhone}}</p>
            </div>
          </Col>
        </Row>
        <h3 style="margin: 20px 0;">销售方</h3>
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>名称</span>
              <p>{{invoice.sellerName}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>纳税人识别号</span>
              <p>{{invoice.sellerTaxpayerNumber}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r item-long">
              <span style="min-width:120px">开户行及账号</span>
              <p>{{invoice.sellerBank}} {{invoice.sellerBankAccount}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r item-long">
              <span style="min-width:120px">地址及电话</span>
              <p>{{invoice.sellerAddress}} {{invoice.sellerPhone}}</p>
            </div>
          </Col>
        </Row>
        <h3 @click="num=0" :class="{active:num === 0}" class="tag">发票内容</h3>
        <h3 @click="num=1" :class="{active:num ===1 }" class="tag">订单明细</h3>
        <Row>
          <div v-show="num === 0" class="ivoiveContent">
            <Table border :columns="invoiceItemTitle" :data="invoice.invoiceItems" disabled-hover></Table>
            <div class="table-amount">
              <p>税额合计：{{getTaxAmount()}}元 &nbsp;&nbsp;&nbsp;&nbsp;
                价额合计：{{getPriceAmount()}}元</p>
            </div>
          </div>
          <div v-show="num === 1" class="ivoiveContent">
            <Table :columns="invoiceDetailTitle" :data="outOrderList"></Table>
          </div>
        </Row>
      </div>
      <h3 style="margin-bottom: 20px" v-if="invoice.serviceType === '订单开票'">订单内容</h3>
      <Table border :stripe='true' :columns="tableTitle" :data="outOrders" v-if="invoice.serviceType ==='订单开票'"></Table>
    </div>
    <Modal
      width="1000px"
      v-model="isShowInvoice"
      title="预览发票"
      @on-ok="isShowInvoice === false"
      @on-cancel="isShowInvoice === false">
      <div class="imgBox" :style="{backgroundImage:'url('+invoice.electronicInvoiceImg+')'}"></div>
    </Modal>
  </div>
</template>
<script>
  import {getInvoice} from '../../api/invoice'
  import {getOutOrderList} from '../../api/out-order'

  export default {
    name: '',
    components: {},
    data() {
      return {
        isShowInvoice: false,
        num: 0,
        invoice: {invoiceId: null, invoiceItems: []},//发票信息
        outOrderList: [],//发票关联外部订单列表
        outOrders: [],
        page: {
          size: 10,
          page: 0
        },
        tableTitle: [
          {
            title: '订单编号',
            key: 'no',
            align: 'center'
          },
          {
            title: '订单内容',
            align: 'center',
            render: (h, params) => {
              return h('span', Object.values(JSON.parse(params.row.fields))[0]);
            }
          },
          {
            title: "类型",
            key: "type",
            align: "center"
          },
          {
            title: '下单时间',
            key: 'addTime',
            align: 'center'
          },
          {
            title: '金额',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.price)
            }
          }
        ],
        invoiceDetailTitle: [
          {
            title: "日期",
            key: "addTime",
            align: "center"
          },
          {
            title: "订单号",
            key: "no",
            align: "center"
          },
          {
            title: "订单类型",
            key: "type",
            align: "center"
          },
          {
            title: "价格",
            key: "price",
            align: "center"
          },
          {
            title: "描述",
            key: "fields",
            align: "center"
          },
          {
            title: "明细",
            key: "tax",
            align: "center",
            render: (h, params) => {
              let value = params.row.tax
              return h('a', {
                  on: {
                    click: () => {
                      this.showDrawer = true
                      this.chooseActivityId = params.row.id
                    }
                  }
                },
                value
              )
            }
          }
        ],
        invoiceItemTitle: [
          {
            title: "货物或应税劳务、服务名称",
            align: "center",
            width: 300,
            render: (h, params) => {
              return h("p", {}, `*${params.row.category}*${params.row.name}`);
            }
          },
          {
            title: "规格型号",
            key: "model",
            align: "center"
          },
          {
            title: "单位",
            key: "unit",
            align: "center"
          },
          {
            title: "数量",
            key: "number",
            align: "center"
          },
          {
            title: "含税单价",
            key: "price",
            align: "center"
          },
          {
            title: "含税金额",
            key: "--",
            align: "center",
            render: (h, params) => {
              return h("p", {}, `${params.row.sum * 1}`);
            }
          },
          {
            title: "税率",
            key: "taxRate",
            align: "center",
            render: (h, params) => {
              return h("p", {}, `${params.row.taxRate * 100}%`);
            }
          },
          {
            title: "税额",
            key: "tax",
            align: "center"
          }
        ],
      }
    },
    methods: {
      /**
       * 预览发票
       */
      showInvoice() {
        this.isShowInvoice = true
      },
      /**
       * 获取外部订单列表
       */
      getOutOrderList() {
        getOutOrderList({invoiceId: this.$route.query.id}, this.page).then(res => {
          if (res.code === 1) {
            this.outOrderList = res.data.content
            this.outOrders = res.data.content;
          }
        })
      },
      /**
       * 获取发票详情
       */
      getInvoice() {
        getInvoice(this.$route.query.id).then(res => {
          if (res.data.code === 1) {
            this.invoice = res.data.content;

          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      /**
       * 获取税额合计
       */
      getTaxAmount(data) {
        let tmp = 0;
        this.invoice.invoiceItems.map(el => {
          tmp += el.tax;
        });
        return tmp;
      },
      /**
       * 获取价格合计
       */
      getPriceAmount() {
        let tmp = 0;
        this.invoice.invoiceItems.map(el => {
          tmp += el.sum;
        });
        return tmp;
      }
    },
    mounted() {
      this.getInvoice();
      this.getOutOrderList();
    }
  }
</script>
<style scoped lang="stylus">
  @import '../../assets/styles/invoice.styl'
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
</style>
<style scoped>
  .details {
    padding: 20px 40px;
    height: auto;
    background-color: #ffffff;
    border: solid 1px #dddddd;
  }

  .item-td span {
    width: 120px;
    height: 42px;
    background-color: #f5f6fa;
    display: block;
    border-bottom: 1px solid #d6d6d6;
    border-right: 1px solid #d6d6d6;
  }

  .item-td p {
    padding-left: 10px;
  }

  .item-long p {
    padding-left: 10px;
    text-align: left;
    line-height: 21px;
  }

  .ivu-breadcrumb {
    padding: 0 0 20px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }

  .table-amount {
    padding-left: 18px;
    padding-right: 18px;
    border: 1px solid #dcdee2;
    border-top: none;
    text-align: right;
    line-height: 48px;
  }

  .ivoiveContent >>> span {
    color: #666;
    font-weight: normal;
  }

  .ivoiveContent >>> th {
    background-color: #f5f6fa;
  }

  .tag {
    margin: 20px 0 10px;
    display: inline-block;
    padding: 14px 25px;
    cursor: pointer;
  }

  .tag:hover {
    opacity: 0.75;
  }

  .active {
    color: #18C1D6;
    background: #FFF;
    border-top: 2px solid #18C1D6;
    border-bottom: 2px solid #FFF;
    border-left: 1px solid #E1E6EB;
    border-right: 1px solid #E1E6EB;
    margin-top: -1px;
    margin-bottom: -2px;
  }

  .detail_button {
    margin: 10px 0;
    height: 32px;
    width: 250px;
    justify-content: space-between;
  }

  .detail_button > Button {
    margin-right: 10px;
  }

  .imgBox {
    width: 100%;
    height: 640px;
    background-size: cover;
  }
</style>
