<template>
    <div class="p-6 bg-white rounded shadow-md">
      <h1 class="text-2xl mb-6">Edit Product Details</h1>
  
      <div class="mb-4">
        <label for="brand" class="block text-sm font-bold mb-2">Brand:</label>
        <input 
          v-model="localProduct.brand" 
          @input="searchBrands" 
          type="text" 
          class="border p-2 w-full" 
          placeholder="Search or create brand..."
        >
        <button v-if="!isBrandAvailable" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Create Brand</button>
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
  export default {
    props: {
        product: {
        type: Object, // assuming product is an object, adjust as needed
        required: true // or set it to false if it can be optional
        }
    },
    data() {
      return {
        localProduct: this.product,
        availableBrands: [], // populated from the backend
        isBrandAvailable: false,
        categories: ["fruit and candy", "menthol", "tobacco", "breakfast", "creams and custards", "salt nic", "all"],
        bottleSizes: ["100ml", "150ml", "200ml"],
        nicotineAmounts: [0, 2, 4, 6],
      };
    },
    methods: {
      searchBrands() {
        this.isBrandAvailable = this.availableBrands.includes(this.product.brand);
      },
      updateNicotineOptions() {
        if (this.product.category === 'salt nic') {
          this.nicotineAmounts = [0, 20, 35, 50];
        } else {
          this.nicotineAmounts = [0, 2, 4, 6];
        }
      },
      saveProduct() {
        // Send the updated product details to backend or perform other necessary actions
      }
    },
    watch: {
        product(newProduct) {
            this.localProduct = newProduct;
        }
    }
  };
  </script>
  
  <style scoped>
    /* TailwindCSS styles and any additional styles here */
  </style>
  