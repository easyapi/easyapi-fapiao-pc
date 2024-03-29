// https://router.vuejs.org/zh/
import { createRouter, createWebHistory } from 'vue-router'
import routes from './route'

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

router.beforeEach((_to, _from, next) => {
  next()
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
