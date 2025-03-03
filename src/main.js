import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import directives from '@/directives/index'
import '@/icons/index'
import "@/styles/index.less"
import 'vant/es/toast/style';
import SvgIcon from "@/components/SvgIcon"


const app = createApp(App)
app.component("SvgIcon",SvgIcon)
app.use(store).use(router).use(directives).mount('#app')
