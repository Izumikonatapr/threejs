import { createApp } from 'vue'

import App from './App.vue'

import router from '@/router/index'
import * as echarts from 'echarts'
import Axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

//注册element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


//创建vm
app.use(router)
app.use(ElementPlus)
//图片预览组件
app.use(VueViewer)
//登录页背景

//option写法挂载到this.
app.config.globalProperties.$http = Axios //配置axios的全局引用
app.config.globalProperties.$echarts = echarts //配置echarts的全局引用

// document.oncontextmenu = function (e) {
//     //禁止默认的右击事件
//     e.preventDefault();
// };

app.mount('#app')
//挂载  挂载如果在xxx.use之前执行  会导致router等无法渲染
