<script setup lang="ts">
import {
  createAddressApi,
  updateAddressApi,
  getAreaListApi,
} from '@/api/address'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { validMobile } from '@/utils/validate'
const emit = defineEmits(['update:modelValue', 'getAddressList'])

const formRef = ref<FormInstance>()
const show = ref(false)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  addressDetail: {
    type: Object,
    default: null,
  },
})

const mobileCodeVerify = (rule, value, callback) => {
  if (validMobile(value) === false) {
    return callback(new Error('请输入正确格式的11位手机号码'))
  }
  callback()
}

const state = reactive({
  title: '',
  areaList: [],
  form: {
    name: '',
    mobile: '',
    province: '',
    city: '',
    district: '',
    addr: '',
    addressId: '',
    ifDefault: true,
    selectAddressList: [],
  },
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
    { validator: mobileCodeVerify, trigger: 'blur' },
  ],
  selectAddressList: [
    { required: true, message: '请选择省市区', trigger: 'change' },
  ],
  addr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
})

/**
 * 关闭弹窗
 */
function handleClose() {
  show.value = false
  emit('update:modelValue', false)
}

/**
 * 获取省市区地址
 */
const getAreaList = () => {
  getAreaListApi().then((res) => {
    let arr = []
    res.provinces.forEach((item, index) => {
      arr.push({
        value: item.name,
        label: item.name,
        children: [],
      })
      if (item.cities && item.cities.length > 0) {
        item.cities.forEach((citem, cindex) => {
          arr[index].children.push({
            value: citem.name,
            label: citem.name,
            children: [],
          })
          if (citem.districts && citem.districts.length > 0) {
            citem.districts.forEach((cnitem) => {
              arr[index].children[cindex].children.push({
                value: cnitem.name,
                label: cnitem.name,
              })
            })
          }
        })
      }
    })
    state.areaList = arr
  })
}

/**
 * 提交
 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('您确定要提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let data = state.form
        data.province = state.form.selectAddressList[0]
        data.city = state.form.selectAddressList[1]
        data.district = state.form.selectAddressList[2]
          ? state.form.selectAddressList[2]
          : ''
        if (state.form.addressId) {
          updateAddressApi(state.form.addressId, data).then((res) => {
            if (res.code === 1) {
              ElMessage.success('编辑成功')
              handleClose()
              emit('getAddressList')
            }
          })
        } else {
          createAddressApi(data).then((res) => {
            if (res.code === 1) {
              ElMessage.success('添加成功')
              handleClose()
              emit('getAddressList')
            }
          })
        }
      })
    }
  })
}

watch(
  () => props.modelValue,
  (value) => {
    show.value = value
    if (value) {
      getAreaList()
      if (props.addressDetail) {
        state.title = '编辑地址'
        Object.assign(state.form, props.addressDetail)
        state.form.selectAddressList = [
          props.addressDetail.province,
          props.addressDetail.city,
          props.addressDetail.district,
        ]
      } else {
        state.title = '添加地址'
        state.form = {
          name: '',
          mobile: '',
          province: '',
          city: '',
          district: '',
          addr: '',
          addressId: '',
          ifDefault: true,
          selectAddressList: [],
        }
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <el-dialog
      v-model="show"
      :title="state.title"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="formRules"
        label-width="auto"
      >
        <el-form-item label="收件人姓名" prop="name">
          <el-input v-model="state.form.name" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="state.form.mobile"
            placeholder="请输入正确的手机号码"
          />
        </el-form-item>
        <el-form-item label="所在省市区" prop="selectAddressList">
          <el-cascader
            class="w-full"
            placeholder="请选择所在省市区"
            v-model="state.form.selectAddressList"
            :options="state.areaList"
            :props="{ expandTrigger: 'hover' }"
            filterable
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="state.form.addr" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-checkbox v-model="state.form.ifDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="onSubmit(formRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>