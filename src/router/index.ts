import { createWebHistory, createRouter } from 'vue-router'
import mainStore from '@store/main'
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
