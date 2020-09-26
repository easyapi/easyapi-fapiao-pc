<template>
  <div class="details">
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../../assets/images/logo.png" alt="" style="margin-right: 8px; width: 25px; height: 25px;">
      <BreadcrumbItem to="/">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">发票抬头管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <h3 class="h3-title">您的发票开票金额 ¥ {{ invoice.price }} 元</h3>
      <div class="table-container">
        <!-- <Row class-name="table-title">
          <Col span="24" class-name="">
            <p class="title">
              您的发票开票金额¥{{invoice.price}}元
            </p>
          </Col>
        </Row> -->
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>申请时间</span>
              <p>{{invoice.addTime}}</p>
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
              <p>{{invoice.statements}}
                <a :href="invoice.electronicInvoiceImg" target="_blank">{{invoice.electronicInvoiceImg
                  ? '预览发票' : '暂无预览'}}</a>
                <a :href="invoice.electronicInvoiceUrl" target="_blank">{{invoice.electronicInvoiceUrl
                  ? '下载发票' : '暂无下载'}}</a>
              </p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>开票信息</span>
              <p>{{invoice.failMsg}}</p>
            </div>
          </Col>

          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>电子邮箱</span>
              <p>{{invoice.email}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票备注</span>
              <p>{{invoice.remark}}</p>
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
              <span>开户行及账号</span>
              <p>{{invoice.purchaserBank}} {{invoice.purchaserBankAccount}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r item-long">
              <span>地址及电话</span>
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
              <span>开户行及账号</span>
              <p>{{invoice.sellerBank}} {{invoice.sellerBankAccount}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r item-long">
              <span>地址及电话</span>
              <p>{{invoice.sellerAddress}} {{invoice.sellerPhone}}</p>
            </div>
          </Col>
        </Row>
      </div>
      <h3 style="margin-bottom: 20px" v-if="invoice.serviceType==='订单开票'">订单内容</h3>
      <Table border :stripe='true' :columns="tableTitle" :data="outOrders"
             v-if="invoice.serviceType==='订单开票'"></Table>
    </div>
  </div>
</template>
<script>
  import {getInvoice} from '../../../api/invoice'

  export default {
    name: '',
    components: {},
    data() {
      return {
        invoiceId: '',
        invoice: '',
        time: '',
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
        tableData: [],
        outOrders: []
      }
    },
    methods: {
      /**
       * 获取发票详情
       */
      getInvoice() {
        getInvoice(this.invoiceId).then(res => {
          if (res.data.code === 1) {
            this.invoice = res.data.content;
            this.time = this.invoice.addTime;
            this.tableData = this.invoice.invoiceItems;
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      getOutOrderList() {
        this.$ajax.get('https://fapiao-api.easyapi.com/out-orders', {
          params: {
            accessToken: localStorage.getItem('accessToken'),
            invoiceId: this.invoiceId
          }
        }).then(res => {
          if (res.data.code !== 0) {
            this.outOrders = res.data.content;
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
    },
    //计算属性
    computed: {},
    created() {
      this.invoiceId = this.$route.query.id
    },
    mounted() {
      this.getInvoice();
      this.getOutOrderList();
    },
    watch: {}
  }
</script>
<style scoped lang="stylus">
  @import '../../../assets/styles/invoice.styl'
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
    width: 450px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }
  .ivu-breadcrumb{
    padding:10px 0px 14px;
    font-size:20px;
    border-bottom:1px solid #ddd;
    color: #666;
    font-weight: bold;
  }
</style>
