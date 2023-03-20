<script setup lang="ts">
import { createAddressApi, updateAddressApi } from '@/api/address'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { validMobile } from '@/utils/validate'
const emit = defineEmits(['update:modelValue', 'getAddressList'])

const ruleFormRef = ref<FormInstance>()
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
  formData: {
    name: '',
    mobile: '',
    province: '',
    city: '',
    district: '',
    addr: '',
    addressId: '',
    ifDefault: true,
  },
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入收件人姓名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入正确的手机号码', trigger: 'blur' },
    { validator: mobileCodeVerify, trigger: 'blur' },
  ],
})

/**
 * 关闭弹窗
 */
function handleClose() {
  show.value = false
  emit('update:modelValue', false)
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
        let data = state.formData
        if (state.formData.addressId) {
          updateAddressApi(state.formData.addressId, data).then((res) => {
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

/**
 * 重置
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

watch(
  () => props.modelValue,
  (value) => {
    show.value = value
    if (value) {
      if (props.addressDetail) {
        state.title = '编辑地址'
        Object.assign(state.formData, props.addressDetail)
      } else {
        state.title = '添加地址'
        Object.assign(state.formData, {
          name: '',
          mobile: '',
          province: '',
          city: '',
          district: '',
          addr: '',
          addressId: '',
          ifDefault: true,
        })
        resetForm(ruleFormRef.value)
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
        ref="ruleFormRef"
        :model="state.formData"
        :rules="formRules"
        label-width="auto"
      >
        <el-form-item label="收件人姓名" prop="name">
          <el-input
            v-model="state.formData.name"
            placeholder="请输入收件人姓名"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="state.formData.mobile"
            placeholder="请输入正确的手机号码"
          />
        </el-form-item>
        <el-form-item label="所在省市区"> </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="state.formData.addr"
            placeholder="请输入详细地址"
          />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-checkbox v-model="state.formData.ifDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="onSubmit(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>