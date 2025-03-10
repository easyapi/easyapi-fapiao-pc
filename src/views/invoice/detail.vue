<script setup lang="ts">
import { getInvoiceApi } from '@/api/invoice'
import { getOutOrderListApi } from '@/api/out-order'
import {copyText} from "@/utils/invoice";
import {ElMessage} from "element-plus";

const route = useRoute()

const state = reactive({
  invoiceDetail: null,
  outOrderList: [],
})

/**
 * 获取外部订单列表
 */
function getOutOrderList() {
  const params = {
    invoiceId: route.query.id,
    sort: 'orderTime,desc',
  }
  getOutOrderListApi(params).then((res) => {
    if (res.code === 1)
      state.outOrderList = res.content
  })
}

/**
 * 获取发票详情
 */
function getInvoice() {
  getInvoiceApi(route.query.id).then((res) => {
    if (res.code === 1)
      state.invoiceDetail = res.content
  })
}

/**
 * 获取税额合计
 */
function getTaxAmount() {
  let sum = 0
  state.invoiceDetail.invoiceItems.map((item) => {
    sum += item.tax
  })
  return sum
}

/**
 * 获取价格合计
 */
function getPriceAmount() {
  let sum = 0
  state.invoiceDetail.invoiceItems.map((item: any) => {
    sum += item.sum
  })
  return sum
}

/**
 * 复制发票信息
 */
function copyInvoiceInfo() {
  const copyInfo = copyText(state.invoiceDetail)
  navigator.clipboard.writeText(copyInfo).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('该浏览器不支持自动复制')
  })
}

onMounted(() => {
  getInvoice()
  getOutOrderList()
})
</script>

<template>
  <div v-if="state.invoiceDetail" class="invoiceDetail">
    <div v-if="state.invoiceDetail.state === 1" class="mt-6">
      <el-image
        v-if="state.invoiceDetail.electronicInvoiceImg"
        class="absolute w-24 h-8 opacity-0"
        :src="state.invoiceDetail.electronicInvoiceImg"
        :zoom-rate="1.2"
        :preview-src-list="[state.invoiceDetail.electronicInvoiceImg]"
        :initial-index="1"
        :preview-teleported="true"
        fit="cover"
      />
      <el-button v-if="state.invoiceDetail.electronicInvoiceImg" type="primary">
        预览发票
      </el-button>
      <el-button
        link
        type="primary"
        class="ml-4"
        @click="copyInvoiceInfo"
      >
        复制发票信息
      </el-button>
      <el-link
        v-if="state.invoiceDetail.electronicInvoiceUrl"
        target="_blank"
        :href="state.invoiceDetail.electronicInvoiceUrl"
        type="primary"
        class="ml-4"
      >
        下载发票
      </el-link>
    </div>
    <div class="mt-6">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请时间">
          {{ state.invoiceDetail.addTime }}
        </el-descriptions-item>
        <el-descriptions-item label="开票时间">
          {{ state.invoiceDetail.printTime }}
        </el-descriptions-item>
        <el-descriptions-item label="发票类型">
          {{ state.invoiceDetail.category }}
        </el-descriptions-item>
        <el-descriptions-item label="发票状态">
          {{ state.invoiceDetail.statements }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="state.invoiceDetail.category === '增值税电子普通发票'"
          label="电子邮箱"
        >
          {{ state.invoiceDetail.email }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="state.invoiceDetail.category === '增值税普通发票'"
          label="邮寄地址"
        >
          {{ state.invoiceDetail.purchaserAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号码">
          {{ state.invoiceDetail.mobile }}
        </el-descriptions-item>
        <el-descriptions-item label="开票信息">
          {{ state.invoiceDetail.failMsg }}
        </el-descriptions-item>
        <el-descriptions-item label="发票备注">
          {{ state.invoiceDetail.remark }}
        </el-descriptions-item>
        <el-descriptions-item v-if="state.invoiceDetail.code" label="发票代码">
          {{ state.invoiceDetail.code }}
        </el-descriptions-item>
        <el-descriptions-item v-if="state.invoiceDetail.code" label="发票号码">
          {{ state.invoiceDetail.number }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mt-4" :column="2" title="购买方" border>
        <el-descriptions-item label="名称">
          {{ state.invoiceDetail.purchaserName }}
        </el-descriptions-item>
        <el-descriptions-item label="纳税人识别号">
          {{ state.invoiceDetail.purchaserTaxpayerNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="开户行及账号">
          {{ state.invoiceDetail.purchaserBank }}
          {{ state.invoiceDetail.purchaserBankAccount }}
        </el-descriptions-item>
        <el-descriptions-item label="地址及电话">
          {{ state.invoiceDetail.purchaserAddress }}
          {{ state.invoiceDetail.purchaserPhone }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mt-4" :column="2" title="销售方" border>
        <el-descriptions-item label="名称">
          {{ state.invoiceDetail.sellerName }}
        </el-descriptions-item>
        <el-descriptions-item label="纳税人识别号">
          {{ state.invoiceDetail.sellerTaxpayerNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="开户行及账号">
          {{ state.invoiceDetail.sellerBank }}
          {{ state.invoiceDetail.sellerBankAccount }}
        </el-descriptions-item>
        <el-descriptions-item label="地址及电话">
          {{ state.invoiceDetail.sellerAddress }}
          {{ state.invoiceDetail.sellerPhone }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="mt-4">
      <el-tabs>
        <el-tab-pane label="发票内容">
          <el-table
            border
            :header-cell-style="{
              background: '#F5F7FA',
            }"
            :data="state.invoiceDetail.invoiceItems"
            class="mt-4"
          >
            <el-table-column
              label="货物或应税劳务、服务名称"
              align="center"
              width="300"
            >
              <template #default="scope">
                *{{ scope.row.category }}*{{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="规格型号" prop="model" align="center" />
            <el-table-column label="单位" prop="unit" align="center" />
            <el-table-column label="数量" prop="number" align="center" />
            <el-table-column label="含税单价" prop="price" align="center" />
            <el-table-column label="含税金额" prop="sum" align="center" />
            <el-table-column label="税率" prop="sum" align="center">
              <template #default="scope">
                {{ scope.row.taxRate * 100 }}%
              </template>
            </el-table-column>
            <el-table-column label="税额" prop="tax" align="center" />
          </el-table>
          <div class="text-right mt-4">
            <span class="mr-4">税额合计：{{ getTaxAmount() }}元</span>
            <span>价额合计：{{ getPriceAmount() }}元</span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单明细">
          <el-table
            border
            :header-cell-style="{
              background: '#F5F7FA',
            }"
            :data="state.outOrderList"
            class="mt-4"
          >
            <el-table-column label="日期" prop="addTime" align="center" />
            <el-table-column label="订单号" prop="no" align="center" />
            <el-table-column label="订单类型" prop="type" align="center" />
            <el-table-column label="价格" prop="price" align="center" />
            <el-table-column label="描述" align="center">
              <template #default="scope">
                {{ JSON.parse(scope.row.fields).description }}
              </template>
            </el-table-column>
            <el-table-column label="明细" prop="sum" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style>
.invoiceDetail .el-descriptions__label.el-descriptions__cell.is-bordered-label {
  @apply w-2/12;
}

.invoiceDetail
  .el-descriptions__content.el-descriptions__cell.is-bordered-content {
  @apply w-4/12;
}
</style>
