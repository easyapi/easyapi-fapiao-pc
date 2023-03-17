<script setup lang="ts">
import { getDefaultCompanyApi } from '../api/company'
import { getDefaultAddressApi } from '../api/address'
import { getCustomerApi } from '../api/customer'
import { findSettingApi } from '../api/setting'
import { localStorage } from '@/utils/local-storage'
import { getInvoiceListApi, getInvoiceStatementsListApi } from '@/api/invoice'

const route = useRoute()
const router = useRouter()

const state = shallowReactive({
  customer: { balance: 0 }, //开票用户客户信息
  showInfo: true,
  defaultCompany: {},
  showAddressInfo: true,
  defaultAddress: {},
  search: {
    time: '',
    startTime: '',
    endTime: '',
    purchaserName: '', //发票抬头
    statements: '',
  },
  statementsList: [],
  loadingText: '加载中',
  tableData: [],
  content: '', //底部备注
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
  getCustomerApi({}).then((res) => {
    if (res.data.code === 1) {
      state.customer = res.data.content
    }
  })
}

/**
 * 获取我的默认抬头信息
 */
function getDefaultCompany() {
  getDefaultCompanyApi().then((res) => {
    if (res.data.code === 1) {
      state.defaultCompany = res.data.content
      state.showInfo = true
    } else if (res.data.code === 0) {
      state.showInfo = false
    }
  })
}

/**
 * 获取默认邮寄地址
 */
function getAddress() {
  getDefaultAddressApi().then((res) => {
    if (res.data.code === 1) {
      state.defaultAddress = res.data.content
      state.showAddressInfo = true
    } else if (res.data.code === 0) {
      state.showAddressInfo = false
    }
  })
}

/**
 * 获取首页底部备注
 */
function findSetting() {
  findSettingApi({ fieldKeys: 'pc_index_remark' }).then((res) => {
    state.content = res.data.content[0].fieldValue
  })
}

function timeRangeChange(t) {
  state.search.startTime = t[0] && `${t[0]} 00:00:00`
  state.search.endTime = t[1] && `${t[1]} 23:59:59`
}

/**
 * 获取发票状态列表
 */
function getStatementsList() {
  getInvoiceStatementsListApi().then((res) => {
    state.statementsList = res.data.content
  })
}

/**
 * 获取开票列表
 */
function getInvoiceList() {
  state.loadingText = '加载中'
  let params = {
    ...state.search,
    page: pagination.page - 1,
    size: pagination.size,
  }
  getInvoiceListApi(params).then((res) => {
    if (res.data.code === 1) {
      state.tableData = res.data.content
      pagination.total = res.data.totalElements
    } else {
      state.loadingText = '暂无数据'
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
  if (route.query.accessToken) {
    localStorage.set('accessToken', route.query.accessToken)
  }
  if (route.query.taxNumber) {
    localStorage.set('taxNumber', route.query.taxNumber)
  }
})
</script>

<template>
  <div>
    <div class="invoice-base-info flex my-6 p-4">
      <div class="w-1/3">
        <div class="text-base mb-4 font-semibold">可开票金额</div>
        <div class="text-2xl mb-4 tracking-widest">
          ¥{{ state.customer.balance }}元
        </div>
        <el-button type="primary" @click="gotoPage('/out-order')"
          >索取发票</el-button
        >
      </div>
      <div class="w-1/3">
        <div class="text-base mb-4 font-semibold">开票信息</div>
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
            >更改开票信息
            <Icon size="15" />
          </span>
        </div>
        <div v-else>
          <span>您还没有填写开票信息</span>
          <span
            class="ml-1 text-blue-500 cursor-pointer"
            @click="gotoPage('/company')"
            >现在填写
            <Icon size="17" />
          </span>
        </div>
      </div>
      <div class="w-1/3">
        <p class="text-base mb-4 font-semibold">邮寄信息</p>
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
            >更改邮寄地址
            <Icon size="15" />
          </span>
        </div>
        <div v-else>
          <span>您还没有填写邮寄信息</span>
          <span
            class="ml-1 text-blue-500 cursor-pointer"
            @click="gotoPage('/address')"
            >现在填写
            <Icon size="17" />
          </span>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <div class="w-92">
          <el-date-picker
            v-model="state.search.time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="timeRangeChange"
          />
        </div>
        <div class="w-52 mx-2">
          <el-select
            clearable
            v-model="state.search.statements"
            placeholder="发票状态"
          >
            <el-option
              v-for="item in state.statementsList"
              :value="item"
              :key="item"
              >{{ item }}</el-option
            >
          </el-select>
        </div>
        <div class="w-52">
          <el-input
            clearable
            v-model="state.search.purchaserName"
            placeholder="发票抬头"
          />
        </div>
      </div>
      <div>
        <el-button @click="getInvoiceListReset" type="primary">查询</el-button>
        <el-button type="primary">导出</el-button>
      </div>
    </div>
    <el-table :data="state.tableData" border>
      <el-table-column label="申请日期" prop="addTime"> </el-table-column>
      <el-table-column label="发票抬头" prop="purchaserName"> </el-table-column>
      <el-table-column label="金额"> </el-table-column>
      <el-table-column label="发票状态"> </el-table-column>
      <el-table-column label="发票性质"> </el-table-column>
      <el-table-column label="操作"> </el-table-column>
    </el-table>
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

    <!-- <Table
        border
        :stripe="true"
        :columns="tableTitle"
        :no-data-text="loadingText"
        :data="tableData"
      ></Table>
      <div class="page-box flex-r" v-if="page.total != 0">
        <Page
          :total="page.total"
          :page-size="page.size"
          :current="page.current"
          @on-change="changePage"
          show-total
          show-sizer
        ></Page>
      </div> -->
    <!-- <div class="Hint">
        <dl v-html="this.content">
          {{ content }}
        </dl>
      </div> -->
  </div>
</template>

<style lang="less" scoped>
.invoice-base-info {
  background-color: #f5f6fa;
}
</style>
