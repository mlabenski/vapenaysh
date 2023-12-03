<template>
	<div>
		<!-- Dynamic product group selection -->
		<div class="product-group-selector">
			<button v-for="(fields, groupName) in productGroups" :key="groupName" @click="currentProductGroup = groupName">
				{{ groupName }}
			</button>
		</div>

		<div class="dynamic-form">
			<div v-for="field in formFields" :key="field.name">
				<label :for="field.name">{{ field.name }}</label>
				<v-select v-if="field.isSelect" v-model="formData[field.name]"
                          :options="field.options"
                          multiple class="w-full">
                </v-select>
				<input v-else-if="field.type === 'TEXT'" type="text" v-model="formData[field.name]">
				<input v-else-if="field.type === 'INTEGER'" type="number" v-model="formData[field.name]">
			</div>
			<!-- Add your submit button and other logic -->
		</div>
	</div>
</template>


<script>
import { mapGetters } from 'vuex';
import VueSelect from 'vue-select';
import axios from 'axios';
import "vue-select/dist/vue-select.css";

export default {
	components: {
		'v-select': VueSelect
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
			dragCounter: null,
			productImageURL: '',
			currentProductGroup: null,
			productGroups: {},
			formData: {},
		};
	},
	created() {
		this.fetchProductGroupData();
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
		async fetchProductGroupData() {
			try {
				const response = await axios.get('http://localhost:8080/productGroupFieldsHandler?store_id=1');
				this.productGroups = response.data;
				this.currentProductGroup = Object.keys(this.productGroups)[0];
				this.loadFormFields(this.currentProductGroup);
			} catch (error) {
				console.error("Error fetching product group data:", error);
				// Handle the error appropriately
			}
		},
		loadFormFields(productGroup) {
			if (this.productGroups[productGroup]) {
				this.formFields = this.productGroups[productGroup].map(field => ({
					...field,
					isSelect: Array.isArray(field.options) && field.options.length > 0
				}));
				this.initializeFormData();
			}
		},
		initializeFormData() {
			this.formData = {};
			this.formFields.forEach(field => {
				this.formData[field.name] = field.isSelect ? [] : (field.type === 'INTEGER' ? 0 : '');
			});
		},
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
