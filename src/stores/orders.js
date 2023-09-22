import { defineStore } from "pinia";
import ordersService from '@/services/orders'
import { TABLE_ROW_ID_KEY } from '@/constants'

export const useOrdersStore = defineStore({
  id: "orders",
  state: () => ({
    orders: [],
    isAvailable: true
  }),
  getters: {
    isLoading() {
      return !this.orders.length && this.isAvailable;
    },
    orderKeys() {
      if (this.orders?.length) {
        return Object.keys(this.orders[0]);
      }
      return [];
    }
  },
  actions: {
    async fetchOrders() {
      const data = await ordersService.getOrders();
      if(data) {
        this.orders = data;
        this.isAvailable = true;
      } else {
        this.orders = [];
        this.isAvailable = false;
      }
    },
    createOrder(order) {
      try {
        ordersService.createOrder(order)
      } catch (err) {
        console.log(err)
      }
    },
  
    getOrder(id) {
      const index = this.orders.findIndex((order) => order[TABLE_ROW_ID_KEY] === Number(id));
      if (index === -1) console.log(new Error("Bad request"));
      return this.orders[index];
    },

    updateOrder(order) {
      try {
        const index = this.orders.findIndex((o) => o[TABLE_ROW_ID_KEY] === Number(order[TABLE_ROW_ID_KEY]));
        if (index === -1) {
          console.log(new Error("Bad request"));
        };
        this.orders[index] = order;
      } catch (err) {
        console.log(err)
      }
      
    },

    deleteOrder(id) {
      const index = this.orders.findIndex((o) => o[TABLE_ROW_ID_KEY] === Number(id));
      if (index === -1) throw new Error("Bad request");
      this.orders.splice(index, 1);
    }
  },
});
