<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { createCompanyApi, updateCompanyApi } from '@/api/company'
import { ElMessage, ElMessageBox } from 'element-plus'

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

const emit = defineEmits(['update:modelValue', 'getCompanyList'])

const formRef = ref<FormInstance>()

const state = reactive({
  showDialog: false,
  title: '',
  form: {} as any,
})

/**
 * 关闭弹窗
 */
function handleClose() {
  state.showDialog = false
  emit('update:modelValue', false)
}

/**
 * 提交
 */
async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('您确定要提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = state.form
        if (state.form.companyId) {
          updateCompanyApi(state.form.companyId, data).then((res) => {
            if (res.code === 1) {
              ElMessage.success('编辑成功')
              handleClose()
              emit('getCompanyList')
            }
          })
        }
        else {
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
    state.showDialog = value
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      :title="state.title"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="state.form"
        label-width="auto"
        class="!mt-4"
      >
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="state.form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input v-model="state.form.mobile" placeholder="请输入手机号码" />
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
