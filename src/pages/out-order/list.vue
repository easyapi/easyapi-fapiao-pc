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
  import List from "./list";

  export default List;
</script>
<style>
  .ivu-form .ivu-table th {
    background-color: #f5f6fa !important;
  }
</style>
<style scoped lang="stylus">
  @import '../make/make.styl';
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
