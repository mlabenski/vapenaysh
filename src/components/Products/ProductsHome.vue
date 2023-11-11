<template>
  <div class="bg-gray-100 h-[calc(100vh-90px)] overflow-auto relative">
    <!-- Main Content -->
    <div class="w-full float-right p-4 bg-white rounded">
      <!-- Product Filter -->
      <ProductFilter/>

      <!-- Product Table -->
      <vue-good-table
        :columns="columns"
        :rows="displayedProducts"
        :paginate="true"
        :lineNumbers="true"
        styleClass="vgt-table striped condensed"
        @on-row-click="onRowClick"
        @on-cell-click="onCellClick"
      >
      <template v-slot:table-row="{ row, column }">
        <span v-if="!isRowEditable(row)">
          {{ row[column.field] }}
        </span>
      <multiselect
      style="color: black"
      v-else-if="column.field === 'categories' && categoryEdit"
        v-model="categoryEdit"
        :options="allCategories" 
        :multiple="true" 
        :close-on-select="false" 
        placeholder="Pick some" >
 
  </multiselect>
      </template>
      </vue-good-table>
    </div>
  </div>
</template>

  
<script>
import { VueGoodTable } from 'vue-good-table';
import { mapGetters, mapActions } from 'vuex';
import Multiselect from 'vue-multiselect'

import "vue-good-table/dist/vue-good-table.css";
import ProductFilter  from './ProductFilter.vue'
  
export default {
    name: 'ProductsHome',
    components: {
      VueGoodTable,
      ProductFilter,
      Multiselect
    },
    data() {
      return {
        searchTerm: '',
        selectedRows: [],
        editingRowId: null,
        categoryEdit: [],
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
           editable: true,
         },
       ],
      };
    },
    created() {
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
      onRowClick(params) {
        console.log(params);
        const { row } = params;
        console.log('Row clicked:', row);
        
        // If you want to initiate editing when any cell in a row is clicked:
        this.categoryEdit = [...row.categories];
        console.log('category edit');
        console.log(this.categoryEdit);
        this.editingRowId = row.product_id; // Assuming 'id' is your unique identifier for the row
      },
      onCellClick(params) {
        const { row, column } = params;
        console.log(params);
        console.log('Cell clicked:', row, column);

        // If you want to initiate editing when a category cell is clicked:
        if (column.field === 'categories') {
          this.editingRowIndex = params.rowIndex; // Assuming 'id' is your unique identifier for the row
        }
      },
      isRowEditable(row) {
        //so we could use row.product_id to determine which row is in use?
        return this.editingRowId === row.product_id;
      },
      updateCategories(row) {
        console.log('hello')
        console.log(row);
        // Here you would dispatch an action to update the categories
        //this.updateProductCategories({ productId: row.id, categories: row.categories });
      },
    },
    computed: {
      ...mapGetters(['allProducts', 'categories', 'filteredProducts']),
      products() {
          return this.allProducts;
      },
      allCategories() {
        return this.categories;
      },
      displayedProducts() {
        // Check for the existence of filteredProducts before accessing length
        return this.filteredProducts && this.filteredProducts.length ? this.filteredProducts : this.allProducts;
    },
    }
  }
  </script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

  <style scoped>
  /* Add any additional styles if needed */
  </style>
  