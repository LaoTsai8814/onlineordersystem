import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia();


app.use(ElementPlus);
app.use(router)
app.use(pinia);

app.use(vue3GoogleLogin, {
  clientId: '467118265294-3q9ecmke2rkm5bef0rbdedi0uj7hijsd.apps.googleusercontent.com'
})
app.mount('#app')
