<template>
  <div class="p-4 bg-gray-200 rounded-lg h-3/5">
    <!-- Filter Component -->
    <BrandFilterHeader @filter-chosen="filterBrands" :brands="allBrands" />
    <ProductEntry :product="showProductID" v-if="showProduct"/>
    <div v-if="!summaryData.length" class="text-center mt-4">
      Loading...
    </div>
    
    <!-- Brands List -->
    <div v-if="summaryData.length && productsData.length == 0" class="bg-gray-100 p-4 rounded-lg shadow-md mt-4 max-h-96 overflow-y-auto">
      <h1 class="text-xl font-semibold mb-4 border-b pb-2">Top Brands</h1>
      <ul>
        <li v-for="(brand, index) in summaryData" :key="index" class="py-2 border-b hover:bg-gray-200 cursor-pointer z-99" @click="fetchProductsForBrand(brand.id)">
          <h2 class="text-lg font-bold">{{ brand.brand_name }}</h2>
          <p class="text-lg font-bold">Products: {{ brand.product_count }}</p>
        </li>
      </ul>
    </div>
    
    <!-- Products List -->
    <div v-if="productsData.length" class="mt-4 p-4 bg-white rounded-lg shadow-md max-h-96 overflow-y-auto">
      <button @click="productsData = []" class="bg-blue-500 text-white px-3 py-1 mb-3 rounded hover:bg-blue-600">← Back to Brands</button>
      <h1 class="text-xl font-semibold mb-4 border-b pb-2">Products of {{ currentBrand }}</h1>
      <ul>
        <li v-for="product in productsData" :key="product.product_id" class="py-2 border-b" @click="openProduct(product)">
          <h2 class="text-lg font-bold">{{ product.description }}</h2>
          <p>Price: ${{ product.price }}</p>
          <p>Nicotine Amount: {{ product.nicotine_amount }}</p>
          <p>Bottle Size: {{ product.bottle_size }}</p>
          <p>Flavor: {{ product.flavor }}</p>
          <p>Category: {{ product.categories }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import BrandFilterHeader from './BrandFilterHeader.vue';
import ProductEntry from '../Products/productEntry.vue';
export default {
components: {BrandFilterHeader, ProductEntry},
props: [
  'store'
],
data() {
  return {
    allBrands: [],
    summaryData: [], // Set this as an empty array to start
    productsData: [],
    currentBrand: '',
    showProduct: false,
    showProductID: {}
  }
},
methods: {
  filterBrands(range) {
    const [start, end] = range;
    this.summaryData = this.allBrands.filter(
      brand => brand.brand_name[0].toUpperCase() >= start && brand.brand_name[0].toUpperCase() <= end
    )
  },
  async fetchProductsForBrand(brandId) {
    const brand = this.summaryData.find(brand => brand.id === brandId);
    this.currentBrand = brand.brand_name; 
    const url = `http://localhost:8080/store/products?storeID=${this.store}&brandID=${brandId}&details=true`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.productsData = await response.json();
        console.log(this.productsData);
    } catch (error) {
        console.error(error); 
      }
    },
    openProduct(id) {
      console.log(id);
      this.showProduct = true;
      this.showProductID = id;
    }
},
async created() {
  try {
    const url = `http://localhost:8080/store/homeSummary?storeid=${this.store}`; // Your API endpoint
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    this.allBrands = await response.json();
    this.summaryData = [...this.allBrands]; // Copy all brands to summaryData on initial load
  } catch (error) {
    console.error(error); // Handle the error as you see fit
  }
},
};
</script>

<style scoped>
/* Add your CSS styling here */
</style>
