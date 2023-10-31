<template>
  <div class="p-6 bg-white rounded shadow-md">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl">New product</h1>
      <div>
        <button class="text-gray-500 mr-4">Cancel</button>
        <button @click="saveProduct" class="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
    <p class="mb-6 text-gray-500">Add, view and edit your products all in one place. <a href="#" class="text-blue-500 underline">Need help?</a></p>

    <div class="mb-4 flex">
      <!-- Name Field -->
      <div class="flex-1 mr-2">
        <label for="name" class="block text-sm font-bold mb-2">Name:</label>
        <input type="text" v-model="localProduct.name" class="border p-2 w-full">
      </div>
      
      <!-- Brand Field -->
      <div class="flex-1 ml-2">
        <label for="brand" class="block text-sm font-bold mb-2">Brand:</label>
        <v-select 
          v-model="localProduct.brand"
          :options="availableBrands"
          class="w-full"
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
    </div>
    <div class="mb-4">
      <label for="description" class="block text-sm font-bold mb-2">Description</label>
      <textarea v-model="localProduct.description" rows="4" placeholder="Enter product description" class="border p-2 w-full"></textarea>
    </div>

    <div class="mb-4">
      <label for="tags" class="block text-sm font-bold mb-2">Tags</label>
      <!-- You can replace the input with a tag component -->
      <input v-model="localProduct.tags" type="text" placeholder="Enter tags" class="border p-2 w-full">
    </div>
    <!-- Toggle options -->
    <!-- Toggle options -->
    <div class="flex mb-4">

      <!-- Point-of-Sale Option -->
      <div :class="regularNic ? 'bg-green-200' : ''"
           class="flex-1 mr-2 p-4 border rounded shadow-md bg-white cursor-pointer hover:bg-green-100"
           @click="toggleRegularOption">
        <div v-if="regularNic" class="mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <strong>Regular Nicotine</strong>
          <p>Make this product active and available for sale in-store</p>
        </div>
      </div>

      <!-- Online Option -->
      <div :class="saltNic ? 'bg-green-200' : ''"
           class="flex-1 ml-2 p-4 border rounded shadow-md bg-white cursor-pointer hover:bg-green-100"
           @click="toggleSaltOption">
        <div v-if="saltNic" class="mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <strong>Salt Nicotine</strong>
          <p>Make this product active and available for sale online</p>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <label for="tags" class="block text-sm font-bold mb-2">Product Categories</label>
      <!-- You can replace the input with a tag component -->
      <input v-model="localProduct.tags" type="text" placeholder="Enter tags" class="border p-2 w-full">
    </div>
    <div class="mb-4 flex">
      <!-- Name Field -->
      <div class="flex-1 mr-2">
        <label for="brand" class="block text-sm font-bold mb-2">Nicotine Amount:</label>
        <v-select 
          v-model="localProduct.brand"
          :options="availableNicotineAmount"
          class="w-full"
          placeholder="Search or select a bottle size..."
          ref="brandSelect"
        >
          <template #no-options>
            <div @click="addBrandFromInput" class="add-brand-option">
              Add this brand
            </div>
          </template>
        </v-select>
      </div>
      
      <!-- Brand Field -->
      <div class="flex-1 ml-2">
        <label for="brand" class="block text-sm font-bold mb-2">Bottle Size:</label>
        <v-select 
          v-model="localProduct.brand"
          :options="availableBottleSizes"
          class="w-full"
          placeholder="Search or select a nicotine amount..."
          ref="brandSelect"
        >
          <template #no-options>
            <div @click="addBrandFromInput" class="add-brand-option">
              Add this brand
            </div>
          </template>
        </v-select>
      </div>
    </div>


    <!-- Other product details here... -->
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
        name: '',
        brand: '',
        description: '',
        tags: ''
        // ... other product properties
      })
    }
  },
  data() {
    return {
      localProduct: { ...this.product },
      isBrandAvailable: false,
      categories: ["fruit and candy", "menthol", "tobacco", "breakfast", "creams and custards", "salt nic", "all"],
      bottleSizes: ["100ml", "150ml", "200ml"],
      nicotineAmounts: [0, 2, 4, 6],
      saltNic: false,
      regularNic: false
    };
  },
  computed: {
      ...mapGetters({
        availableBrands: 'uniqueBrands',
        availableBottleSizes: 'uniqueBottleSizes',
        availableNicotineAmount: 'uniqueNicotineAmount'
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
      toggleSaltOption() {
        this.saltNic = !this.saltNic;
      },
      toggleRegularOption() {
        this.regularNic = !this.regularNic;
      }
    },
    watch: {
      product(newProduct) {
        this.localProduct = {...newProduct};
      }
    }
};

</script>

<style scoped>
/* ... existing styles ... */

/* Additional styles based on the image */
textarea {
  resize: vertical; /* Allow vertical resizing */
}
</style>
