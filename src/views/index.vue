<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDefaultCompanyApi } from '../api/company'
import { getDefaultAddressApi } from '../api/address'
import { getCustomerApi } from '../api/customer'
import { findSettingApi } from '../api/setting'
import { localStorage } from '@/utils/local-storage'
import {
  getInvoiceListApi,
  getInvoiceStatementsListApi,
  invoiceExportApi,
} from '@/api/invoice'

const route = useRoute()
const router = useRouter()

const state = reactive({
  customer: { balance: 0 }, // 开票用户客户信息
  showInfo: true,
  defaultCompany: {},
  showAddressInfo: true,
  defaultAddress: {},
  statementsList: [],
  tableData: [],
  content: '', // 底部备注
  loading: false,
  time: '',
  makeInvoiceTime: '',
})

const query = reactive({
  startAddTime: '',
  endAddTime: '',
  startPrintTime: '',
  endPrintTime: '',
  purchaserName: '', // 发票抬头
  statements: '',
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

/**
 * 获取我的开票账户信息
 */
function getCustomer() {
  getCustomerApi().then((res) => {
    if (res.code === 1)
      state.customer = res.content
  })
}

/**
 * 获取我的默认抬头信息
 */
function getDefaultCompany() {
  getDefaultCompanyApi().then((res) => {
    if (res.code === 1) {
      state.defaultCompany = res.content
      state.showInfo = true
    } else if (res.code === 0) {
      state.showInfo = false
    }
  })
}

/**
 * 获取默认邮寄地址
 */
function getDefaultAddress() {
  getDefaultAddressApi().then((res) => {
    if (res.code === 1) {
      state.defaultAddress = res.content
      state.showAddressInfo = true
    } else if (res.code === 0) {
      state.showAddressInfo = false
    }
  })
}

/**
 * 导出
 */
function invoiceExport() {
  ElMessageBox.confirm('您确定要导出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const params = {
      ...query,
    }
    invoiceExportApi(params).then((res) => {
      ElMessage.success('导出成功，请查看文件')
      const blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      const fileName = '发票记录.xlsx' // 下载文件名称
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    })
  })
}

/**
 * 获取首页底部备注
 */
function findSetting() {
  findSettingApi({ fieldKeys: 'pc_index_remark' }).then((res) => {
    if (res.code === 1)
      state.content = res.content[0].fieldValue
  })
}

function timeRangeChange(time) {
  if (time) {
    query.startAddTime = time[0] ? `${time[0]} 00:00:00` : time[0]
    query.endAddTime = time[1] ? `${time[1]} 23:59:59` : time[1]
  } else {
    query.startAddTime = ''
    query.endAddTime = ''
  }
}

function makeInvoiceTimeRangeChange(time) {
  if (time) {
    query.startPrintTime = time[0] ? `${time[0]} 00:00:00` : time[0]
    query.endPrintTime = time[1] ? `${time[1]} 23:59:59` : time[1]
  } else {
    query.startPrintTime = ''
    query.endPrintTime = ''
  }
}

function search() {
  pagination.page = 1
  getInvoiceList()
}

/**
 * 获取发票状态列表
 */
function getInvoiceStatementsList() {
  getInvoiceStatementsListApi().then((res) => {
    if (res.code === 1)
      state.statementsList = res.content
  })
}

/**
 * 获取开票列表
 */
function getInvoiceList() {
  state.loading = true
  const params = {
    ...query,
    page: pagination.page - 1,
    size: pagination.size,
  }
  getInvoiceListApi(params).then((res) => {
    state.loading = false
    if (res.code === 1) {
      state.tableData = res.content
      pagination.total = res.totalElements
    } else {
      state.tableData = []
      pagination.total = 0
    }
  })
}

function handleCurrentChange(page) {
  pagination.page = page
  getInvoiceList()
}

function handleSizeChange(size) {
  pagination.size = size
  getInvoiceList()
}

/**
 * 跳转
 */
function gotoPage(path) {
  router.push(path)
}

onMounted(() => {
  if (route.query.accessToken)
    localStorage.set('accessToken', route.query.accessToken)

  if (route.query.taxNumber)
    localStorage.set('taxNumber', route.query.taxNumber)

  getCustomer()
  getDefaultCompany()
  getDefaultAddress()
  getInvoiceList()
  getInvoiceStatementsList()
  findSetting()
})
</script>

<template>
  <div class="invoice">
    <div class="invoice-base-info flex mt-6 p-4">
      <div class="w-1/3">
        <div class="text-base mb-4 font-semibold">
          可开票金额
        </div>
        <div class="text-2xl mb-4 tracking-tight">
          ¥{{ state.customer.balance }}元
        </div>
        <el-button type="primary" @click="gotoPage('/out-order')">
          索取发票
        </el-button>
      </div>
      <div class="w-1/3">
        <div class="text-base mb-4 font-semibold">
          开票信息
        </div>
        <div v-if="state.showInfo">
          <div class="mb-4">
            <span class="text-gray-400">抬头：</span>
            <span>{{ state.defaultCompany.name }}</span>
          </div>
          <div class="mb-4">
            <span class="text-gray-400">税号：</span>
            <span>{{ state.defaultCompany.taxNumber }}</span>
          </div>
          <span
            class="text-blue-500 cursor-pointer"
            @click="gotoPage('/company')"
          >
            更改开票信息
            <el-icon class="align-middle" :size="16">
              <Edit />
            </el-icon>
          </span>
        </div>
        <div v-else>
          <span>您还没有填写开票信息</span>
          <span
            class="ml-1 text-blue-500 cursor-pointer"
            @click="gotoPage('/company')"
          >
            现在填写
            <el-icon class="align-middle" :size="16">
              <Edit />
            </el-icon>
          </span>
        </div>
      </div>
      <div class="w-1/3">
        <p class="text-base mb-4 font-semibold">
          邮寄信息
        </p>
        <div v-if="state.showAddressInfo">
          <div class="mb-4">
            <span class="text-gray-400">收件人：</span>
            <span class="mr-4">{{ state.defaultAddress.name }}</span>
            <span>{{ state.defaultAddress.mobile }}</span>
          </div>
          <div class="mb-4">
            <span class="text-gray-400">地址：</span>
            <span>{{ state.defaultAddress.province }}</span>
            <span class="mx-2">{{ state.defaultAddress.city }}</span>
            <span class="mr-2">{{ state.defaultAddress.district }}</span>
            <span>{{ state.defaultAddress.addr }}</span>
          </div>
          <span
            class="text-blue-500 cursor-pointer"
            @click="gotoPage('/address')"
          >
            更改邮寄地址
            <el-icon class="align-middle" :size="16">
              <Edit />
            </el-icon>
          </span>
        </div>
        <div v-else>
          <span>您还没有填写邮寄信息</span>
          <span
            class="ml-1 text-blue-500 cursor-pointer"
            @click="gotoPage('/address')"
          >
            现在填写
            <el-icon class="align-middle" :size="16">
              <Edit />
            </el-icon>
          </span>
        </div>
      </div>
    </div>
    <el-form class="mt-6" :inline="true" :model="query" label-width="80px">
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="state.time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          @change="timeRangeChange"
        />
      </el-form-item>
      <el-form-item label="发票状态">
        <el-select v-model="query.statements" clearable placeholder="发票状态">
          <el-option
            v-for="item in state.statementsList"
            :key="item"
            :value="item"
          >
            {{ item }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票抬头">
        <el-input
          v-model="query.purchaserName"
          clearable
          placeholder="发票抬头"
        />
      </el-form-item>
      <el-form-item label="开票时间">
        <el-date-picker
          v-model="state.makeInvoiceTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          @change="makeInvoiceTimeRangeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">
          查询
        </el-button>
        <el-button type="primary" @click="invoiceExport">
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="state.loading"
      border
      element-loading-text="老铁别急，这就给你整上..."
      :header-cell-style="{
        background: '#F5F7FA',
      }"
      :data="state.tableData"
      class="mt-2"
    >
      <el-table-column label="申请日期" prop="addTime" align="center" />
      <el-table-column label="发票类型" prop="category" align="center" />
      <el-table-column label="发票抬头" prop="purchaserName" align="center" width="250" />
      <el-table-column label="金额" align="center">
        <template #default="scope">
          {{ scope.row.price }}元
        </template>
      </el-table-column>
      <el-table-column label="发票状态" align="center">
        <template #default="scope">
          {{ scope.row.statements }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            @click="gotoPage(`/invoice/detail?id=${scope.row.invoiceId}`)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-6 flex justify-end">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.size"
        background
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 25, 50, 100]"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <div v-if="state.content" class="mt-6" v-html="state.content" />
  </div>
</template>

<style lang="less" scoped>
.invoice-base-info {
  background-color: #f5f7fa;
}
</style>
