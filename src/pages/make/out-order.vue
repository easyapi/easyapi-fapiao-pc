<template>
  <div class="control-over-invoices">
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../assets/images/logo.png" alt="" style="margin-right: 8px; width:25px; height: 25px;">
      <BreadcrumbItem to="/" style="color: #333">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">索取发票</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="typeButton flex-r">
        <div
          v-for="(item, index) in orderTypeList"
          :key="index"
          @click="getOutOrderList(item.name)"
          :class="{'active':clicked===item.name}"
        >{{item.name}}
        </div>
      </div>
      <div class="bottom-24">
        <p class="pd-left">有{{minusPage.total}}笔欠费金额，欠费金额小计：¥{{minusAmount}}元</p>
      </div>
      <div class="ivu-form arrearage">
        <Table
          border
          ref="selection"
          :stripe="true"
          :columns="minusTableTitle"
          :data="minusTable"
          :no-data-text="minusLoadingData"
        ></Table>
      </div>
      <div class="page-box flex-r">
        <Page
          :transfer="true"
          :page-size-opts="[10, 50, 100, 200]"
          :total="minusPage.total"
          :page-size="minusPage.size"
          :current="minusPage.page+1"
          @on-change="changeMinusPage"
          @on-page-size-change="pageSizeChangeMinus"
          show-elevator
          show-sizer
        ></Page>
      </div>
      <div class="bottom-24">
        <p class="pd-left">有{{page.total}}个订单可申请发票，可开票金额：¥{{amount}}元</p>
      </div>
      <div class="ivu-form">
        <div class="select-btn">
          <Button @click="handleSelectAll(true)" style="margin:10px 10px 10px 0">设置全选</Button>
          <Button @click="handleSelectAll(false)">取消全选</Button>
        </div>

        <Table
          border
          ref="selection"
          @on-selection-change="tableSelection"
          :stripe="true"
          :columns="tableTitle"
          :data="tableData"
          :no-data-text="loadingData"
        ></Table>
      </div>
      <!-- <div v-if="showMoreBtn" class="show-more-btn">
        <Button @click="handleAddMore">加载更多</Button>
      </div> -->
      <div class="page-box flex-r">
        <Page
          :transfer="true"
          :page-size-opts="[10, 50, 100, 200]"
          :total="page.total"
          :page-size="page.size"
          :current="page.page+1"
          @on-change="changePage"
          @on-page-size-change="pageSizeChange"
          show-elevator
          show-sizer
        ></Page>
      </div>
      <div class="askBtn">
        <div style="float: right; line-height:45px; margin-right:10px">
          <span style="color: #999999;font-size: 12px;">
            待开票金额：
          </span>
          <span style="color: #fa4747;font-size: 24px;vertical-align: middle">¥{{price}}元 </span>
          <Button type="primary" @click="submitInvoice">去开票</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {getOrderTypeList, outOrderListUrl} from "../../api/api";
  import {getOutOrderList} from "../../api/out-order";

  export default {
    name: "",
    components: {},
    data() {
      return {
        orderTypeList: [],
        clicked: "",
        loadingData: '加载中',
        minusLoadingData: '加载中',
        tableTitle: [
          {
            type: "selection",
            width: 60,
            align: "center",
          },
          {
            title: "订单编号",
            key: "no",
            align: "center"
          },
          {
            title: "订单内容",
            align: "center",
            render: (h, params) => {
              return h("span", Object.values(JSON.parse(params.row.fields))[0]);
            }
          },
          {
            title: "类型",
            key: "type",
            align: "center"
          },
          {
            title: "下单时间",
            key: "orderTime",
            align: "center"
          },
          {
            title: "实付金额",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.price.toFixed(2) + "元");
            }
          },
          {
            title: "可开票金额",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.price + "元");
            }
          }
        ],
        minusTableTitle: [
          {
            type: "selection",
            width: 60,
            align: "center",
          },
          {
            title: "订单编号",
            key: "no",
            align: "center"
          },
          {
            title: "订单内容",
            align: "center",
            render: (h, params) => {
              return h("span", Object.values(JSON.parse(params.row.fields))[0]);
            }
          },
          {
            title: "类型",
            key: "type",
            align: "center"
          },
          {
            title: "下单时间",
            key: "orderTime",
            align: "center"
          },
          {
            title: "可开票金额",
            align: "center",
            render: (h, params) => {
              return h("span", "-" + params.row.price + "元");
            }
          }
        ],
        tableData: [],
        minusTable: [],
        minusPage: {
          page: 0,
          size: 10,
          total: 0,
        },
        page: {
          page: 0,
          size: 10,
          total: 0,
        },
        // showMoreBtn: true,
        tableSelectData: [],
        price: 0.0,
        ids: "",
        amount: 0,
        minusAmount: 0,
      };
    },
    methods: {
      getOrderTypeList() {
        getOrderTypeList().then(res => {
          this.orderTypeList = res.data.content;
          this.getOutOrderList(this.orderTypeList[0].name);
        }).catch(error => {
          console.log(error.response);
        });
      },
      getOutOrderList(name) {
        this.loadingData = '加载中';
        this.minusLoadingData = '加载中';
        this.clicked = name;
        // this.showMoreBtn = true;
        this.amount = 0;
        this.price = 0;
        getOutOrderList({type: this.clicked}, this.page).then(res => {
          console.log(res)
          if (res.data.code !== 0) {
            // this.page.total = res.data.totalPages;
            this.tableData = res.data.content;
            for (let v of res.data.content) {
              this.amount += Number(v.price);
            }
            this.page.total = res.data.totalElements;
            // if (this.current + 1 > this.page.total) {
            //   this.showMoreBtn = false;
            // }
            this.$ajax({
              method: "GET",
              url: outOrderListUrl,
              params: {
                maxPrice: -0.01,
                accessToken: localStorage.getItem("accessToken"),
                type: this.clicked,
                state: 0,
                page: this.minusPage.page - 1,
                size: res.data.totalElements
              }
            }).then(res => {
              if (res.data.code == 1) {
                this.minusTable = res.data.content
                for (let i = 0; i < this.minusTable.length; i++) {
                  this.minusTable[i]['_disabled'] = true
                  this.minusTable[i]['_checked'] = true
                }
                for (let v of res.data.content) {
                  this.minusAmount += Number(v.price);
                }
              } else {
                this.minusLoadingData = '暂无数据';
                this.minusTable = [];
                this.minusPage.total = 0;
              }
              // if (res.data.code == 0) {
              //
              // } else {
              //   for (let v of res.data.content) {
              //     this.amount += Number(v.price);
              //   }
              // }
            }).catch(error => {
              this.minusLoadingData = '暂无数据';
              console.log(error.response);
            });
          } else {
            this.loadingData = '暂无数据';
            this.minusLoadingData = '暂无数据';
            this.tableData = [];
            this.page.total = 0;
            // this.showMoreBtn = false;
          }
        }).catch(error => {
          this.loadingData = '暂无数据';
          this.minusLoadingData = '暂无数据';
        });
      },
      //计算金额和ids
      calculatePrice() {
        let price = 0;
        let ids = "";
        for (let v of this.tableSelectData) {
          price += v.price;
          ids += v.outOrderId + ",";
        }
        this.price = (price - this.minusAmount).toFixed(2)
        this.ids = ids.substring(0, ids.length - 1);
      },
      tableSelection(s) {
        console.log(s)
        this.tableSelectData = s;
        this.calculatePrice();
      },
      submitInvoice() {
        if (this.tableSelectData.length === 0) {
          return this.$Message.warning("请选择开票订单");
        } else {
          this.$router.push({
            path: "/make/merge-make",
            query: {id: this.ids, price: this.price}
          });
        }
      },
      //分页
      changePage(page) {
        this.page.page = page - 1;
        this.getOutOrderList(this.clicked);
      },
      pageSizeChange(pageSize){
        this.page.size = pageSize;
        this.getOutOrderList(this.clicked);
      },
      changeMinusPage(page) {
        this.minusPage.page = page - 1;
        this.getOutOrderList(this.clicked);
      },
      pageSizeChangeMinus(pageSize){
        this.minusPage.size = pageSize;
        this.getOutOrderList(this.clicked);
      },
      // 全选按钮
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },
      // 加载更多
      // handleAddMore() {
      //   this.price = 0;
      //   getOutOrderList({type: this.clicked}, this.page.page-1).then(res => {
      //     if (res.data.code == 0) {
      //       return this.$Message.warning("已无更多开票订单！");
      //     } else {
      //       if (res.data.content) {
      //         for (let v of res.data.content) {
      //           this.tableData.push(v);
      //         }
      //       }
      //       // if (this.tableData.length == this.page.total) {
      //       //   this.showMoreBtn = false;
      //       // }
      //     }
      //   }).catch(error => {
      //     console.log(error.response);
      //   });
      // }
    },
    mounted() {
      this.getOrderTypeList();
    }
  };
</script>
<style>
  .ivu-form .ivu-table th {
    background-color: #f5f6fa !important;
  }
</style>
<style scoped lang="stylus">
  @import 'make.styl';
  .control-over-invoices {
    background-color: #fff;
    padding: 20px 40px;
    height: auto;
    border: solid 1px #dddddd;
  }

  .ivu-breadcrumb {
    padding: 0 0 20px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }

  .arrearage {
    margin-bottom 15px
  }
</style>
