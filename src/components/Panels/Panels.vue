<template>
  <div class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl overflow-y-auto">
    <StoreSummary v-if="isStorePanelActive" :store="activeStore" />
    <ProductsHome v-if="isProductsPanelActive" />
  </div>
</template>

<script>
import StoreSummary from '../StoreID/StoreSummary';
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
    },
    storeData: Object
  },

  computed: {
    isStorePanelActive() {
      console.log('panel data is')
      console.log(this.panelData);
      return this.panelData.panel === 'store';
    },
    isProductsPanelActive() {
      console.log('panel data is')
      console.log(this.panelData);
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
