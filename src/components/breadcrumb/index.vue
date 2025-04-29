<script setup lang="ts">
import routes from '../../router/route'

const router = useRouter()

const state = reactive({
  pages: [],
})

onMounted(() => {})

watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    state.pages = routes.filter(x => x.path === toPath)[0].breadcrumb
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="pb-6 border-b border-[var(--el-border-color)] flex items-center">
    <img src="../../assets/images/logo.png" class="w-6 h-6 mr-2" alt="">
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
