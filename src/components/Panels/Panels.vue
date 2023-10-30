<template>
  <div class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl overflow-y-auto">
    <StoreSummary v-if="isStorePanelActive" :store="activeStore" />
    <ProductsHome v-if="isProductsPanelActive" />
  </div>
</template>

<script>
import StoreSummary from '../StoreID/StoreSummary.vue';
import ProductsHome from '../Products/ProductsHome.vue';

export default {
  name: 'PanelSwitch',
  components: {
    StoreSummary,
    ProductsHome,
  },

  props: {
    panelData: {
    type: Object,
        required: true,
        validator: function (value) {
        // Check if the object structure contains 'panel' with a valid value
        const isValidPanel = value.panel && ['store', 'products', /* other panel types */].includes(value.panel);
        // Check if 'activeStore' is either not set or is a number
        const isValidActiveStore = value.store === undefined || typeof value.store === 'number';
        // Both conditions must be true
        return isValidPanel && isValidActiveStore;
        },
    },
    storeData: Object
  },

  computed: {
    isStorePanelActive() {
      return this.panelData.panel === 'store';
    },
    isProductsPanelActive() {
      return this.panelData.panel === 'products';
    },
    activeStore() {
    // This will either return the active store ID or 'undefined' if not set
    return this.panelData.store;
  },
  },

  methods: {
    // Any methods relevant to the panel component
  },
  // ...
};
</script>

<style scoped>
</style>
