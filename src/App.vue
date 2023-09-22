<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useOrdersStore } from '@/stores/orders';
export default {
  computed: {
    ...mapState(useOrdersStore, ['isAvailable'])
  },
  methods: {
    ...mapActions(useOrdersStore, ['fetchOrders'])
  },
  async mounted() {
    await this.fetchOrders();
    if (!this.isAvailable) {
      this.$router.replace('/unavailable')
    }
  }
}
</script>

<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
</style>