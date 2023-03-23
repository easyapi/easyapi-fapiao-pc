<script setup lang="ts">
import {
  getAddressListApi,
  defaultAddressApi,
  deleteAddressApi,
} from '@/api/address'
import { localStorage } from '@/utils/local-storage'
import { ElMessage, ElMessageBox } from 'element-plus'
import Edit from './components/edit.vue'

const editRefs = ref()

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
  if(event.ifDefault) return
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
          :class="
            item.ifDefault ? 'addressList-item select' : 'addressList-item'
          "
        >
          <div
            class="flex justify-between items-center addressList-item_name mb-2"
          >
            <span class="text-base font-semibold">{{ item.name }}</span>
            <el-tag type="primary" effect="dark" v-if="item.ifDefault">
              默认
            </el-tag>
            <span v-else class="text-blue-400">设为默认</span>
          </div>
          <p>{{ item.mobile }}</p>
          <p>
            {{ item.province }}&nbsp;&nbsp;{{ item.city }}&nbsp;&nbsp;{{item.district}}
          </p>
          <p>{{ item.addr }}</p>
          <div class="mt-4">
            <el-button type="primary" @click.stop="openEditModal(item)">
              修改
            </el-button>
            <el-button type="danger" plain @click.stop="deleteAddress(item.addressId)">
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
        class="add-address flex items-center justify-center cursor-pointer hover:shadow-md"
        @click="openEditModal(null)"
      >
        <img src="../../assets/images/plus.png" alt="" />
      </div>
    </div>
  </div>
  <Edit
    refs="editRefs"
    v-model="state.dialogVisible"
    :address-detail="state.addressDetail"
    @getAddressList="getAddressList"
  />
</template>

<style lang="less" scoped>
.address {
  .addressList-item {
    width: 340px;
    height: 215px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    padding: 0 15px 15px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;

    .addressList-item_name {
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

  .add-address {
    width: 340px;
    height: 215px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    margin-bottom: 20px;
  }
}
</style>