<script setup lang="ts">
import { getInvoiceApi } from '@/api/invoice'
import { getOutOrderListApi } from '@/api/out-order'
import { localStorage } from '@/utils/local-storage'

const route = useRoute()

const state = reactive({
  invoiceDeatil: null,
  outOrderList: [],
})

/**
 * 获取外部订单列表
 */
function getOutOrderList() {
  let params = {
    invoiceId: route.query.id,
    sort: 'orderTime,desc',
  }
  getOutOrderListApi(params).then((res) => {
    if (res.code === 1) {
      state.outOrderList = res.content
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
function getTaxAmount() {
  let sum = 0
  state.invoiceDeatil.invoiceItems.map((item) => {
    sum += item.tax
  })
  return sum
}

/**
 * 获取价格合计
 */
function getPriceAmount() {
  let sum = 0
  state.invoiceDeatil.invoiceItems.map((item) => {
    sum += item.sum
  })
  return sum
}

onMounted(() => {
  getInvoice()
  getOutOrderList()
})
</script>

<template>
  <div v-if="state.invoiceDeatil" class="invoiceDeatil">
    <div class="mt-6" v-if="state.invoiceDeatil.state === 1">
      <el-image
        v-if="state.invoiceDeatil.electronicInvoiceUrl"
        class="absolute w-24 h-8 opacity-0"
        :src="state.invoiceDeatil.electronicInvoiceUrl"
        :zoom-rate="1.2"
        :preview-src-list="[state.invoiceDeatil.electronicInvoiceUrl]"
        :initial-index="1"
        :preview-teleported="true"
        fit="cover"
      >
      </el-image>
      <el-button v-if="state.invoiceDeatil.electronicInvoiceUrl" type="primary"
        >预览发票</el-button
      >
      <el-link
        v-if="state.invoiceDeatil.electronicInvoiceUrl"
        target="_blank"
        :href="state.invoiceDeatil.electronicInvoiceUrl"
        type="primary"
        class="ml-"
        >下载发票</el-link
      >
    </div>
    <div class="mt-6">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请时间">{{
          state.invoiceDeatil.addTime
        }}</el-descriptions-item>
        <el-descriptions-item label="开票时间">{{
          state.invoiceDeatil.printTime
        }}</el-descriptions-item>
        <el-descriptions-item label="发票类型">{{
          state.invoiceDeatil.category
        }}</el-descriptions-item>
        <el-descriptions-item label="发票状态">
          {{ state.invoiceDeatil.statements }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="state.invoiceDeatil.category === '增值税电子普通发票'"
          label="电子邮箱"
        >
          {{ state.invoiceDeatil.email }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="state.invoiceDeatil.category === '增值税普通发票'"
          label="邮寄地址"
        >
          {{ state.invoiceDeatil.purchaserAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号码">
          {{ state.invoiceDeatil.addrMobile }}
        </el-descriptions-item>
        <el-descriptions-item label="开票信息">
          {{ state.invoiceDeatil.failMsg }}
        </el-descriptions-item>
        <el-descriptions-item label="发票备注">
          {{ state.invoiceDeatil.remark }}
        </el-descriptions-item>
        <el-descriptions-item label="发票代码" v-if="state.invoiceDeatil.code">
          {{ state.invoiceDeatil.code }}
        </el-descriptions-item>
        <el-descriptions-item label="发票号码" v-if="state.invoiceDeatil.code">
          {{ state.invoiceDeatil.number }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mt-4" :column="2" title="购买方" border>
        <el-descriptions-item label="名称">{{
          state.invoiceDeatil.purchaserName
        }}</el-descriptions-item>
        <el-descriptions-item label="纳税人识别号">{{
          state.invoiceDeatil.purchaserTaxpayerNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="开户行及账号">
          {{ state.invoiceDeatil.purchaserBank }}
          {{ state.invoiceDeatil.purchaserBankAccount }}
        </el-descriptions-item>
        <el-descriptions-item label="地址及电话">
          {{ state.invoiceDeatil.purchaserAddress }}
          {{ state.invoiceDeatil.purchaserPhone }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="mt-4" :column="2" title="销售方" border>
        <el-descriptions-item label="名称">{{
          state.invoiceDeatil.sellerName
        }}</el-descriptions-item>
        <el-descriptions-item label="纳税人识别号">{{
          state.invoiceDeatil.sellerTaxpayerNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="开户行及账号">
          {{ state.invoiceDeatil.sellerBank }}
          {{ state.invoiceDeatil.sellerBankAccount }}
        </el-descriptions-item>
        <el-descriptions-item label="地址及电话">
          {{ state.invoiceDeatil.sellerAddress }}
          {{ state.invoiceDeatil.sellerPhone }}
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
            :data="state.invoiceDeatil.invoiceItems"
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
            <el-table-column label="规格型号" prop="model" align="center">
            </el-table-column>
            <el-table-column label="单位" prop="unit" align="center">
            </el-table-column>
            <el-table-column label="数量" prop="number" align="center">
            </el-table-column>
            <el-table-column label="含税单价" prop="price" align="center">
            </el-table-column>
            <el-table-column label="含税金额" prop="sum" align="center">
            </el-table-column>
            <el-table-column label="税率" prop="sum" align="center">
              <template #default="scope">
                {{ scope.row.taxRate * 100 }}%
              </template>
            </el-table-column>
            <el-table-column label="税额" prop="tax" align="center">
            </el-table-column>
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
            <el-table-column label="日期" prop="addTime" align="center">
            </el-table-column>
            <el-table-column label="订单号" prop="no" align="center">
            </el-table-column>
            <el-table-column label="订单类型" prop="type" align="center">
            </el-table-column>
            <el-table-column label="价格" prop="price" align="center">
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template #default="scope">
                {{ JSON.parse(scope.row.fields).description }}
              </template>
            </el-table-column>
            <el-table-column label="明细" prop="sum" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<style >
.invoiceDeatil .el-descriptions__label.el-descriptions__cell.is-bordered-label {
  @apply w-2/12;
}

.invoiceDeatil
  .el-descriptions__content.el-descriptions__cell.is-bordered-content {
  @apply w-4/12;
}
</style>