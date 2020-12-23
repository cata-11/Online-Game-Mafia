import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueCountdownTimer from "vuejs-countdown-timer";

import socketio from "socket.io";
import VueSocketIO from "vue-socket.io";

export const SocketInstance = socketio("http://localhost:4113");

Vue.use(VueSocketIO, SocketInstance);
Vue.use(VueCountdownTimer);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  VueCountdownTimer,
  render: h => h(App)
}).$mount("#app");
