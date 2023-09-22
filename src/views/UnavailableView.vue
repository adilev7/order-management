<template>
  <div>
    <h1>The data is currently unavailable</h1>
    <b-button @click="tryAgainHandler" :loading="isLoading">Try Again</b-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useOrdersStore } from '@/stores/orders';
export default {
  name: "UnavailableView",
  computed: {
    ...mapState(useOrdersStore, ['isAvailable', 'isLoading'])
  },
  methods: {
    ...mapActions(useOrdersStore, ['fetchOrders']),
    async tryAgainHandler() {
      await this.fetchOrders();
      if (this.isAvailable) {
        this.$router.replace('/');
      }
    }
  }
}
</script>