<template>
  <div class="table-wrap">
    <b-table
      :data="orders"
      :show-detail-icon="false"
      ref="table"
      class="orders-table"
      detailed
      paginated
      :per-page="7"
      :detail-key="tableRowIDKey"
      sticky-header
      height="800px"
      sort-icon="arrow-up"
    >
      <b-table-column v-slot="orderProps" centered cell-class="table-cell">
        <b-dropdown aria-role="list">
          <template #trigger>
            <b-button type="is-ghost">
              <b-icon icon="dots-vertical"></b-icon>
            </b-button>
          </template>
          <b-dropdown-item aria-role="Edit">
            <router-link
              :to="'/edit/' + orderProps.row[tableRowIDKey]"
              class="columns"
            >
              <div class="column">
                <b-icon icon="pencil" />
              </div>
              <div class="column">Edit</div>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item
            aria-role="Delete"
            @click="deleteOrderHandler(orderProps.row[tableRowIDKey])"
          >
            <div class="columns">
              <div class="column">
                <b-icon icon="delete" />
              </div>
              <div class="column">Delete</div>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </b-table-column>
      <b-table-column
        v-for="column in orderColumns"
        :key="column"
        :field="column"
        :label="getTableCellLabel(column)"
        v-slot="orderProps"
        sortable
        :searchable="column === 'name' || column === 'order_ID'"
        centered
        cell-class="table-cell"
      >
        <template v-if="isNestedCell(column)">
          <div
            class="details-trigger"
            @click="
              toggleDetailsHandler(orderProps.row, getTableCellLabel(column))
            "
          >
            <b-icon
              :icon="getDetailsIcon(orderProps.row, getTableCellLabel(column))"
            />
          </div>
        </template>
        <template v-else>
          {{ getTableCellValue(orderProps.row[column]) }}
        </template>
      </b-table-column>

      <template #detail="orderProps">
        <b-table
          :data="getDetailRowArr(orderProps.row)"
          :ref="`details-table-${orderProps.row[tableRowIDKey]}`"
          class="detailed-row-table"
        >
          <b-table-column
            v-for="detailRowColumn in getDetailRowKeys(orderProps.row)"
            :key="detailRowColumn"
            :label="detailRowColumn"
            :field="detailRowColumn"
            v-slot="detailRowProps"
          >
            {{ getTableCellValue(detailRowProps.row[detailRowColumn]) }}
          </b-table-column>
        </b-table>
      </template>

      <b-button type="is-ghost">
        <router-link to="/new" class="columns">
          <b-icon class="column" icon="plus-circle"></b-icon>
          <div class="column">Create new order</div>
        </router-link>
      </b-button>
    </b-table>
  </div>
</template>

<script>
/**
 * This component contains the main view of the app which is the orders table.
 */
import { mapState, mapActions } from "pinia";
import { useOrdersStore } from "@/stores/orders";
import { NESTED_VAL_STRING, TABLE_ROW_ID_KEY } from "@/constants";
// NESTED_VAL_STRING is an indication for rendering nested table values (details)
export default {
  data() {
    return {
      currentDetailRows: {},
      tableRowIDKey: TABLE_ROW_ID_KEY,
    };
  },
  methods: {
    ...mapActions(useOrdersStore, ["deleteOrder"]),
    isNestedCell(key) {
      return key.includes(NESTED_VAL_STRING);
    },
    isEmptyCell(val) {
      if (typeof val !== "number" && !val) return true;
      if (Array.isArray(val)) return !val.length;
      return false;
    },
    getDetailsIcon(row, column) {
      const detailRow = this.currentDetailRows?.[row[TABLE_ROW_ID_KEY]];
      if (detailRow && detailRow.isOpen && detailRow.key === column) {
        return "chevron-down";
      }
      return "chevron-right";
    },
    getTableCellLabel(val) {
      return val.replace(NESTED_VAL_STRING, "");
    },
    getTableCellValue(val) {
      if (this.isEmptyCell(val)) {
        return "-";
      }
      if (typeof val === "number") {
        return Number(val.toFixed(3)) + "";
      }
      return val;
    },
    toggleDetailsHandler(row, column) {
      // sets and toggles the nested table rows
      const getDetailRow = () => this.currentDetailRows[row[TABLE_ROW_ID_KEY]];
      const setDetailRow = () => {
        this.$set(this.currentDetailRows, row[TABLE_ROW_ID_KEY], {
          ...getDetailRow(),
          key: column,
        });
      };
      const toggleDetailsRow = () => {
        this.$refs.table.toggleDetails(row);
        this.$set(this.currentDetailRows, row[TABLE_ROW_ID_KEY], {
          ...getDetailRow(),
          isOpen: !detailRowIsOpen,
        });
      };
      const currentDetailRow = getDetailRow() || {};
      const detailRowIsOpen = currentDetailRow?.isOpen;
      const isNewDetail = currentDetailRow?.key !== column;

      if (detailRowIsOpen && isNewDetail) {
        setDetailRow();
      } else if (detailRowIsOpen && !isNewDetail) {
        toggleDetailsRow();
      } else {
        setDetailRow();
        toggleDetailsRow();
      }
    },
    getDetailRowArr(row) {
      // returns array of objects (line_items or transactions)
      const detailRowKey = this.currentDetailRows[row[TABLE_ROW_ID_KEY]]?.key;
      return row[detailRowKey] || [];
    },
    getDetailRowKeys(row) {
      const detailArr = this.getDetailRowArr(row);
      return detailArr.length ? Object.keys(detailArr[0]) : {};
    },
    deleteOrderHandler(id) {
      this.deleteOrder(id);
    },
  },
  computed: {
    ...mapState(useOrdersStore, ["orders"]),
    orderColumns() {
      // returns the key of the column
      // NESTED_VAL_STRING is an indication for rendering nested table values (details)
      if (this.orders?.length) {
        return Object.entries(this.orders[0]).map(([key, value]) => {
          if (Array.isArray(value) && value.length) {
            return key + NESTED_VAL_STRING;
          }
          return key;
        });
      }
      return [];
    },
  },
};
</script>

<style scoped lang="scss">
.orders-table {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
