<template>
  <div class="bg-gray-100 h-[calc(100vh-90px)] overflow-auto relative">
    <!-- Sidebar -->

    <!-- Main Content -->
    <div class="w-full float-right p-4 bg-white rounded">
      <!-- Product Filter -->
      <ProductFilter/>
      
      <!-- Search bar, filters, and product list -->
      <div class="flex justify-between items-center mb-4">

      <!-- Product Table -->
      <vue-good-table
      @on-selected-rows-change="selectionChanged"
        :columns="columns"
        :rows="displayedProducts"
        :search-options="{ enabled: false }"
        :select-options="{ enabled: true }"
        :pagination-options="{ enabled: true, mode: 'pages' }">
        <div slot="selected-row-actions">
          <button @click="editProduct">Edit Product</button>
        </div>
      </vue-good-table>
    </div>
  </div>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import { mapGetters, mapActions } from 'vuex';
import "vue-good-table/dist/vue-good-table.css";
import ProductFilter from './ProductFilter.vue'

export default {
  name: 'ProductsHome',
  components: {
      VueGoodTable,
      ProductFilter
  },
  data() {
    return {
      searchTerm: '',
      columns: [
       {
         label: 'Brand Name',
         field: 'brand_name',
       },
       {
         label: 'Price',
         field: 'price',
       },
       {
         label: 'Nicotine Amount',
         field: 'nicotine_amount',
       },
       {
         label: 'Bottle Size',
         field: 'bottle_size',
       },
       {
         label: 'Description',
         field: 'description',
         sortable: false,
       },
       {
         label: 'Flavor',
         field: 'flavor',
       },
       {
         label: 'Categories',
         field: 'categories',
       },
     ],
     selectedRows: []
    };
  },
  created() {
      this.loadProducts();
  },
  methods: {
      updateFilteredProducts(newFilteredProducts) {
          this.filteredProducts = newFilteredProducts;
      },
      ...mapActions(['loadProducts', 'updateEditableProductID']),
      editProduct() {
        if (this.selectedRows.length) {
          const productToEdit = this.selectedRows[0]; // if you're only allowing single selection
          this.updateEditableProductID(productToEdit.product_id);
        }
      },
      selectionChanged(params) {
        this.selectedRows = params.selectedRows;
      },
  },
  computed: {
      ...mapGetters(['allProducts', 'filteredProducts']),
      products() {
          return this.allProducts;
      },
      displayedProducts() {
          return this.filteredProducts.length ? this.filteredProducts : this.allProducts;
      },
  }
}
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
