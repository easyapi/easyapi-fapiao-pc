<script setup lang="ts">
import {
  getAddressListApi,
  defaultAddressApi,
  deleteAddressApi,
} from '@/api/address'
import { localStorage } from '@/utils/local-storage'
import { ElMessage, ElMessageBox } from 'element-plus'
import Edit from './components/edit.vue'

const editRef = ref()

const state = reactive({
  tableData: [],
  dialogVisible: false,
  addressDetail: null,
})

function openEditModal(event) {
  state.dialogVisible = true
  state.addressDetail = event
}

/**
 * 删除地址
 */
function deleteAddress(addressId) {
  ElMessageBox.confirm('您确定要删除该地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteAddressApi(addressId).then((res) => {
      if (res.code === 1) {
        ElMessage.success(res.message)
        getAddressList()
      }
    })
  })
}

/**
 * 设置默认地址
 */
function defaultAddress(event) {
  if (event.ifDefault) return
  defaultAddressApi(event.addressId).then((res) => {
    if (res.code === 1) {
      ElMessage.success(res.message)
      getAddressList()
    }
  })
}

/**
 * 获取地址列表
 */
function getAddressList() {
  let params = {}
  getAddressListApi(params).then((res) => {
    if (res.code === 1) {
      state.tableData = res.content
    }
  })
}

onMounted(() => {
  getAddressList()
})
</script>

<template>
  <div class="address">
    <div class="mt-6 flex flex-wrap">
      <div
        v-for="(item, index) in state.tableData"
        :key="index"
        @click="defaultAddress(item)"
      >
        <div
          :class="item.ifDefault ? 'border-blue-600 relative' : ''"
          class="address-item rounded border px-4 pb-4 mr-4 mb-4 cursor-pointer hover:border-blue-600"
        >
          <div class="flex justify-between items-center border-b h-10 mb-2">
            <span class="text-base font-semibold">{{ item.name }}</span>
            <el-tag type="primary" effect="dark" v-if="item.ifDefault">
              默认
            </el-tag>
            <span v-else class="text-blue-400">设为默认</span>
          </div>
          <div class="leading-7">
            <p class="overflow">{{ item.mobile }}</p>
            <p class="overflow">
              {{ item.province }}&nbsp;&nbsp;{{ item.city }}&nbsp;&nbsp;{{
                item.district
              }}
            </p>
            <p class="overflow">{{ item.addr }}</p>
          </div>
          <div class="mt-4">
            <el-button type="primary" @click.stop="openEditModal(item)">
              修改
            </el-button>
            <el-button
              type="danger"
              plain
              @click.stop="deleteAddress(item.addressId)"
            >
              删除
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
        class="add-address flex border mb-4 items-center justify-center cursor-pointer rounded hover:shadow-md"
        @click="openEditModal(null)"
        v-if="state.tableData.length < 6"
      >
        <img src="../../assets/images/plus.png" alt="" />
      </div>
    </div>
    <p class="text-gray-400 text-sm">注意：邮寄地址最多可以添加6个</p>
  </div>
  <Edit
    refs="editRef"
    v-model="state.dialogVisible"
    :address-detail="state.addressDetail"
    @getAddressList="getAddressList"
  />
</template>

<style lang="less" scoped>
.address {
  .address-item,
  .add-address {
    width: 340px;
    height: 215px;
  }
  .overflow {
    @apply overflow-hidden overflow-ellipsis whitespace-nowrap;
  }
}
</style>