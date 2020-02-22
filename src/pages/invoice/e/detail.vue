<template>
  <div class="details">
    <h2 class="set-title">
      <span @click="()=>{this.$router.go(-1)}"><Icon type="ios-arrow-back"/>返回</span>
      <img src="../../../assets/images/logo.png" alt="" style="margin-right: 10px;">发票详情
    </h2>
    <div class="set-content">
      <div class="table-container">
        <Row class-name="table-title">
          <Col span="24" class-name="">
            <p class="title">
              您的发票开票金额¥{{invoiceDetailData.price}}元
            </p>
          </Col>
        </Row>
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>申请时间</span>
              <p>{{invoiceDetailData.addTime}}</p>
            </div>
          </Col>

          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票类型</span>
              <p>{{invoiceDetailData.category}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票状态</span>
              <p>{{invoiceDetailData.statements}}
                <a :href="invoiceDetailData.electronicInvoiceImg" target="_blank">{{invoiceDetailData.electronicInvoiceImg?'预览发票':'暂无预览'}}</a>
                <a :href="invoiceDetailData.electronicInvoiceUrl" target="_blank">{{invoiceDetailData.electronicInvoiceUrl?'下载发票':'暂无下载'}}</a>
              </p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>开票信息</span>
              <p>{{invoiceDetailData.failMsg}}</p>
            </div>
          </Col>

          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>电子邮箱</span>
              <p>{{invoiceDetailData.email}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>发票备注</span>
              <p>{{invoiceDetailData.remark}}</p>
            </div>
          </Col>
        </Row>
        <h3 style="margin: 20px 0;">购买方</h3>
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>名称</span>
              <p>{{invoiceDetailData.purchaserName}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>纳税人识别号</span>
              <p>{{invoiceDetailData.purchaserTaxpayerNumber}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>开户行及账号</span>
              <p>{{invoiceDetailData.purchaserBank}} {{invoiceDetailData.purchaserBankAccount}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>地址及电话</span>
              <p>{{invoiceDetailData.purchaserAddress}} {{invoiceDetailData.purchaserPhone}}</p>
            </div>
          </Col>
        </Row>
        <h3 style="margin: 20px 0;">销售方</h3>
        <Row class-name="table-body">
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>名称</span>
              <p>{{invoiceDetailData.sellerName}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>纳税人识别号</span>
              <p>{{invoiceDetailData.sellerTaxpayerNumber}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>开户行及账号</span>
              <p>{{invoiceDetailData.sellerBank}} {{invoiceDetailData.sellerBankAccount}}</p>
            </div>
          </Col>
          <Col span="12" class-name="">
            <div class="item-td flex-r">
              <span>地址及电话</span>
              <p>{{invoiceDetailData.sellerAddress}} {{invoiceDetailData.sellerPhone}}</p>
            </div>
          </Col>
        </Row>
      </div>
      <h3 style="margin-bottom: 20px" v-if="invoiceDetailData.serviceType==='订单开票'">订单内容</h3>
      <Table border :stripe='true' :columns="tableTitle" :data="outOrders"
             v-if="invoiceDetailData.serviceType==='订单开票'"></Table>
    </div>
  </div>
</template>
<script>
  import {invoiceRecordUrl} from '../../../api/api'

  export default {
    name: '',
    components: {},
    data() {
      return {
        invoiceId: '',
        invoiceDetailData: '',
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
      getInvoiceDetail() {
        this.$ajax.get(invoiceRecordUrl + this.invoiceId, {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          if (res.data.code === "1") {
            this.invoiceDetailData = res.data.content;
            this.time = this.invoiceDetailData.addTime;
            this.tableData = this.invoiceDetailData.invoiceItems;
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
      this.getInvoiceDetail();
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
    background-color: #fff;
    padding: 20px 40px;
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
</style>
