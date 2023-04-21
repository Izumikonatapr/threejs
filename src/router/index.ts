import { createWebHistory, createRouter } from 'vue-router'
const routes: any = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@views/home.vue'),
  },
  // 3d官网demo
  {
    path: '/officialWebsite3d',
    name: 'officialWebsite3d',
    component: () => import('@views/demo/officialWebsite3d/officialWebsite3d.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to: any, form: any, next) => {
  next()
})
router.afterEach(() => {

})
export default router
