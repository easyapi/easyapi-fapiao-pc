<script setup lang="ts">
import { getCustomerApi } from '@/api/customer'
import { getOrderTypeListApi } from '@/api/order-type'
import { getOutOrderListApi } from '@/api/out-order'
import { localStorage } from '@/utils/local-storage'
import { ElMessage, ElTable } from 'element-plus'

const outOrderTableRef = ref<InstanceType<typeof ElTable>>()

const router = useRouter()

const state = reactive({
  // 开票用户客户信息
  customer: {
    balance: 0,
  },
  minusTableData: [], // 欠票订单列表
  outOrderTableData: [], // 外部订单列表
  outOrderListAll: [], // 全部订单数据
  checkData: [], // 已选订单
  orderTypeList: [], // 订单类型列表
  orderType: '' as any, // 已选择订单类型
  minusAmount: 0, // 欠票总金额
  price: 0 as any, // 已选开票金额
  loading: false,
  isCheckAll: false,
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

/**
 * 获取订单类型
 */
function getOrderTypeList() {
  getOrderTypeListApi().then((res) => {
    if (res.code === 1) {
      state.orderTypeList = res.content
      state.orderType = state.orderTypeList[0].name
      getMinusOutOrderList()
      getOutOrderList()
      getOutOrderListAll()
    }
  })
}

/**
 * 获取所有的外部订单数据
 */
function getOutOrderListAll() {
  const params = {
    state: 0,
    sort: 'orderTime,desc',
    type: state.orderType,
    page: 0,
    size: 10000,
  }
  getOutOrderListApi(params).then((res) => {
    if (res.code === 1)
      state.outOrderListAll = res.content
    else
      state.outOrderListAll = []
  })
}

/**
 * 获取全部负数（欠费）外部订单列表
 */
function getMinusOutOrderList() {
  const params = {
    state: 0,
    maxPrice: -0.01,
    type: state.orderType,
    page: 0,
    size: 10000,
  }
  getOutOrderListApi(params).then((res) => {
    if (res.code === 1) {
      state.minusTableData = res.content
      state.minusTableData.forEach((item) => {
        state.minusAmount += Number(item.price)
      })
    }
    else {
      state.minusAmount = 0
      state.minusTableData = []
    }
  })
}

/**
 * 获取外部订单列表
 */
function getOutOrderList() {
  state.loading = true
  const params = {
    state: 0,
    sort: 'orderTime,desc',
    type: state.orderType,
    page: pagination.page - 1,
    size: pagination.size,
  }
  getOutOrderListApi(params).then((res) => {
    state.loading = false
    if (res.code === 1) {
      state.outOrderTableData = res.content
      pagination.total = res.totalElements
      changePageCheck()
    }
    else {
      state.outOrderTableData = []
      pagination.total = 0
    }
  })
}

function handleCurrentChange(page) {
  pagination.page = page
  getOutOrderList()
}

function handleSizeChange(size) {
  pagination.size = size
  getOutOrderList()
}

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
 * 计算金额和ids
 */
function calculatePrice() {
  let price = 0
  state.checkData.forEach((item) => {
    price += item.price
  })
  state.price = (price - state.minusAmount).toFixed(2)
}

/**
 * 去开票
 */
function gotoMakeInvoice() {
  if (state.checkData.length === 0) {
    ElMessage.warning('请选择开票订单')
  }
  else {
    const outOrderIds = []
    state.checkData.forEach((item) => {
      outOrderIds.push(item.outOrderId)
    })
    localStorage.set('outOrderIds', outOrderIds.toString())
    router.push({
      path: '/make/merge-make',
      query: {
        price: state.price,
      },
    })
  }
}

/**
 * 手动勾选数据行的Checkbox时触发的事件
 */
function select(selection, row) {
  if (
    state.checkData.filter(x => x.outOrderId === row.outOrderId).length === 0
  ) {
    state.checkData.push(row)
    calculatePrice()
    return
  }
  state.checkData.forEach((item, index) => {
    if (item.outOrderId === row.outOrderId)
      state.checkData.splice(index, 1)
  })
  calculatePrice()
}

/**
 * 手动勾选全选Checkbox时触发的事件
 */
function selectAll(selection) {
  if (selection.length === 0) {
    const list = []
    state.checkData.forEach((row) => {
      if (state.outOrderTableData.filter(x => x.outOrderId === row.outOrderId).length === 0)
        list.push(row)
    })
    state.checkData = JSON.parse(JSON.stringify(list))
  }
  else {
    selection.forEach((row) => {
      if (state.checkData.filter(x => x.outOrderId === row.outOrderId).length === 0)
        state.checkData.push(row)
    })
  }
  calculatePrice()
}

/**
 * 跨页全选/取消全选
 */
function handleSelectAllPage(value) {
  if (value) {
    state.checkData = JSON.parse(JSON.stringify(state.outOrderListAll))
    state.outOrderTableData.forEach((row) => {
      outOrderTableRef.value.toggleRowSelection(row, true)
    })
    calculatePrice()
  }
  else {
    state.checkData = []
    state.price = 0
    outOrderTableRef.value.clearSelection()
  }
  state.isCheckAll = value
}

/**
 * 切换分页之后选中
 */
function changePageCheck() {
  state.checkData.forEach((item) => {
    state.outOrderTableData.forEach((row) => {
      if (item.outOrderId === row.outOrderId) {
        nextTick(() => {
          outOrderTableRef.value.toggleRowSelection(row, true)
        })
      }
    })
  })
}

onMounted(() => {
  getOrderTypeList()
  getCustomer()
})
</script>

<template>
  <div class="outOrder">
    <el-tabs
      v-model="state.orderType"
      class="mt-2"
      @tab-change="getOutOrderList"
    >
      <el-tab-pane
        v-for="(item, index) in state.orderTypeList"
        :key="index"
        :label="item.name"
        :name="item.name"
      />
    </el-tabs>
    <div v-if="state.minusTableData.length !== 0" class="mt-2">
      <p>
        有{{ state.minusTableData.length }}笔欠费金额，欠费金额小计：¥{{ state.minusAmount }}元
      </p>
      <ElTable
        border
        :header-cell-style="{
          background: '#F5F7FA',
        }"
        :data="state.minusTableData"
        class="my-4"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="订单编号" prop="no" align="center" />
        <el-table-column label="订单内容" align="center">
          <template #default="scope">
            {{ Object.values(JSON.parse(scope.row.fields))[0] }}
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center" />
        <el-table-column
          label="下单时间"
          prop="orderTime"
          align="center"
        />
        <el-table-column label="可开票金额" align="center">
          <template #default="scope">
            {{ scope.row.price }}元
          </template>
        </el-table-column>
      </ElTable>
    </div>
    <p>
      有{{ pagination.total }}个订单可申请发票，总金额：¥{{ state.customer.balance }}元
    </p>
    <div class="mt-4">
      <el-button type="primary" @click="handleSelectAllPage(true)">
        跨页全选
      </el-button>
      <el-button @click="handleSelectAllPage(false)">
        取消全选
      </el-button>
    </div>
    <ElTable
      ref="outOrderTableRef"
      v-loading="state.loading"
      border
      element-loading-text="老铁别急，这就给你整上..."
      :header-cell-style="{
        background: '#F5F7FA',
      }"
      :data="state.outOrderTableData"
      class="mt-4"
      @select="select"
      @select-all="selectAll"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单编号" prop="no" align="center" />
      <el-table-column label="订单内容" align="center">
        <template #default="scope">
          {{ Object.values(JSON.parse(scope.row.fields))[0] }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" />
      <el-table-column label="下单时间" prop="orderTime" align="center" />
      <el-table-column label="实付金额" align="center">
        <template #default="scope">
          {{ scope.row.price.toFixed(2) }}元
        </template>
      </el-table-column>
      <el-table-column label="可开票金额" align="center">
        <template #default="scope">
          {{ scope.row.price }}元
        </template>
      </el-table-column>
    </ElTable>
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
    <div class="border border-[var(--el-border-color)] mt-6 text-right p-3 flex justify-end">
      <div class="flex items-center">
        <sapn>已选订单数：{{ state.checkData.length }}个</sapn>
        <span class="ml-6">开票金额：</span>
        <span class="mr-6 text-xl text-red-600 tracking-wider">¥{{ state.price }}元
        </span>
        <el-button type="primary" @click="gotoMakeInvoice">
          去开票
        </el-button>
      </div>
    </div>
  </div>
</template>
