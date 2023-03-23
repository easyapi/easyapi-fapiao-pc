<script setup lang="ts">
import {
  getCompanyListApi,
  getCompanyApi,
  updateCompanyApi,
  createCompanyApi,
  deleteCompanyApi,
  getCompanyCodeListApi,
} from '../../api/company'
import { getShopInfoApi } from '../../api/shop'
import { getDefaultAddressApi } from '../../api/address'
import { findSettingApi } from '../../api/setting'
import { localStorage } from '@/utils/local-storage'

const route = useRoute()
const router = useRouter()

const state = reactive({
  companyList: [],
  showType: false,
  showInfo: false,
  showModal: false,
  defaultAddress: '',
  ifManageCompany: true, //是否可以管理公司抬头
  showAddressInfo: false,
  modalTitle: '添加发票抬头',
  makeUp: '',
  ids: '',
  price: '',
  scrollTop: '',
  invoiceForm: {
    category: '',
    property: '',
    type: '企业',
    email: '',
    mobile: '',
    remark: '',
    purchaserName: '个人',
    companyId: '',
    addressId: '',
  },
  companyForm: {
    companyId: '',
    name: '',
    taxNumber: '',
    bank: '',
    bankAccount: '',
    address: '',
    phone: '',
    ifDefault: true,
  },
})

/**
 * 获取商店门户信息
 */
function getShopInfo() {
  getShopInfoApi().then((res) => {
    if (res.code === 1) {
      state.showType = res.content.ifElectronic
      if (state.showType) {
        state.invoiceForm.property = '电子'
      } else {
        state.invoiceForm.property = '纸质'
        getAddressList()
      }
    }
  })
}

/**
 * 获取发票默认类型
 */
function findSetting() {
  let params = {
    fieldKeys: 'default-invoice-category',
  }
  findSettingApi(params).then((res) => {
    if (res.code === 1) {
      state.invoiceForm.category = res.content[0].fieldValue
    }
  })
}

/**
 * 获取默认邮寄地址
 */
function getAddressList() {
  getDefaultAddressApi().then((res) => {
    if (res.code === 1) {
      state.defaultAddress = res.content
      state.showAddressInfo = true
    } else if (res.code === 0) {
      state.showAddressInfo = false
      state.defaultAddress = null
    }
  })
}

function getCompanyList() {
  let params = {
    accessToken: localStorage.get('accessToken'),
  }
  getCompanyListApi(params).then((res) => {
    if (res.code == 1) {
      state.companyList = res.content
      state.showInfo = true
      for (let company of state.companyList) {
        if (company.ifDefault == true) {
          state.companyForm.companyId = company.companyId
        }
      }
    } else {
      state.showInfo = false
      state.companyList = []
    }
  })
}

function getCompany(id) {
  getCompanyApi(id).then((res) => {
    if (res.code === 1) {
      state.companyForm.name = res.content.name
      state.companyForm.taxNumber = res.content.taxNumber
      state.companyForm.bank = res.content.bank
      state.companyForm.bankAccount = res.content.bankAccount
      state.companyForm.address = res.content.address
      state.companyForm.phone = res.content.phone
      state.companyForm.ifDefault = res.content.ifDefault
    }
  })
}

onMounted(() => {
  // getIfManageCompany();
  // getCompanyList()
  // getShopInfo()
  // findSetting()
})
</script>

<template>
  <div>
    <!-- <div class="invoice-nature">
      <h3 class="h3-title">发票形式</h3>
      <div style="display: flex; height: 120px">
        <div
          v-show="showType"
          class="electronic-invoice"
          :class="{ SelectedStyle: invoiceForm.property === '电子' }"
          @click="selectedProperty('电子')"
        >
          <span style="color: #333333; font-size: 14px">电子发票</span>
          <span style="font-size: 12px; color: #999999">最快5分钟开具</span>
          <img
            v-if="invoiceForm.property === '电子'"
            src="../../assets/images/default.png"
            alt
            style="position: absolute; bottom: 0px; right: 0px"
          />
        </div>
        <div
          v-show="!showType"
          class="electronic-invoice"
          style="margin-left: 20px"
          :class="{ SelectedStyle: invoiceForm.property === '纸质' }"
          @click="selectedProperty('纸质')"
        >
          <span style="color: #333333; font-size: 14px">纸质发票</span>
          <span style="font-size: 12px; color: #999999">预计2天送达</span>
          <img
            v-if="invoiceForm.property === '纸质'"
            src="../../assets/images/default.png"
            alt
            style="position: absolute; bottom: 0px; right: 0px"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>