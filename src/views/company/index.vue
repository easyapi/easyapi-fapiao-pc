<script setup lang="ts">
import {
  getCompanyListApi,
  updateCompanySetDefaultApi,
  deleteCompanyApi,
  getIfManageCompanyApi,
} from '@/api/company'
import { localStorage } from '@/utils/local-storage'
import { ElMessage, ElMessageBox } from 'element-plus'
import { title } from 'process'
import Edit from './components/edit.vue'

const editRefs = ref()

const state = reactive({
  ifManageCompany: true, //是否可以管理公司抬头
  tableData: [],
  dialogVisible: false,
  companyDetail: null,
})

/**
 * 更新默认抬头
 */
function updateCompanySetDefault(companyId) {
  updateCompanySetDefaultApi(companyId).then((res) => {
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
      for (let setting of res.content) {
        if (setting.field === 'ifManageCompany') {
          state.ifManageCompany = setting.value
        }
      }
    }
  })
}

/**
 * 获取抬头列表
 */
function getCompanyList() {
  let params = {
    page: 0,
    size: 6,
  }
  getCompanyListApi(params).then((res) => {
    if (res.code === 1) {
      state.tableData = res.content
    } else {
      state.tableData = []
    }
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
    <h3 class="my-4">发票抬头</h3>
    <div class="flex flex-wrap">
      <div
        v-for="(item, index) in state.tableData"
        :key="index"
        @click="updateCompanySetDefault(item.companyId)"
      >
        <div
          :class="
            item.ifDefault ? 'companyList-item select' : 'companyList-item'
          "
        >
          <div
            class="flex justify-between items-center companyList-item_name mb-2"
          >
            <span class="text-sm font-semibold">{{ item.name }}</span>
            <el-tag type="primary" effect="dark" v-if="item.ifDefault"
              >默认</el-tag
            >
            <span v-else class="text-blue-400">设为默认</span>
          </div>
          <p>{{ item.taxNumber || '——' }}</p>
          <p>{{ item.bank || '——' }}</p>
          <p>{{ item.bankAccount || '——' }}</p>
          <p>{{ item.address || '——' }}</p>
          <p>{{ item.phone || '——' }}</p>
          <div class="mt-4">
            <el-button type="primary" @click.stop="openEditModal(item)"
              >修改
            </el-button>
            <el-button type="danger" @click.stop="deleteCompany(item.companyId)"
              >删除
            </el-button>
          </div>
          <img
            v-if="item.ifDefault === true"
            src="../../assets/images/default.png"
            class="absolute bottom-0 right-0"
          />
        </div>
      </div>
      <div
        class="add-company flex items-center justify-center cursor-pointer hover:shadow-md"
        @click="openEditModal(null)"
        v-if="state.tableData.length < 6"
      >
        <img src="../../assets/images/plus.png" alt="" />
      </div>
    </div>
    <p class="text-gray-400 text-sm">注意：发票抬头最多可以添加6个</p>
  </div>
  <Edit
    refs="editRefs"
    v-model="state.dialogVisible"
    :company-detail="state.companyDetail"
    @getCompanyList="getCompanyList"
  />
</template>

<style lang="less" scoped>
.company {
  .companyList-item {
    width: 310px;
    height: 240px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    padding: 0px 15px 15px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;

    .companyList-item_name {
      border-bottom: 1px solid #dddddd;
      height: 40px;
    }

    p {
      font-size: 14px;
      line-height: 26px;
      width: 280px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #515a6e;
    }

    &:hover {
      border-color: #2d8cf0;
    }
  }

  .select {
    border: solid 1px #2d8cf0;
    position: relative;
  }

  .add-company {
    width: 340px;
    height: 255px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    margin-bottom: 20px;
  }
}
</style>