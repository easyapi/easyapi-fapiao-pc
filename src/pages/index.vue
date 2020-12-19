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
            ¥{{customer.balance}}元
          </div>
          <Button type="primary" @click="jumpPage('/out-order')">索取发票</Button>
        </div>
        <div class="openInvoice-info ">
          <p class="invoice-base-title">开票信息</p>
          <div class="onInvoice-content flex-c" v-if="showInfo">
            <div class="flex-r">
              <span class="invoice-base-title">抬头：</span>
              <p style="font-size: 14px;color: #333333;">{{defaultCompany.name }}</p>
            </div>
            <div class="flex-r">
              <span class="invoice-base-title">税号：</span>
              <p style="font-size: 14px;color: #333333;">{{defaultCompany.taxNumber}}</p>
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
              <span class="invoice-base-title">收件人：</span>
              <p style="	font-size: 14px;color: #333333;">{{defaultAddress.name}} {{defaultAddress.mobile}}</p>
            </div>
            <div class="flex-r" style="height: auto">
              <span class="invoice-base-title">地址：</span>
              <p style="line-height:15px;font-size: 14px;color: #333333;">
                {{defaultAddress.province}} {{defaultAddress.city}} {{defaultAddress.district}}
                {{defaultAddress.addr}}</p>
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
            <span class="area">开票时间</span>
            <DatePicker type="daterange" placeholder="开票时间范围" @on-change="timeRangeChange"
                        style="width: 220px; margin-right: 4px"></DatePicker>
          </div>
          <Select clearable v-model="search.statements" style="width:190px; margin-right:4px" class="left-10"
                  placeholder="发票状态">
            <Option v-for="item in statementsList" :value="item" :key="item">{{ item}}</Option>
          </Select>
          <Input clearable v-model="search.purchaserName" placeholder="发票抬头" style="width: 190px" class="left-10"/>
        </div>
        <div>
          <Button @click="getInvoiceListReset" type="primary">查询</Button>
        </div>
      </div>
      <Table border :stripe='true' :columns="tableTitle" :no-data-text="loadingText" :data="tableData"></Table>
      <div class="page-box flex-r" v-if="page.total!=0">
        <Page :total='page.total' :page-size="page.size" :current="page.current" @on-change="changePage" show-total
              show-sizer></Page>
      </div>
      <div class="Hint">
        <dl v-html="this.content">
          {{this.content}}
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
  import {getInvoiceList, getInvoiceStatementsList} from '../api/invoice'
  import {getDefaultCompany} from '../api/company'
  import {getDefaultAddress} from '../api/address'
  import {getCustomer} from '../api/customer'
  import {getSettings} from '../api/setting'

  export default {
    name: '',
    components: {},
    data() {
      return {
        customer: {balance: 0},//开票用户客户信息
        showInfo: true,
        defaultCompany: {},
        showAddressInfo: true,
        defaultAddress: {},
        search: {
          startTime: '',
          endTime: '',
          purchaserName: '',//发票抬头
          statements: '',
        },
        statementsList: [],
        loadingText: '加载中',
        tableTitle: [
          {
            title: '申请日期',
            key: 'addTime',
            align: 'center',
            width: 180
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
                      this.$router.push({path: '/invoice/detail', query: {id: params.row.invoiceId}})
                    }
                  }
                }, '详情')
              ]);
            }
          }
        ],
        tableData: [],
        page: {
          current: 1,
          size: 10,
          total: 0,
        },
        content: "",//底部备注
      }
    },
    methods: {
      /**
       * 获取我的开票账户信息
       */
      getCustomer() {
        getCustomer({}).then(res => {
          if (res.data.code === 1) {
            this.customer = res.data.content
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      /**
       * 获取我的默认抬头信息
       */
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
      /**
       * 获取默认邮寄地址
       */
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
      /**
       * 获取首页底部备注
       */
      getSettings() {
        getSettings({fieldKeys: "pc_index_remark"}).then(res => {
          this.content = res.data.content[0].fieldValue
        })
      },
      jumpPage(url) {
        this.$router.push({path: url})
      },
      timeRangeChange(t) {
        this.search.startTime = t[0] && `${t[0]} 00:00:00`;
        this.search.endTime = t[1] && `${t[1]} 23:59:59`;
      },
      /**
       * 获取发票状态列表
       */
      getStatementsList() {
        getInvoiceStatementsList().then(res => {
          this.statementsList = res.data.content
        }).catch(error => {
          console.log(error)
        });
      },
      /**
       * 获取开票列表
       */
      getInvoiceList() {
        this.loadingText = '加载中';
        let params = {
          ...this.search,
          page: this.page.current - 1,
          size: this.page.size
        };
        getInvoiceList(params).then(res => {
          if (res.data.code === 1) {
            this.tableData = res.data.content;
            this.page.total = res.data.totalElements;
          } else {
            this.loadingText = '暂无数据';
            this.tableData = [];
            this.page.total = 0;
          }
        }).catch(error => {
          this.loadingText = '暂无数据'
          this.$Message.warning(error.response.data.message)
        });
      },
      getInvoiceListReset() {
        this.page.current = 1;
        this.getInvoiceList()
      },
      changePage(current) {
        this.page.current = current;
        this.getInvoiceList()
      },
    },
    created() {
      if (this.$route.query.accessToken) {
        localStorage.setItem("accessToken", this.$route.query.accessToken);
      }
      if (this.$route.query.taxNumber) {
        localStorage.setItem("taxNumber", this.$route.query.taxNumber);
      }
    },
    mounted() {
      this.getCustomer();
      this.getDefaultCompany();
      this.getAddress();
      this.getInvoiceList();
      this.getStatementsList();
      this.getSettings();
    }
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
    padding: 0 0 20px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }
</style>
