<template>
	<div class="p-4 bg-gray-100">
		<div v-if="isLoading">
			<!-- Filters -->
			<div class="mb-4 grid grid-cols-3 gap-4">
				<!-- Left Filters -->
				<div>
					<!-- Supplier -->
					<v-select v-model="selectedStore" class="mb-2" :options="stores" label="name"
						placeholder="Select a store"></v-select>
					<!-- Purchase order number -->
					<input type="text" placeholder="Enter order numbers" class="p-2 border rounded w-full">
				</div>

				<!-- Middle Filters -->
				<div>
					<!-- Brand -->
					<v-select v-model="selectedBrands" class="mb-2" :options="uniqueBrands" multiple label="name"
						placeholder="Select a brand"></v-select>
					<!-- Product Category -->
					<v-select v-model="selectedCategory" :options="uniqueCategories" label="name" multiple
						placeholder="Select a category"></v-select>
				</div>

				<!-- Right Filters -->
				<div>
					<!-- Channel Status -->
					<v-select class="mb-2" :options="channelStatuses" multiple label="name"
						placeholder="Select a status"></v-select>
					<!-- Tags -->
					<input type="text" placeholder="Enter tags" class="p-2 border rounded w-full">
				</div>
			</div>

			<!-- Filter Actions -->
			<div class="flex justify-between items-center mb-4">
				<!-- Search Bar integrated here -->
				<input type="text" v-model="localSearchQuery" placeholder="Enter name, SKU, handle or supplier code"
					class="flex-1 p-2 border rounded mr-4">
				<div>
					<button class="text-blue-600 p-2 mr-4">Clear filters</button>
					<button class="bg-blue-600 text-white p-2 rounded" @click="applyFilters()">Search</button>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import { mapGetters } from 'vuex';
import VueSelect from 'vue-select';
import "vue-select/dist/vue-select.css";
export default {
	name: "ProductFilter",
	components: {
		'v-select': VueSelect
	},
	data() {
		return {
			suppliers: [],        // This is just a placeholder. Replace with your suppliers data.
			channelStatuses: [],   // This is just a placeholder. Replace with your channel status data.
			isLoading: true,
			localSearchQuery: '',
			selectedSupplier: null,
			selectedBrands: null,
			selectedCategory: null,
			selectedChannelStatus: null,
			enteredOrderNumber: null,
			enteredTags: null,
			stores: [
				{ name: "Lemoyne", id: 1 },
				{ name: "York", id: 2 },
				{ name: "Gettysburg", id: 3 },
				{ name: "Frederick", id: 4 }
			],
			selectedStore: null,
		}
	},
	methods: {
		searchProducts() {
			if (this.filterredProducts) {
				console.log(this.filteredProducts)
			}
			this.$store.commit('SET_FILTERS', { searchQuery: this.localSearchQuery });
		},
		applyFilters() {
			this.$store.commit('SET_FILTERS', {
				searchQuery: this.localSearchQuery,
				supplier: this.selectedSupplier,
				brand: this.selectedBrands,
				category: this.selectedCategory,
				channelStatus: this.selectedChannelStatus,
				orderNumber: this.enteredOrderNumber,
				tags: this.enteredTags,
				store: this.selectedStore ? this.selectedStore.id : null,
			});
		}
	},
	computed: {
		...mapGetters(['uniqueCategories', 'uniqueBrands', 'uniqueBottleSizes', 'filteredProducts'])
	},
	watch: {
		localSearchQuery(newQuery) {
			this.$store.commit('SET_FILTERS', { searchQuery: newQuery });
		},

	},
}
</script>

<style scoped>
/* Any additional styles specific to this component */
</style>
