<script setup lang="ts">
import { getInvoiceApi } from '@/api/invoice'
import { getOutOrderListApi } from '@/api/out-order'
import { localStorage } from '@/utils/local-storage'

const route = useRoute()

const state = reactive({
  invoiceDeatil: null,
  outOrderList: [],
  outOrders: [],
  isShowInvoice: false,
})

/**
 * 预览发票
 */
function showInvoice() {
  state.isShowInvoice = true
}
/**
 * 获取外部订单列表
 */
function getOutOrderList() {
  let params = {
    invoiceId: route.query.id,
  }
  getOutOrderListApi(params).then((res) => {
    if (res.code === 1) {
      state.outOrderList = res.content
      state.outOrders = res.content
    }
  })
}

/**
 * 获取发票详情
 */
function getInvoice() {
  getInvoiceApi(route.query.id).then((res) => {
    if (res.code === 1) {
      state.invoiceDeatil = res.content
    }
  })
}

/**
 * 获取税额合计
 */
function getTaxAmount(data) {
  let tmp = 0
  state.invoiceDeatil.invoiceItems.map((el) => {
    tmp += el.tax
  })
  return tmp
}

/**
 * 获取价格合计
 */
function getPriceAmount() {
  let tmp = 0
  state.invoiceDeatil.invoiceItems.map((el) => {
    tmp += el.sum
  })
  return tmp
}

onMounted(() => {
  getInvoice()
})
</script>

<template>
  <div v-if="state.invoiceDeatil">
    <div>
      <el-row>
        <el-col :span="12">
          <div>
            <span>申请时间</span>
            <p>{{ state.invoiceDeatil.addTime }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span>开票时间</span>
            <p>{{ state.invoiceDeatil.printTime }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span>发票类型</span>
            <p>{{ state.invoiceDeatil.category }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span>发票状态</span>
            <p>{{ state.invoiceDeatil.statements }}</p>
          </div>
        </el-col>
        <el-col
          v-show="state.invoiceDeatil.category === '增值税电子普通发票'"
          :span="12"
        >
          <div>
            <span>电子邮箱</span>
            <p>{{ state.invoiceDeatil.email }}</p>
          </div>
        </el-col>
        <el-col
          v-show="state.invoiceDeatil.category === '增值税普通发票'"
          :span="12"
        >
          <div>
            <span>邮寄地址</span>
            <p>{{ state.invoiceDeatil.purchaserAddress }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span>手机号码</span>
            <p>{{ state.invoiceDeatil.addrMobile }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span style="min-width: 120px">开票信息</span>
            <p>{{ state.invoiceDeatil.failMsg }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span>发票备注</span>
            <p>{{ state.invoiceDeatil.remark }}</p>
          </div>
        </el-col>
        <el-col :span="12" v-if="state.invoiceDeatil.code">
          <div>
            <span style="min-width: 120px">发票代码</span>
            <p>{{ state.invoiceDeatil.code }}</p>
          </div>
        </el-col>
        <el-col :span="12" v-if="state.invoiceDeatil.code">
          <div>
            <span>发票号码</span>
            <p>{{ state.invoiceDeatil.number }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>