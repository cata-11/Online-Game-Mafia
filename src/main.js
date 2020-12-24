import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueCountdownTimer from "vuejs-countdown-timer";

import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000/'),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))

Vue.use(VueCountdownTimer);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  VueCountdownTimer,
  render: h => h(App)
}).$mount("#app");
