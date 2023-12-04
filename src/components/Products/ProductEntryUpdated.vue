<template>
	<div class="">
		<div v-if="isDragging"
       class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg z-50"
       @dragover.prevent @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
			Drop the image anywhere to upload
		</div>
		<div v-if="imageDropped" class="text-center p-4">
			<p>Image successfully uploaded!</p>
			<img :src="droppedImageURL" alt="Dropped Image" class="max-w-xs mx-auto"/>
		</div>
		<div class="p-6 bg-white rounded shadow-md">
			<h1 class="text-2xl pb-2">Product Groups:</h1>
			<div class="grid grid-cols-3 gap-4 mb-6">
				<div class="relative w-3/4 transition duration-300 hover:scale-105">
					<div class="rounded-lg overflow-hidden shadow-lg">
						<img src="@/assets/glass-ware-category-md.png" alt="Glassware" class="w-full h-auto" />
						<div class="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center"  @click="showDynamicForm = true">
							<span class="text-white font-bold">Glassware</span>
						</div>
					</div>
				</div>
				<div class="relative w-3/4 transition duration-300 hover:scale-105">
					<div class="rounded-lg overflow-hidden shadow-lg">
						<img src="@/assets/ejuice-header-lg.png" alt="E-Juice" class="w-full h-auto" />
						<div class="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center" @click="showDynamicForm = false">
							<span class="text-white font-bold">E-Juice</span>
						</div>
					</div>
				</div>
				<div class="relative w-3/4 transition duration-300 hover:scale-105">
					<div class="rounded-lg overflow-hidden shadow-lg">
						<img src="@/assets/cbd-header-lg.png" alt="CBD" class="w-full h-auto" />
						<div class="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
							<span class="text-white font-bold">CBD</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if="!showDynamicForm">
			<div class="mb-6 flex justify-between items-center">
				<h1 class="text-2xl">New product</h1>
				<div>
					<button class="text-gray-500 mr-4" @click="removeState()">Cancel</button>
					<button @click="saveProduct" class="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
				</div>
			</div>
			<p class="mb-6 text-gray-500">Add, view and edit your products all in one place. <a href="#"
					class="text-blue-500 underline">Need help?</a></p>

			<div class="mb-4 flex">
				<!-- Name Field -->
				<div class="flex-1 mr-2">
					<label for="flavor" class="block text-sm font-bold mb-2">Flavor:</label>
					<input type="text" v-model="localProduct.flavor" class="border p-2 w-full">
				</div>

				<!-- Brand Field -->
				<div class="flex-1 ml-2">
					<label for="brand" class="block text-sm font-bold mb-2">Brand:</label>
					<v-select v-model="localProduct.brand_name" :options="availableBrands" class="w-full"
						placeholder="Search or select a brand..." ref="brandSelect">
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
				<textarea v-model="localProduct.description" rows="4" placeholder="Enter product description"
					class="border p-2 w-full"></textarea>
			</div>

			<div class="flex mb-4">
				<div class="flex-none" style="flex-basis: 10%;">
					<label for="price" class="block text-sm font-bold mb-2">Price</label>
					<input v-model="localProduct.price" id="price" type="number" placeholder=0 class="border p-2 w-full">
				</div>
				<div class="flex-none" style="flex-basis: 20%;">
					<label for="stores" class="block text-sm font-bold mb-2">Stores to Add</label>
					<!-- You can replace the input with a tag component -->
					<v-select v-model="stores" :options="availableStores" multiple class="w-full"></v-select>
				</div>
			</div>

			<!-- Toggle options -->
			<div class="flex mb-4">

				<!-- Point-of-Sale Option -->
				<div :class="regularNic ? 'bg-green-200' : ''"
					class="flex-1 mr-2 p-4 border rounded shadow-md bg-white cursor-pointer hover:bg-green-100"
					@click="toggleRegularOption">
					<div v-if="regularNic" class="mb-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20"
							fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd"
								d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
								clip-rule="evenodd" />
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
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20"
							fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd"
								d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
								clip-rule="evenodd" />
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
				<v-select v-model="localProduct.categories" :options="categories" multiple class="w-full"></v-select>
			</div>
			<div class="mb-4 flex">
				<!-- Name Field -->
				<div class="flex-1 mr-2">
					<label for="brand" class="block text-sm font-bold mb-2">Nicotine Amount:</label>
					<v-select v-model="localProduct.nicotine_amount" :options="availableNicotineAmount" class="w-full"
						placeholder="Search or select a bottle size..." ref="brandSelect">
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
					<v-select v-model="localProduct.bottle_size" :options="availableBottleSizes" class="w-full"
						placeholder="Search or select a nicotine amount..." ref="brandSelect">
						<template #no-options>
							<div @click="addBrandFromInput" class="add-brand-option">
								Add this brand
							</div>
						</template>
					</v-select>
				</div>
			</div>
		</div>
		<!-- Beginning of Dynamic Forms -->
		<ProductEntryDynamic v-if="showDynamicForm" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueSelect from 'vue-select';
import axios from 'axios';
import "vue-select/dist/vue-select.css";
import ProductEntryDynamic from './ProductEntryDynamic.vue';
export default {
	components: {
		'v-select': VueSelect,
		ProductEntryDynamic
	},
	props: {
		product: {
			type: Object,
			default: () => ({
				flavor: '',
				brand_name: '',
				description: '',
				categories: '',
				nicotine_amount: '',
				bottle_size: '',
				price: 0
			})
		}
	},
	data() {
		return {
			stores: [],
			localProduct: { ...this.product },
			isBrandAvailable: false,
			categories: ["fruit and candy", "menthol", "tobacco", "breakfast", "creams and custards", "salt nic", "all"],
			bottleSizes: ["100ml", "150ml", "200ml"],
			nicotineAmounts: [0, 2, 4, 6],
			flavor: '',
			saltNic: false,
			regularNic: false,
			isDragging: false,
			imageDropped: false,
			droppedImageURL: null,
			dragCounter : null,
			productImageURL: '',
			showDynamicForm: false,
		};
	},
	computed: {
		...mapGetters({
			availableBrands: 'uniqueBrands',
			availableBottleSizes: 'uniqueBottleSizes',
			availableNicotineAmount: 'uniqueNicotineAmount',
			availableStores: 'uniqueStoreIDs'
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
		saveProductWithImage() {
			const blob = this.productImageFile instanceof Blob
				? this.productImageFile
				: new Blob([this.productImageFile], { type: this.productImageFile.type });

			let formData = new FormData();
			if (
				this.localProduct.categories &&
				Array.isArray(this.localProduct.categories)
			) {
				this.localProduct.categories = this.localProduct.categories.join(', ');
			}
			formData.append('product_img', blob);
			formData.append('product', JSON.stringify(this.localProduct));
			formData.append('store_ids', JSON.stringify(this.stores));

			axios({
				method: 'post',
				url: 'http://localhost:8080/product/entry',
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				}).then(response => {
					// Commit a mutation or dispatch an action on success
					this.$store.commit('PRODUCT_SAVE_SUCCESS', { product: response.data });
				}).catch(error => {
					// Commit a mutation or dispatch an action on error
					this.$store.commit('PRODUCT_SAVE_ERROR', error);
				});
		},
		saveProduct() {
			console.log(this.localProduct);
			console.log(`store IDs ` + this.stores);
			this.saveProductWithImage();
			// this.$store.dispatch('saveProduct', {
			// 	productData: this.localProduct,
			// 	store_ids: this.stores,
			// 	product_img: this.productImageFile // Pass the file object instead of the URL
			// });
			this.localProduct = { ...this.product };
		},
		addBrandFromInput() {
			const newBrand = this.$refs.brandSelect.search;
			if (newBrand) {
				this.localProduct = { ...this.product };
				// Additional logic if you wish to add this new brand to a data store, send it to an API, etc.
			}
		},
		toggleSaltOption() {
			this.saltNic = !this.saltNic;
		},
		toggleRegularOption() {
			this.regularNic = !this.regularNic;
		},
		removeState() {
			this.$emit('cancelProductEntry')
		},
		// functionality to support image upload
		onDragEnter(event) {
			event.preventDefault();
			this.dragCounter++; // Increment the counter on each enter event
			this.isDragging = true;
		},
		onDragOver(event) {
			event.preventDefault(); // This is necessary to allow a drop
		},
		onDragLeave(event) {
			event.preventDefault();
			this.dragCounter--; // Decrement the counter on each leave event
			if (this.dragCounter === 0) {
				this.isDragging = false; // Only hide the overlay when all enters have corresponding leaves
			}
		},
		onDrop(event) {
			event.preventDefault();
			this.dragCounter = 0;
			this.isDragging = false;
			this.imageDropped = true; // Set the flag to true
			const file = event.dataTransfer.files[0];
			this.productImageFile = file;
			this.droppedImageURL = URL.createObjectURL(file); // Create a URL for the image
		},
		// eslint-disable-next-line no-unused-vars
		uploadFiles(files) {
			// Implement the upload logic here
		},
	},
	mounted() {
		window.addEventListener('dragenter', this.onDragEnter);
		window.addEventListener('dragover', this.onDragOver);
		window.addEventListener('dragleave', this.onDragLeave);
		window.addEventListener('drop', this.onDrop);
	},
	beforeDestroy() {
		window.removeEventListener('dragenter', this.onDragEnter);
		window.removeEventListener('dragover', this.onDragOver);
		window.removeEventListener('dragleave', this.onDragLeave);
		window.removeEventListener('drop', this.onDrop);
		if (this.droppedImageURL) {
			URL.revokeObjectURL(this.droppedImageURL);
		}
	},
	watch: {
		product: {
			immediate: true,
			handler(newProduct) {
				this.localProduct = { ...newProduct };
			}
		}
	},

};

</script>

<style scoped>
/* ... existing styles ... */

/* Additional styles based on the image */
textarea {
	resize: vertical;
	/* Allow vertical resizing */
}

.product-type-image {
	cursor: pointer;
	transition: transform 0.2s ease;
}

.product-type-image:hover {
	transform: scale(1.05);
}
</style>
