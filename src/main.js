import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import Buefy from "buefy";

import App from "./App.vue";
import router from "./router";

import "buefy/dist/buefy.css";
import '@mdi/font/css/materialdesignicons.css'

Vue.use(PiniaVuePlugin).use(Buefy);

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App),
}).$mount("#app");
