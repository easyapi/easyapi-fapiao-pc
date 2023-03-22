<script setup lang="ts">
import { createCompanyApi, updateCompanyApi } from '@/api/company'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['update:modelValue', 'getCompanyList'])

const ruleFormRef = ref<FormInstance>()
const show = ref(false)

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  companyDetail: {
    type: Object,
    default: null,
  },
})

const state = reactive({
  title: '',
  formData: {
    name: '',
    taxNumber: '',
    bank: '',
    bankAccount: '',
    address: '',
    phone: '',
    companyId: '',
    ifDefault: true,
  },
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
  taxNumber: [
    { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
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
        if (state.formData.companyId) {
          updateCompanyApi(state.formData.companyId, data).then((res) => {
            if (res.code === 1) {
              ElMessage.success('编辑成功')
              handleClose()
              emit('getCompanyList')
            }
          })
        } else {
          createCompanyApi(data).then((res) => {
            if (res.code === 1) {
              ElMessage.success('添加成功')
              handleClose()
              emit('getCompanyList')
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
      if (props.companyDetail) {
        state.title = '编辑抬头'
        Object.assign(state.formData, props.companyDetail)
      } else {
        state.title = '添加抬头'
        state.formData = {
          name: '',
          taxNumber: '',
          bank: '',
          bankAccount: '',
          address: '',
          phone: '',
          companyId: '',
          ifDefault: true,
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
        ref="ruleFormRef"
        :model="state.formData"
        :rules="formRules"
        label-width="auto"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input
            v-model="state.formData.name"
            placeholder="请输入发票抬头"
          />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxNumber">
          <el-input
            v-model="state.formData.taxNumber"
            placeholder="请输入纳税人识别号"
          />
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="state.formData.bank" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="开户行账号">
          <el-input
            v-model="state.formData.bankAccount"
            placeholder="请输入开户行账号"
          />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="state.formData.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="state.formData.phone" placeholder="请输入电话" />
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