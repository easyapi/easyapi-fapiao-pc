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
          :class="{'active':orderType===item.name}"
        >{{item.name}}
        </div>
      </div>
      <div class="bottom-24" v-if="this.minusTable.length = 0">
        <p class="pd-left">有{{this.minusTable.length}}笔欠费金额，欠费金额小计：¥{{minusAmount}}元</p>
      </div>
      <div class="ivu-form arrearage" v-if="this.minusTable.length = 0">
        <Table
          border
          ref="selection"
          :stripe="true"
          :columns="minusTableTitle"
          :data="minusTable"
        ></Table>
      </div>
      <div class="bottom-24">
        <p class="pd-left">有{{page.total}}个订单可申请发票，总金额：¥{{customer.balance}}元</p>
      </div>
      <div class="ivu-form">
        <div class="select-btn">
          <Button @click="handleSelectAllPage(true)" style="margin:10px 10px 10px 0">跨页全选</Button>
          <Button @click="handleSelectAllPage(false)">取消全选</Button>
        </div>
        <Table
          border
          ref="selection"
          @on-select="handleSelect"
          @on-select-cancel="handleCancel"
          @on-select-all="handleSelectAll"
          @on-select-all-cancel="handleCancelSelectAll"
          :stripe="true"
          :columns="tableTitle"
          :data="tableData"
          :no-data-text="loadingText"
        ></Table>
      </div>
      <div class="page-box flex-r">
        <Page
          :transfer="true"
          :page-size-opts="[10, 50, 100, 200]"
          :total="page.total"
          :page-size="page.size"
          :current="page.page + 1"
          @on-change="changePage"
          @on-page-size-change="pageSizeChange"
          show-total
          show-sizer
        ></Page>
      </div>
      <div class="askBtn">
        <div style="float: right; line-height:45px; margin-right:10px">
          <sapn class="out-order_select">已选订单数:{{selected.length}}个</sapn>
          <span style="color: #999999;font-size: 12px;">
            开票金额：
          </span>
          <span style="color: #fa4747;font-size: 24px;vertical-align: middle">¥{{price}}元 </span>
          <Button type="primary" @click="gotoMakeInvoice">去开票</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {getOutOrderList} from "../../api/out-order";
  import {getOrderTypeList} from "../../api/order-type";
  import {getCustomer} from '../../api/customer'

  export default {
    name: "MakeOutOrder",
    components: {},
    data() {
      return {
        customer: {balance: 0},//开票用户客户信息
        orderTypeList: [],//订单类型列表
        orderType: "",//已选择订单类型
        loadingText: '加载中',
        ids: "",//已选订单IDs（多个用逗号隔开）
        minusTable: [],//欠票订单列表
        minusAmount: 0.0,//欠票总金额
        price: 0.0,//已选开票金额
        selected: [],//已选订单
        tableData: [],//外部订单列表
        page: {
          page: 0,
          size: 10,
          total: 0,
        },
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
            align: "center",
            width: 180
          },
          {
            title: "实付金额",
            align: "center",
            width: 150,
            render: (h, params) => {
              return h("span", params.row.price.toFixed(2) + "元");
            }
          },
          {
            title: "可开票金额",
            align: "center",
            width: 150,
            render: (h, params) => {
              return h("span", params.row.price + "元");
            }
          }
        ]
      };
    },
    methods: {
      /**
       * 获取订单类型
       */
      getOrderTypeList() {
        getOrderTypeList().then(res => {
          this.orderTypeList = res.data.content;
          this.getMinusOutOrderList(this.orderTypeList[0].name);
          this.getOutOrderList(this.orderTypeList[0].name);
        }).catch(error => {
          console.log(error.response);
        });
      },
      /**
       * 获取全部负数（欠费）外部订单列表
       */
      getMinusOutOrderList(type) {
        getOutOrderList({maxPrice: -0.01, type: type}, {page: 0, size: 10000}).then(res => {
          if (res.data.code == 1) {
            this.minusTable = res.data.content;
            for (let i = 0; i < this.minusTable.length; i++) {
              this.minusTable[i]['_disabled'] = true;
              this.minusTable[i]['_checked'] = true;
              this.minusAmount += Number(this.minusTable[i].price);
            }
          } else {
            this.minusAmount = 0.0;
            this.minusTable = [];
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      /**
       * 获取外部订单列表
       */
      getOutOrderList(name) {
        this.loadingText = '加载中';
        this.orderType = name;
        this.price = 0;
        getOutOrderList({type: this.orderType}, this.page).then(res => {
          if (res.data.code !== 0) {
            this.tableData = res.data.content;
            this.updateChecked();
            this.page.total = res.data.totalElements;
          } else {
            this.loadingText = '暂无数据';
            this.tableData = [];
            this.page.total = 0;
          }
        }).catch(error => {
          this.loadingText = '暂无数据';
        });
      },
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
      //计算金额和ids
      calculatePrice() {
        let price = 0;
        let ids = "";
        for (let v of this.selected) {
          price += v.price;
          ids += v.outOrderId + ",";
        }
        this.price = (price - this.minusAmount).toFixed(2)
        this.ids = ids.substring(0, ids.length - 1);
      },
      gotoMakeInvoice() {
        if (this.selected.length === 0) {
          return this.$Message.warning("请选择开票订单");
        } else {
          this.$router.push({
            path: "/make/merge-make",
            query: {id: this.ids, price: this.price}
          });
        }
      },
      changePage(page) {
        this.page.page = page - 1;
        this.getOutOrderList(this.orderType);
        this.calculatePrice()
      },
      pageSizeChange(pageSize) {
        this.page.size = pageSize;
        this.page.page = 0;
        this.getOutOrderList(this.orderType);
        this.calculatePrice()
      },
      /**
       * 全选/取消全选操作
       */
      handleSelectAllPage(status) {
        if (status) {
          this.$refs.selection.selectAll(status)
          getOutOrderList({type: this.orderType}, {page: 0, size: 10000}).then(res => {
            if (res.data.code == 1) {
              this.selected = res.data.content
              this.calculatePrice()
            }
          })
        } else {
          this.$refs.selection.selectAll(status)
          this.selected = [];
          this.price = 0;
        }
      },
      handleSelectAll(selection) {
        this.selected = _.uniqBy(this.selected.concat(selection), "outOrderId");
        this.calculatePrice()
      },
      handleCancelSelectAll(selection) {
        this.selected = _.differenceBy(this.selected, this.tableData, "outOrderId");
        this.calculatePrice()
      },
      handleSelect(selection, row) {
        this.selected.push(row)
        this.calculatePrice()
      },
      handleCancel(selection, row) {
        _.remove(this.selected, n => {
          return n.outOrderId === row.outOrderId;
        });
        this.calculatePrice()
      },
      updateChecked() {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i]._checked = false;
          for (let j = 0; j < this.selected.length; j++) {
            if (this.selected[j].outOrderId === this.tableData[i].outOrderId) {
              this.tableData[i]._checked = true;
            }
          }
        }
      },
    },
    mounted() {
      this.getOrderTypeList();
      this.getCustomer();
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

  .out-order_select {
    color: #999999;
    font-size: 12px;
    margin-right: 50px;
  }
</style>
