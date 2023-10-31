<template>
  <div class="p-6 bg-white rounded shadow-md">
      <h1 class="text-2xl mb-6">Edit Product Details</h1>
  
      <div class="mb-4 flex">
        <label for="brand" class="block text-sm font-bold mb-2 pr-2 flex-shrink-0">Brand:</label>
        <v-select 
          v-model="localProduct.brand"
          :options="availableBrands"
          class="flex-grow"
          placeholder="Search or select a brand..."
          ref="brandSelect"
        >
          <template #no-options>
            <div @click="addBrandFromInput" class="add-brand-option">
              Add this brand
            </div>
          </template>
        </v-select>
      </div>
  
      <div class="mb-4">
        <label for="category" class="block text-sm font-bold mb-2">Category:</label>
        <select v-model="localProduct.category" @change="updateNicotineOptions" class="border p-2 w-full">
          <option v-for="category in categories" :key="category">{{ category }}</option>
        </select>
      </div>
  
      <div class="mb-4">
        <label for="bottleSize" class="block text-sm font-bold mb-2">Bottle Size:</label>
        <select v-model="localProduct.bottleSize" class="border p-2 w-full">
          <option v-for="size in bottleSizes" :key="size">{{ size }}</option>
        </select>
      </div>
  
      <div class="mb-4">
        <label for="nicotineAmount" class="block text-sm font-bold mb-2">Nicotine Amount:</label>
        <select v-model="localProduct.nicotineAmount" class="border p-2 w-full">
          <option v-for="amount in nicotineAmounts" :key="amount">{{ amount }}</option>
        </select>
      </div>
  
      <!-- Other product details here... -->
  
      <button @click="saveProduct" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  </template>
  
<script>
import { mapGetters } from 'vuex';
import VueSelect from 'vue-select';
import "vue-select/dist/vue-select.css";
  export default {
    components: {
      'v-select': VueSelect
    },
    props: {
      product: {
        type: Object,
        default: () => ({ 
          brand: '', 
          category: '', 
          bottleSize: '', 
          nicotineAmount: 0 
        }) 
      }
    },
    data() {
      return {
        localProduct: {...this.product},
        isBrandAvailable: false,
        categories: ["fruit and candy", "menthol", "tobacco", "breakfast", "creams and custards", "salt nic", "all"],
        bottleSizes: ["100ml", "150ml", "200ml"],
        nicotineAmounts: [0, 2, 4, 6],
      };
    },
    computed: {
      ...mapGetters({
        availableBrands: 'uniqueBrands'
      })
    },
    methods: {
      searchBrands() {
        this.isBrandAvailable = this.availableBrands.includes(this.localProduct.brand);
      },
      updateNicotineOptions() {
        if (this.localProduct.category === 'salt nic') {
          this.nicotineAmounts = [0, 20, 35, 50];
        } else {
          this.nicotineAmounts = [0, 2, 4, 6];
        }
      },
      saveProduct() {
        // Send the updated product details to backend or perform other necessary actions
      },
      addBrandFromInput() {
        const newBrand = this.$refs.brandSelect.search;
        if (newBrand) {
          this.localProduct.brand = newBrand;
          // Additional logic if you wish to add this new brand to a data store, send it to an API, etc.
        }
      },
    },
    watch: {
      product(newProduct) {
        this.localProduct = {...newProduct};
      }
    }
  };
</script>

<style scoped>
.add-brand-option {
  cursor: pointer; /* Indicate clickability */
  color: blue; /* Base clickable color */
  transition: color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
  padding: 4px 8px; /* Some spacing to make it more button-like */
  border-radius: 4px; /* Rounded corners */
}

.add-brand-option:hover {
  color: white; /* Text color change on hover */
  background-color: blue; /* Background color on hover */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
}
</style>