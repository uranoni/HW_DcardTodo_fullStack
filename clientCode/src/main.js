import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
import Dayjs from 'vue-dayjs';

Vue.config.productionTip = false
Vue.use(Dayjs)
new Vue({
  render: h => h(App),
}).$mount('#app')
