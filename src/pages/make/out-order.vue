<template>
  <div class="control-over-invoices">
    <Breadcrumb>
      <BreadcrumbItem to="/">发票管理</BreadcrumbItem>
      <BreadcrumbItem>发票抬头管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="typeButton flex-r">
        <div
          v-for="(item, index) in typeList"
          :key="index"
          @click="getOutOrderList(item.name)"
          :class="{'active':clicked===item.name}"
        >{{item.name}}
        </div>
      </div>
      <div class="bottom-24">
        <p class="pd-left">有{{total}}个订单可申请发票，可开票金额：¥{{amountOfInvoice}}元</p>
      </div>
      <div class="ivu-form">
        <!-- <div class="select-btn">
          <Button @click="handleSelectAll(true)">设置全选</Button>
          <Button @click="handleSelectAll(false)">取消全选</Button>
        </div>-->

        <Table
          border
          ref="selection"
          @on-selection-change="tableSelection"
          :stripe="true"
          :columns="tableTitle"
          :data="tableData"
        ></Table>
      </div>
      <div v-if="
      " class="show-more-btn">
        <Button @click="handleAddMore">加载更多</Button>
      </div>
      <!-- <div class="page-box flex-r">
        <Page
          :total="total"
          :page-size="pageSize"
          :current="current"
          @on-change="changePage"
          show-elevator
        ></Page>
      </div>-->
      <div class="askBtn">
        <div style="float: right">
          <span style="color: #999999;font-size: 12px;">
            待开票金额：
            <span style="color: #fa4747;font-size: 24px;">¥{{price}}元</span>
          </span>
          <Button class="btn" @click="submitInvoice">去开票</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {orderTypesUrl, outOrderListUrl} from "../../api/api";

  export default {
    name: "",
    components: {},
    data() {
      return {
        typeList: [],
        allListData: [],
        clicked: "",
        onInvoicAcount: "",
        username: "",
        tableTitle: [
          {
            type: "selection",
            width: 60,
            align: "center"
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
        tableData: [],
        current: 1,
        showMoreBtn: true,
        pageSize: 10,
        total: 0,
        tableSelectData: [],
        price: 0.0,
        ids: "",
        amountOfInvoice: 0
      };
    },
    methods: {
      getOrderTypeList() {
        this.$ajax({
          method: "GET",
          url: orderTypesUrl,
          params: {
            accessToken: localStorage.getItem("accessToken"),
            username: this.username
          }
        })
          .then(res => {
            this.typeList = res.data.content;
            this.getOutOrderList(this.typeList[0].name);
          })
          .catch(error => {
            console.log(error.response);
          });
      },
      getOutOrderList(name) {
        this.clicked = name;
        this.current = 1;
        this.amountOfInvoice = 0;
        this.price = 0;
        this.showMoreBtn = true;
        this.$ajax({
          method: "GET",
          url: outOrderListUrl,
          params: {
            accessToken: localStorage.getItem("accessToken"),
            type: this.clicked,
            state: 0,
            username: this.username,
            page: this.current - 1,
            size: this.pageSize
          }
        })
          .then(res => {
            if (res.data.code !== 0) {
              this.tableData = res.data.content;
              this.total = Number(res.data.totalElements);
              if (this.tableData.length == this.total) {
                this.showMoreBtn = false;
              }
              this.$ajax({
                method: "GET",
                url: outOrderListUrl,
                params: {
                  accessToken: localStorage.getItem("accessToken"),
                  type: this.clicked,
                  state: 0,
                  username: this.username,
                  page: this.current - 1,
                  size: res.data.totalElements
                }
              })
                .then(res => {
                  if (res.data.code == 0) {
                    console.log(res);
                  } else {
                    for (let v of res.data.content) {
                      this.amountOfInvoice += Number(v.price);
                    }
                  }
                })
                .catch(error => {
                  console.log(error.response);
                });
            } else {
              this.tableData = [];
              this.total = 0;
              this.showMoreBtn = false;
            }
          })
          .catch(error => {
            console.log(error.response);
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
        this.price = price.toFixed(2);
        this.ids = ids.substring(0, ids.length - 1);
      },
      tableSelection(s) {
        this.tableSelectData = s;
        this.calculatePrice();
      },
      submitInvoice() {
        if (this.tableSelectData.length === 0) {
          return this.$Message.warning("请选择开票订单");
        } else {
          this.$router.push({
            path: "/make",
            query: {id: this.ids, price: this.price, username: this.username}
          });
        }
      },
      //分页
      changePage(current) {
        this.current = current;
        this.getOutOrderList(this.clicked);
      },
      // 全选按钮
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },
      // 加载更多
      handleAddMore() {
        this.price = 0;
        this.$ajax({
          method: "GET",
          url: outOrderListUrl,
          params: {
            accessToken: localStorage.getItem("accessToken"),
            type: this.clicked,
            state: 0,
            username: this.username,
            page: this.current++,
            size: this.pageSize
          }
        }).then(res => {
          if (res.data.code == 0) {
            return this.$Message.warning("已无更多开票订单！");
          } else {
            if (res.data.content) {
              for (let v of res.data.content) {
                this.tableData.push(v);
              }
            }
            if (this.tableData.length == this.total) {
              this.showMoreBtn = false;
            }
          }
        }).catch(error => {
          console.log(error.response);
        });
      }
    },
    //计算属性
    computed: {},
    created() {
      this.username = this.$route.query.username;
    },
    mounted() {
      this.getOrderTypeList();
    },
    watch: {}
  };
</script>
<style>
  .ivu-form .ivu-table th {
    background-color: #f5f6fa !important;
  }
</style>
<style scoped lang="stylus">
  @import 'make.styl';
  .ivu-breadcrumb {
    padding: 20px 0px 14px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }
</style>
