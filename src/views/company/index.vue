<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deleteCompanyApi,
  getCompanyListApi,
  getIfManageCompanyApi,
  updateCompanySetDefaultApi,
} from '@/api/company'
import Edit from './components/edit.vue'

const editRef = ref()

const state = reactive({
  ifManageCompany: true, // 是否可以管理公司抬头
  tableData: [],
  dialogVisible: false,
  companyDetail: null,
})

/**
 * 更新默认抬头
 */
function updateCompanySetDefault(event) {
  if (event.ifDefault)
    return
  updateCompanySetDefaultApi(event.companyId).then((res) => {
    if (res.code === 1) {
      ElMessage.success(res.message)
      getCompanyList()
    }
  })
}

/**
 * 删除抬头
 */
function deleteCompany(companyId) {
  ElMessageBox.confirm('您确定要删除该抬头吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteCompanyApi(companyId).then((res) => {
      if (res.code === 1) {
        ElMessage.success(res.message)
        getCompanyList()
      }
    })
  })
}

/**
 * 获取是否可以管理公司抬头
 */
function getIfManageCompany() {
  getIfManageCompanyApi().then((res) => {
    if (res.code === 1) {
      for (const setting of res.content) {
        if (setting.field === 'ifManageCompany')
          state.ifManageCompany = setting.value
      }
    }
  })
}

/**
 * 获取抬头列表
 */
function getCompanyList() {
  const params = {
    page: 0,
    size: 6,
  }
  getCompanyListApi(params).then((res) => {
    if (res.code === 1)
      state.tableData = res.content
    else
      state.tableData = []
  })
}

/**
 * 打开编辑弹窗
 */
function openEditModal(event) {
  state.dialogVisible = true
  state.companyDetail = event
}

onMounted(() => {
  // getIfManageCompany()
  getCompanyList()
})
</script>

<template>
  <div class="company">
    <div class="mt-6 flex flex-wrap">
      <div
        v-for="(item, index) in state.tableData"
        :key="index"
        @click="updateCompanySetDefault(item)"
      >
        <div
          :class="item.ifDefault ? ' border-blue-600 relative ' : ''"
          class="company-item rounded border border-[var(--el-border-color)] px-4 pb-4 mr-4 mb-4 cursor-pointer hover:border-blue-600"
        >
          <div class="flex justify-between items-center border-b border-gray-200 h-10 mb-2">
            <span class="text-base font-semibold">{{ item.name }}</span>
            <el-tag v-if="item.ifDefault" type="primary" effect="dark">
              默认
            </el-tag>
            <span v-else class="text-blue-400">设为默认</span>
          </div>
          <div class="leading-7">
            <p class="overflow">
              {{ item.taxNumber || '-' }}
            </p>
            <p class="overflow">
              {{ item.bank || '-' }}
            </p>
            <p class="overflow">
              {{ item.bankAccount || '-' }}
            </p>
            <p class="overflow">
              {{ item.address || '-' }}
            </p>
            <p class="overflow">
              {{ item.phone || '-' }}
            </p>
          </div>
          <div class="mt-2">
            <el-button type="primary" @click.stop="openEditModal(item)">
              修改
            </el-button>
            <el-button type="danger" plain @click.stop="deleteCompany(item.companyId)">
              删除
            </el-button>
          </div>
          <img
            v-if="item.ifDefault === true"
            src="../../assets/images/default.png"
            class="absolute bottom-0 right-0"
          >
        </div>
      </div>
      <div
        v-if="state.tableData.length < 6"
        class="add-company flex border border-[var(--el-border-color)] px-4 pb-4 mb-4 mr-4 items-center justify-center cursor-pointer rounded hover:shadow-md"
        @click="openEditModal(null)"
      >
        <img src="../../assets/images/plus.png" alt="">
      </div>
    </div>
    <p class="text-gray-400 text-sm">
      注意：发票抬头最多可以添加6个
    </p>
  </div>
  <Edit
    v-model="state.dialogVisible"
    refs="editRef"
    :company-detail="state.companyDetail"
    @get-company-list="getCompanyList"
  />
</template>

<style scoped>
.company {
  .company-item {
    min-width: 280px;
    width: calc(33.333% - 16px);
    height: 250px;
    flex: 0 0 calc(33.333% - 16px);
  }
  .add-company {
    min-width: 280px;
    width: calc(33.333% - 16px);
    height: 250px;
    flex: 0 0 calc(33.333% - 16px);
  }
  .overflow {
    @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
  }
}

@media (max-width: 768px) {
  .company {
    .company-item,
    .add-company {
      width: 100%;
      flex: 0 0 100%;
    }
  }
}
</style>
