<template>
  <div class="p-4 bg-gray-200 rounded-lg h-3/5">
    <!-- Filter Component -->
    <BrandFilterHeader @filter-chosen="filterBrands" :brands="allBrands" />
    <ProductEntry :product="showProductID" v-if="showProduct"/>
    <div v-if="!summaryData.length" class="text-center mt-4">
      Loading...
    </div>

    <!-- Brands List -->
	<div class="resize-handle" @mousedown="initResize" ></div>
    <div ref="brandsList" v-if="summaryData.length" class="bg-gray-100 p-4 rounded-lg shadow-md mt-4 overflow-y-auto" :style="{ maxHeight: `${maxHeight}px` }">
      <h1 class="text-xl font-semibold mb-4 border-b pb-2">Top Brands</h1>
      <ul>
        <li v-for="(brand, index) in summaryData" :key="index" class="py-2 border-b hover:bg-gray-200 cursor-pointer z-99" @click="fetchProductsForBrand(brand.id)">
          <h2 class="text-lg font-bold">{{ brand.brand_name }}</h2>
          <p class="text-lg font-bold">Products: {{ brand.product_count }}</p>
        </li>
      </ul>
    </div>
	<div class="resize-handle" @mousedown="initResize" ></div>

    <!-- Products List -->
    <div v-if="productsData.length" ref="productsList"  class="mt-4 p-4 bg-white rounded-lg shadow-md overflow-y-auto products-list" :style="{ maxHeight: productsListMaxHeight }" >
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
import BrandFilterHeader from '../StoreID/BrandFilterHeader.vue';
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
    showProductID: {},
	startY: 0,
	startHeight: 0,
	maxHeight: 384,
	productsListMaxHeight: '680px',
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
    },
	initResize(event) {
    // Prevent default dragging behavior
    event.preventDefault();
    // Store the start Y position and the initial max-height of the element
    this.startY = event.clientY;
    // Since we are using maxHeight, ensure we get the right value even if it was not set before
    const style = document.defaultView.getComputedStyle(this.$refs.brandsList);
    this.startHeight = parseInt(style.maxHeight, 10) || parseInt(style.height, 10);

    // Attach the listeners to `mousemove` and `mouseup`
    document.documentElement.addEventListener('mousemove', this.doResize, false);
    document.documentElement.addEventListener('mouseup', this.stopResize, false);
  },
  doResize(event) {
    // Calculate the new max-height
    const newMaxHeight = this.startHeight + (event.clientY - this.startY);
    // Ensure that the newMaxHeight does not go below a certain minimum if desired
    this.maxHeight = Math.max(newMaxHeight, this.minHeight || 0);
    // Apply the new max-height to the element
    this.$refs.brandsList.style.maxHeight = `${this.maxHeight}px`;
  },
  stopResize() {
    // Remove the listeners when mouse is released
    document.documentElement.removeEventListener('mousemove', this.doResize, false);
    document.documentElement.removeEventListener('mouseup', this.stopResize, false);
  },
  calculateProductsListHeight() {
      // Use nextTick to wait for the DOM to update
      this.$nextTick(() => {
        const brandFilterHeight = this.$refs.brandFilterHeader.offsetHeight;
        const brandListHeight = this.$refs.brandsList.offsetHeight;
        const otherElementsHeight = brandFilterHeight + brandListHeight;

        const availableHeight = window.innerHeight - otherElementsHeight;

        // Set the max-height for the products list
        this.productsListMaxHeight = `${availableHeight}px`;
      });
    },
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
destroyed() {
  document.documentElement.removeEventListener('mousemove', this.doResize, false);
  document.documentElement.removeEventListener('mouseup', this.stopResize, false);
},
};
</script>

<style scoped>
.resize-handle {
  height: 5px;
  background: #ccc;
  cursor: ns-resize;
}
.products-list {
  overflow-y: auto;
  transition: max-height 0.2s ease;
}
</style>
