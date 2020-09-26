<template>
  <div class="Invoice-details">
    <Breadcrumb>
      <img src="../assets/images/logo.png" alt="" style="margin-right: 8px; width:25px; height: 25px;">
      <BreadcrumbItem style="color: #333;">发票管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="invoice-base-info flex-r">
        <div class="openInvoice-money">
          <p class="invoice-base-title">可开票金额</p>
          <div class="txt-center" style="font-size: 24px">
            ¥{{onInvoiceAccount===null?0:onInvoiceAccount.balance}}元
          </div>
          <Button type="primary" @click="jumpPage('make/out-order')">索取发票</Button>
        </div>
        <div class="openInvoice-info ">
          <p class="invoice-base-title">开票信息</p>
          <div class="onInvoice-content flex-c" v-if="showInfo">
            <div class="flex-r">
              <span class="invoice-base-title">发票抬头：</span>
              <p style="	font-size: 14px;color: #333333;">{{defaultCompany.name}}</p>
            </div>
            <div class="flex-r">
              <span class="invoice-base-title">发票税号：</span>
              <p style="	font-size: 14px;color: #333333;">{{defaultCompany.taxNumber}}</p>
            </div>
            <a class="modify-style" @click="jumpPage('/company')">更改开票信息
              <Icon size="15" type="md-create" style="margin-left:1px;"/>
            </a>
          </div>
          <div class="flex-r" v-if="!showInfo">
            <span>您还没有填写开票信息</span>
            <a class="flex-r modify-style" @click="jumpPage('/company')">现在填写
              <Icon size="17" type="md-create" style="margin-left:6px;"/>
            </a>
          </div>
        </div>
        <div class="openInvoice-mailInfo">
          <p class="invoice-base-title">邮寄信息</p>
          <div class="onInvoice-content flex-c" v-if="showAddressInfo">
            <div class="flex-r">
              <p style="	font-size: 14px;color: #333333;">{{defaultAddress.name+" "+defaultAddress.mobile}}</p>
            </div>
            <div class="flex-r" style="height: auto">
              <p style="line-height:15px;font-size: 14px;color: #333333;">
                {{defaultAddress.province+defaultAddress.city+defaultAddress.district+defaultAddress.addr}}</p>
            </div>
            <a class="modify-style" @click="jumpPage('/address')">更改邮寄地址
              <Icon size="15" type="md-create" style="margin-left:1px;"/>
            </a>
          </div>
          <div class="flex-r" v-if="!showAddressInfo">
            <span>您还没有填写邮寄信息</span>
            <a class=" flex-r modify-style" @click="jumpPage('/address')">现在填写
              <Icon size="17" type="md-create" style="margin-left:6px;"/>
            </a>
          </div>
        </div>
      </div>
      <div class="search-data-container flex-r">
        <div class="search-data flex-r">
          <div>
            <span class="area">起止时间</span>
            <DatePicker type="daterange" placeholder="选择日期" @on-change="timeRangeChange"
                        style="width: 210px; margin-right: 4px"></DatePicker>
            <!-- <DatePicker @on-change="startTimeChange" type="datetime" placeholder="起始时间"
                        style="width: 180px;margin-right: 5px"></DatePicker>
            <span>-</span>
            <DatePicker @on-change="endTimeChange" type="datetime" placeholder="结束时间" style="width: 180px;margin-left: 5px"></DatePicker> -->
          </div>
          <Select clearable v-model="state" style="width:190px; margin-right:4px" class="left-10"
                  placeholder="请选择发票状态...">
            <Option v-for="item in stateList" :value="item" :key="item">{{ item}}</Option>
          </Select>
          <Input clearable v-model="purchaserName" placeholder="请输入发票抬头..." style="width: 190px" class="left-10"/>
        </div>
        <div>
          <Button @click="getInvoiceListReset" type="primary">查询</Button>
        </div>
      </div>
      <!-- <div class="option">
        <span class="Nature-of-invoice" :class="{SelectedStyle:select==='电子'}" @click="SelectedType('电子')">电子发票</span>
        <span class="Nature-of-invoice" :class="{SelectedStyle:select==='纸质'}" @click="SelectedType('纸质')">纸质发票</span>
      </div> -->
      <Table border :stripe='true' :columns="tableTitle" :no-data-text="loadingData" :data="tableData"></Table>
      <div class="page-box flex-r" v-if="obtainCode!==0">
        <Page :total='total' :page-size="pageSize" :current="current" @on-change="changePage" show-elevator></Page>
      </div>
      <div class="Hint">
        <p>每次消费后都可以开具相应的发票。</p>
        <p>请仔细填写申请发票信息，如果填写错误造成作废在开具，需要承担相关服务费20元。</p>
        <p>目前自助暂仅支持普通电子发票开票，如需开专用发票请联系对应销售</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    invoiceMoneyUrl,
    applicationRecordUrl
  } from '../api/api'
  import {
    getInvoiceList
  } from '../api/invoice'
  import {
    getDefaultCompany
  } from '../api/company'
  import {
    getDefaultAddress
  } from '../api/address'
  import {
    getCustomer
  } from '../api/customer'

  export default {
    name: '',
    components: {},
    data() {
      return {
        accessToken: '',
        onInvoiceAccount: null,
        showInfo: true,
        defaultCompany: '',
        showAddressInfo: true,
        defaultAddress: '',
        select: null,
        startTime: '',
        endTime: '',
        obtainCode: '',
        stateList: '',
        state: '',
        purchaserName: '',//发票抬头
        loadingData: '加载中',
        tableTitle: [
          {
            title: '申请日期',
            key: 'addTime',
            align: 'center'
          },
          {
            title: '发票抬头',
            key: 'purchaserName',
            align: 'center'
          },
          {
            title: '金额',
            align: 'center',
            width: 90,
            render: (h, params) => {
              return h('span', params.row.price + "元");
            }
          },
          {
            title: '发票状态',
            key: 'statements',
            align: 'center'
          },
          {
            title: '发票性质',
            key: 'type',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'error',
                //     size: 'small'
                //   },
                //   style: {
                //     marginRight: '5px',
                //
                //   },
                //   on: {
                //     click: () => {
                //       this.$Modal.confirm({
                //         title: '提示',
                //         content: '<p>您确定要将此开票信息作废吗？</p>',
                //         onOk: () => {
                //           this.$ajax({
                //             method: 'PUT',
                //             url: invoiceRecordUrl + params.row.invoiceId + '/cancel',
                //             params: {
                //               accessToken: localStorage.getItem('accessToken'),
                //             },
                //             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                //           }).then(res => {
                //             console.log(res)
                //             this.$Message.info('操作成功');
                //           }).catch(error => {
                //             console.log(error.response)
                //             this.$Message.warning(error.response.data.message)
                //           });
                //         }
                //       });
                //     }
                //   }
                // }, '作废'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/invoice/e/detail', query: {id: params.row.invoiceId}})
                    }
                  }
                }, '详情')
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
      // SelectedType(type) {
      //   this.select = type
      //   this.getInvoiceList()
      // },
      //1.获取我的开票账户信息
      getCustomer() {
        getCustomer({}).then(res => {
          if (res.data.code === 1) {
            this.onInvoiceAccount = res.data.content
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      //2.获取我的默认抬头信息
      getDefaultCompany() {
        getDefaultCompany().then(res => {
          if (res.data.code === 1) {
            this.defaultCompany = res.data.content;
            this.showInfo = true
          } else if (res.data.code === 0) {
            this.showInfo = false
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      //3.获取默认邮寄地址
      getAddress() {
        getDefaultAddress().then(res => {
          if (res.data.code === 1) {
            this.defaultAddress = res.data.content;
            this.showAddressInfo = true
          } else if (res.data.code === 0) {
            this.showAddressInfo = false
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      jumpPage(url) {
        this.$router.push({path: url})
      },
      timeRangeChange(t) {
        this.startTime = t[0] && `${t[0]} 00:00:00`;
        this.endTime = t[1] && `${t[1]} 23:59:59`;
      },
      //获取发票申请记录查询选项
      getApplicationItem() {
        this.$ajax.get(applicationRecordUrl, {
          params: {
            accessToken: localStorage.getItem('accessToken'),
          }
        }).then(res => {
          this.stateList = res.data.content
          console.log(this.stateList)
        }).catch(error => {
          console.log(error)
        });
      },
      //4.获取开票列表
      getInvoiceList() {
        this.loadingData = '加载中';
        let params = {
          startAddTime: this.startTime,
          endAddTime: this.endTime,
          purchaserName: this.purchaserName,
          statements: this.state,
          page: this.current - 1,
          size: this.pageSize,
          property: this.select
        };
        getInvoiceList(params).then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.content;
            this.total = Number(res.data.totalElements);
          } else {
            this.loadingData = '暂无数据';
            this.tableData = [];
            this.total = 0;
          }
        }).catch(error => {
          this.loadingData = '暂无数据'
          console.log(error)
          this.$Message.warning(error.response.data.message)
        });
      },
      getInvoiceListReset() {
        this.current = 1;
        this.getInvoiceList()
      },
      //分页
      changePage(current) {
        this.current = current;
        this.getInvoiceList()
      },
    },
    //计算属性
    computed: {},
    created() {
      this.accessToken = this.$route.query.accessToken;
      localStorage.setItem("accessToken", this.accessToken);
      this.taxNumber = this.$route.query.taxNumber;
      localStorage.setItem("taxNumber", this.taxNumber);
    },
    mounted() {
      this.getCustomer();
      this.getDefaultCompany();
      this.getAddress();
      this.getInvoiceList()
      this.getApplicationItem()
    },
    watch: {}
  }
</script>
<style scoped lang="stylus">
  @import '../assets/styles/invoice.styl'
</style>
<style scoped>
  .Invoice-details {
    background-color: #fff;
    padding: 20px 40px;
    height: auto;
    border: solid 1px #dddddd;
  }

  .set-content {
    width: 100%;
    height: auto;
    padding: 20px 0;
  }

  .invoice-base-title {
    color: #999999;
    font-size: 14px;
  }

  /* .openInvoice-money button {
    background-color: #18c1d6;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
  } */

  .invoice-base-info {
    background-color: #f5f6fa;
  }

  .modify-style {
    color: #2d8cf0 !important;
    font-size: 14px;
  }

  .btn {
    width: 60px;
    height: 34px;
    background-color: #18c1d6;
    border-radius: 4px;
    border-color: #18c1d6;
    color: #fff;
  }

  .btn:hover {
    border-color: #18c1d6;
    background-color: #18c1d6;
    color: #fff;
  }

  .option {
    width: 100%;
    height: 50px;
    background-color: #f5f6fa;
    border: solid 1px #e1e6eb;
    margin-bottom: 20px;
  }

  .option .Nature-of-invoice {
    width: 120px;
    height: 49px;
    background-color: #f5f6fa;
    display: block;
    text-align: center;
    line-height: 49px;
    border-bottom: 1px solid #e1e6eb;
    border-right: 1px solid #e1e6eb;
    cursor: pointer;
    color: #333333;
    font-size: 14px;
    float: left;
  }

  .SelectedStyle {
    color: #2d8cf0 !important;
    background-color: #ffffff !important;
    border-bottom: none !important;
  }

  .Hint {
    width: 100%;
    height: auto;
    margin-top: 10px;
  }

  .Hint p {
    width: 100%;
    height: 20px;
    line-height: 20px;
    color: #999999;
    font-size: 12px;
  }

  .area {
    margin-right: 12px;
  }

  .ivu-breadcrumb {
    padding: 10px 0px 14px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }
</style>
