<template>
  <form @submit.prevent="submitHandler">
    <div class="field-wrap" v-for="key in orderKeys" :key="key">
      <b-field
        :label="key"
        v-if="
          $route.path !== '/new' ||
          (key !== 'line_items' &&
            key !== 'transactions' &&
            $route.path === '/new')
        "
      >
        <b-switch v-if="typeof order[key] === 'boolean'" v-model="order[key]" />
        <div class="nested-fields" v-else-if="Array.isArray(order[key])">
          <div
            class="field-wrap"
            v-for="(nestedItem, index) in order[key]"
            :key="
              index +
              '-' +
              nestedItem.order_ID +
              '-' +
              nestedItem[getNestedIDKey(key)]
            "
          >
            <b-field
              :label="nestedKey"
              v-for="(_, nestedKey) in nestedItem"
              :key="nestedKey"
            >
              <b-switch
                v-if="typeof order[key][nestedKey] === 'boolean'"
                v-model="order[key][nestedKey]"
              />
              <b-input
                v-else
                @input="inputChangeHandler($event, key, index, nestedKey)"
                :value="getInputValue(nestedItem[nestedKey])"
              ></b-input>
            </b-field>
          </div>
        </div>
        <b-input
          v-else
          @input="inputChangeHandler($event, key)"
          :value="getInputValue(order[key])"
        ></b-input>
      </b-field>
    </div>
    <b-button type="is-primary" native-type="submit">Submit</b-button>
    <router-link to="/">
    <b-button type="is-primary is-light">Back</b-button>
    </router-link>
  </form>
</template>
<script>
/**
 * This component handles new orders creation and existing orders updates
 */
import { mapState, mapActions } from "pinia";
import { useOrdersStore } from "@/stores/orders";

export default {
  data() {
    return {
      order: {},
    };
  },
  methods: {
    ...mapActions(useOrdersStore, ["getOrder", "updateOrder", "createOrder"]),
    inputChangeHandler(value, key, nestedItemIndex = null, nestedKey = null) {
      // handles input changes for order values and nested values (line_items)
      if (nestedKey) {
        this.order[key][nestedItemIndex][nestedKey] = value;
      } else {
        this.order[key] = value;
      }
    },
    submitHandler() {
      // handles submit for new or updated orders
      if (this.$route.path === "/new") {
        this.orderKeys.forEach((key) => {
          if (!this.order.hasOwnProperty(key)) {
            this.order[key] =
              key === "line_items" || key === "transactions" ? [{}] : "";
          }
        });
        this.createOrder(this.order);
      } else {
        this.updateOrder(this.order);
      }
      this.$router.replace("/");
    },
    getInputValue(val) {
      if (typeof val === "number") {
        return Number(val.toFixed(3)) + "";
      } else if (!val) {
        return "";
      }
      return val;
    },
    getNestedIDKey(key) {
      // returns the relevant ID key for nested properties
      if (key === "line_items") {
        return "line_item_ID";
      } else if (key === "transactions") {
        return "transaction_ID";
      }
    },
  },
  computed: {
    ...mapState(useOrdersStore, ["orderKeys"]),
  },
  mounted() {
    // fetches the order data if id route param provided
    if (this.$route.params.id) {
      const data = this.getOrder(this.$route.params.id);
      if (data) {
        this.order = data;
      } else {
        this.$router.replace("/");
      }
    }
  },
};
</script>
<style lang=""></style>
