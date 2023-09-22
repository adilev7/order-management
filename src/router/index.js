import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import OrderForm from "@/components/Orders/OrderForm.vue";
import UnavailableView from "@/views/UnavailableView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/new",
      name: "new",
      component: OrderForm
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: OrderForm
    },
    {
      path: "/unavailable",
      name: "unavailable",
      component: UnavailableView,
    },
  ],
});

export default router;
