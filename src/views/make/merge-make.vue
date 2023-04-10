<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import CompanyEdit from '../company/components/edit.vue'
import AddressEdit from '../address/components/edit.vue'
import { invoiceTag } from '@/utils/invoice-category'
import {
  deleteCompanyApi,
  getCompanyListApi,
  updateCompanySetDefaultApi,
} from '@/api/company'
import { getShopInfoApi } from '@/api/shop'
import {
  defaultAddressApi,
  deleteAddressApi,
  getAddressListApi,
} from '@/api/address'
import { findSettingApi } from '@/api/setting'
import { mergeMakeApi } from '@/api/invoice'
import { localStorage } from '@/utils/local-storage'

const formRef = ref<FormInstance>()
const route = useRoute()
const router = useRouter()

const state = reactive({
  companyList: [],
  companyEditDialog: false,
  addressEditDialog: false,
  companyDetail: null,
  addressDetail: null,
  addressList: [],
  showType: false,
  price: 0 as any,
  form: {
    category: '',
    type: '企业',
    email: '',
    mobile: '',
    remark: '',
    purchaserName: '个人',
    companyId: '',
    addressId: '',
    outOrderIds: '',
  },
  invoiceCategories: [],
})

const formRules = reactive<FormRules>({
  type: [{
    required: true,
    message: '请选择抬头类型',
    trigger: 'change',
  }],
  category: [{
    required: true,
    message: '请选择发票类型',
    trigger: 'change',
  }],
  purchaserName: [
    {
      required: true,
      message: '请输入发票抬头',
      trigger: 'change',
    },
  ],
  mobile: [{
    required: true,
    message: '请输入接收手机',
    trigger: 'blur',
  }],
  email: [
    {
      required: true,
      message: '请填写接收邮箱',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '请填写正确的邮箱',
      trigger: 'blur',
    },
  ],
})

/**
 * 获取商店门户信息
 */
function getShopInfo() {
  getShopInfoApi().then((res) => {
    if (res.code === 1) {
      state.showType = res.content.ifElectronic
      state.invoiceCategories = res.content.invoiceCategories
      if (state.showType) {
        state.form.property = '电子'
      } else {
        state.form.property = '纸质'
        getAddressList()
      }
    }
  })
}

/**
 * 获取发票默认类型
 */
function findSetting() {
  const params = {
    fieldKeys: 'default-invoice-category',
  }
  findSettingApi(params).then((res) => {
    if (res.code === 1)
      state.form.category = res.content[0].fieldValue
  })
}

/**
 * 获地址列表
 */
function getAddressList() {
  const params = {}
  getAddressListApi(params).then((res) => {
    if (res.code === 1) {
      state.addressList = res.content
      for (const address of state.addressList) {
        if (address.ifDefault)
          state.form.addressId = address.addressId
      }
    } else {
      state.addressList = []
      state.form.addressId = ''
    }
  })
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
  if (event.ifDefault)
    return

  defaultAddressApi(event.addressId).then((res) => {
    if (res.code === 1) {
      ElMessage.success(res.message)
      getAddressList()
    }
  })
}

/**
 * 打开地址抬头弹窗
 */
function openAddressEditModal(event) {
  state.addressEditDialog = true
  state.addressDetail = event
}

/**
 * 获地公司抬头列表
 */
function getCompanyList() {
  const params = {
    page: 0,
    size: 6,
  }
  getCompanyListApi(params).then((res) => {
    if (res.code === 1) {
      state.companyList = res.content
      for (const company of state.companyList) {
        if (company.ifDefault)
          state.form.companyId = company.companyId
      }
    } else {
      state.companyList = []
      state.form.companyId = ''
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
 * 打开编辑抬头弹窗
 */
function openCompanyEditModal(event) {
  state.companyEditDialog = true
  state.companyDetail = event
}

/**
 * 选择发票类型
 */
function selectCategory(type) {
  state.form.category = type
}

/**
 * 提交
 */
async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl)
    return

  if (state.form.property === '纸质' && !state.form.addressId)
    return ElMessage.error('请选择邮寄地址')

  if (state.form.type === '企业' && !state.form.companyId)
    return ElMessage.error('请选择开票抬头')

  await formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('您确定要开具发票吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (state.form.property === '电子') {
          state.form.addressId = ''
          state.form.category = '增值税电子普通发票'
        }
        if (state.form.type === '个人') {
          if (state.form.property === '纸质')
            state.form.category = '增值税普通发票'

          state.form.companyId = ''
        }
        if (state.form.type === '企业')
          state.form.purchaserName = ''

        const data = state.form
        data.outOrderIds = localStorage.get('outOrderIds')
        mergeMakeApi(data).then((res) => {
          if (res.code === 1) {
            ElMessage.success('提交成功')
            router.push('/')
          }
        })
      })
    }
  })
}

onMounted(() => {
  state.price = route.query.price
  getCompanyList()
  getShopInfo()
  findSetting()
})
</script>

<template>
  <div class="merge-make">
    <el-form
      ref="formRef"
      :model="state.form"
      :rules="formRules"
      label-width="auto"
    >
      <h3 class="text-base font-semibold my-4">
        发票形式
      </h3>
      <div class="w-full">
        <el-row :gutter="20" class="w-11/12" >
          <el-col :span="8" v-for="(item,index) in state.invoiceCategories" :key="index" >
            <div
              class="flex items-center justify-center w-full h-32 mr-4 mb-4 rounded border cursor-pointer relative hover:border-blue-600 hover:text-blue-600"
              :class="{ selectStyle: state.form.category === item.category }"
              @click="selectCategory(item.category)"
            >
              <div class="text-center text-xl">
                <el-tag :style="`background-color:${invoiceTag({category:item.category}).bgColor};color:${invoiceTag({category:item.category}).color};border-color:${invoiceTag({category:item.category}).color}`">
                  {{ invoiceTag({ category: item.category }).name }}
                </el-tag>
                <p class="mt-2">{{item.category}}</p>
              </div>
              <img
                v-if="state.form.category === item.category"
                src="../../assets/images/default.png"
                class="absolute bottom-0 right-0"
              >
            </div>
          </el-col>
        </el-row>

      </div>
      <h3 class="text-base font-semibold my-4">
        发票抬头
      </h3>
      <el-form-item label="抬头类型" prop="type">
        <el-radio-group v-model="state.form.type">
          <el-radio label="企业">
            企业
          </el-radio>
          <el-radio label="个人">
            个人
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="state.form.type === '个人'" label="发票抬头" prop="purchaserName">
        <el-input v-model="state.form.purchaserName" placeholder="可输入个人姓名或事业单位名称" class="w-80" />
      </el-form-item>
      <div v-if="state.form.type === '企业'" class="flex flex-wrap">
        <div
          v-for="(item, index) in state.companyList" :key="index"
          :class="item.ifDefault ? 'border-blue-600 relative' : ''"
          class="company-item rounded border px-4 pb-4 mr-4 mt-4 cursor-pointer hover:border-blue-600"
          @click="updateCompanySetDefault(item)"
        >
          <div class="flex justify-between items-center border-b h-10 mb-2">
            <span class="text-base font-semibold">{{ item.name }}</span>
            <el-tag v-if="item.ifDefault" type="primary" effect="dark">
              默认
            </el-tag>
            <span v-else class="text-blue-400">设为默认</span>
          </div>
          <p class="text-base font-semibold">
            {{ item.taxNumber }}
          </p>
          <div class="mt-4">
            <el-button type="primary" @click.stop="openCompanyEditModal(item)">
              修改
            </el-button>
            <el-button type="danger" plain @click.stop="deleteCompany(item.companyId)">
              删除
            </el-button>
          </div>
          <img
            v-if="item.ifDefault"
            src="../../assets/images/default.png"
            class="absolute bottom-0 right-0"
          >
        </div>
        <div
          v-if="state.companyList.length < 6"
          class="add-company flex border mt-4 items-center justify-center cursor-pointer rounded hover:shadow-md"
          @click="openCompanyEditModal(null)"
        >
          <img src="../../assets/images/plus.png" alt="">
        </div>
      </div>
      <h3 class="text-base font-semibold my-4">
        发票信息
      </h3>
      <el-form-item label="发票金额">
        <span>{{ state.price }} 元</span>
      </el-form-item>
      <el-form-item label="发票备注">
        <el-input
          v-model="state.form.remark"
          placeholder="可输入开票备注"
          class="w-80"
        />
      </el-form-item>
      <el-form-item v-if="state.form.property === '电子'" label="接收手机" prop="mobile">
        <el-input v-model="state.form.mobile" placeholder="请输入手机号码" class="w-80" />
      </el-form-item>
      <el-form-item v-if="state.form.property === '电子'" label="接收邮箱" prop="email">
        <el-input v-model="state.form.email" placeholder="接收邮箱" class="w-80" />
      </el-form-item>
      <div v-if="state.form.property !== '电子'">
        <h3 class="text-base font-semibold mt-4">
          邮寄地址
        </h3>
        <div class="flex flex-wrap">
          <div
            v-for="(item, index) in state.addressList"
            :key="index"
            :class="item.ifDefault ? 'border-blue-600 relative' : ''"
            class="address-item rounded border px-4 pb-4 mr-4 mt-4 cursor-pointer hover:border-blue-600"
            @click="defaultAddress(item)"
          >
            <div class="flex justify-between items-center border-b h-10 mb-2">
              <span class="text-base font-semibold">{{ item.name }}</span>
              <el-tag v-if="item.ifDefault" type="primary" effect="dark">
                默认
              </el-tag>
              <span v-else class="text-blue-400">设为默认</span>
            </div>
            <div class="leading-7">
              <p class="overflow">
                {{ item.mobile }}
              </p>
              <p class="overflow">
                {{ item.province }}&nbsp;&nbsp;{{ item.city }}&nbsp;&nbsp;{{ item.district }}
              </p>
              <p class="overflow">
                {{ item.addr }}
              </p>
            </div>
            <div class="mt-4">
              <el-button type="primary" @click.stop="openAddressEditModal(item)">
                修改
              </el-button>
              <el-button type="danger" plain @click.stop="deleteAddress(item.addressId)">
                删除
              </el-button>
            </div>
            <img
              v-if="item.ifDefault"
              src="../../assets/images/default.png"
              class="absolute bottom-0 right-0"
            >
          </div>
          <div
            v-if="state.companyList.length < 6"
            class="add-address flex border mt-4 items-center justify-center cursor-pointer rounded hover:shadow-md"
            @click="openAddressEditModal(null)"
          >
            <img src="../../assets/images/plus.png" alt="">
          </div>
        </div>
      </div>
      <el-form-item class="mt-4">
        <el-button type="primary" @click="onSubmit(formRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <CompanyEdit
    v-model="state.companyEditDialog"
    :company-detail="state.companyDetail"
    @getCompanyList="getCompanyList"
  />
  <AddressEdit
    v-model="state.addressEditDialog"
    :address-detail="state.addressDetail"
    @getAddressList="getAddressList"
  />
</template>

<style lang="less" scoped>
.selectStyle {
@apply border border-blue-600 text-blue-600;
}

.company-item,
.add-company {
  width: 345px;
  height: 140px;
}

.address-item,
.add-address {
  width: 345px;
  height: 200px;
}

.overflow {
@apply overflow-hidden overflow-ellipsis whitespace-nowrap;
}
</style>
