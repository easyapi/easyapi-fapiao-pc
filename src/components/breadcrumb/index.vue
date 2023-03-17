<script setup lang="ts">
import { localStorage } from '@/utils/local-storage'
import routes from '../../router/route'

const router = useRouter()

const state = reactive({
  pages: [],
})

onMounted(() => {})

watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    state.pages = routes.filter((x) => x.path === toPath)[0].breadcrumb
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="breadcrumb flex items-center">
    <img src="../../assets/images/logo.png" class="w-6 h-6 mr-2" />
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in state.pages"
        :key="index"
        :to="{ path: item.path }"
      >
        <span class="text-xl">{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="less" scoped>
.breadcrumb {
  padding: 0 0 20px;
  border-bottom: 1px solid #ddd;
}
</style>