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
      getOutOrderList({state: 0, maxPrice: -0.01, type: type}, {page: 0, size: 10000}).then(res => {
        if (res.data.code === 1) {
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
      getOutOrderList({state: 0, type: this.orderType}, this.page).then(res => {
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
        getOutOrderList({state: 0, type: this.orderType}, {page: 0, size: 10000}).then(res => {
          if (res.data.code === 1) {
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
