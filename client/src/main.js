import Vue from 'vue'
import VueSocketIO from 'vue-socket.io';

import socketio from 'socket.io-client';

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

const SocketInstance = socketio('http://localhost:8081');
Vue.use(VueSocketIO, SocketInstance)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
