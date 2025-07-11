import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'  
import 'element-plus/dist/index.css'  

const app = createApp(App)
const pinia = createPinia();
//app.use(createPinia())
app.use(router)
app.use(pinia); // 确保 Pinia 被正确挂载
app.use(ElementPlus);
app.mount('#app')

