<template>
	<div class="">
		<div v-if="isDragging"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg z-50"
			@dragover.prevent @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
			Drop the image anywhere to upload
		</div>
		<div v-if="imageDropped" class="text-center p-4">
			<p>Image successfully uploaded!</p>
			<img :src="droppedImageURL" alt="Dropped Image" class="max-w-xs mx-auto" />
		</div>
		<div v-if="formData" class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-3">New Product: {{ currentProductGroup }}</h1>
				<p class="text-gray-600">
					Add, view, and edit your products all in one place.
					<a href="#" class="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out">Need
						help?</a>
				</p>
			</div>

			<form @submit.prevent="invokeSave" class="space-y-6">
				<div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
					<div v-for="field in formFields" :key="field.name" class="sm:col-span-1">
						<label :for="field.name" class="block text-sm font-medium text-gray-700">{{ field.label ||
							field.name
						}}</label>
						<div class="mt-1">
							<v-select v-if="field.isSelect" v-model="formData[field.name]" :options="field.options"
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></v-select>
							<input v-else-if="field.type === 'TEXT'" type="text" v-model="formData[field.name]"
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
							<input v-else-if="field.type === 'REAL'" type="number" v-model="formData[field.name]"
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
						</div>
					</div>
				</div>

				<div class="flex justify-end space-x-3">
					<button type="button"
						class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						@click="cancel">
						Cancel
					</button>
					<button type="submit"
						class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Save
					</button>
				</div>
			</form>
		</div>
	</div>
</template>





<script>
import VueSelect from 'vue-select';
import axios from 'axios';
import "vue-select/dist/vue-select.css";

export default {
	components: {
		'v-select': VueSelect
	},
	props: {
		currentProductGroup: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			productGroups: {},
			formData: {},
			formFields: [],
			isDragging: false,
			imageDropped: false,
			droppedImageURL: null,
			dragCounter: null,
		};
	},
	created() {
		this.fetchProductGroupData();
	},
	methods: {
		async fetchProductGroupData() {
			try {
				const response = await axios.get('http://localhost:8080/productGroupFieldsHandler?store_id=1');
				this.productGroups = response.data;
				this.loadFormFields(this.currentProductGroup);
			} catch (error) {
				console.error("Error fetching product group data:", error);
			}
		},
		loadFormFields(productGroup) {
			if (this.productGroups[productGroup]) {
				this.formFields = this.productGroups[productGroup].map(field => ({
					...field,
					isSelect: Array.isArray(field.options) && field.options.length > 0
				}));
				this.formFields.forEach(field => {
					if (!Object.prototype.hasOwnProperty.call(this.formData, field.name)) {
						this.$set(this.formData, field.name, field.isSelect ? [] : (field.type === 'INTEGER' ? 0 : ''));
					}
				});
			}
		},
		async convertURLToBlob(imageURL) {
			try {
				const response = await fetch(imageURL);
				const blob = await response.blob();
				return blob;
			} catch (error) {
				console.error('Error in converting URL to Blob:', error);
				return null;
			}
		},
		cancel() {
			//not implemented yet
		},
		async invokeSave() {
			try {
				let formData = new FormData();

				// Create a clone of formData without the image
				let productData = { ...this.formData };
				delete productData.image; // Assuming 'image' is the key for the image in the original formData

				// Convert productData to a JSON string and append to formData
				formData.append('product', JSON.stringify(productData));

				// Append the image file under the key 'product_img', if it exists
				if (this.productImageFile) {
					formData.append('image', this.productImageFile);
				}

				console.log(`we are expecting to save this product under the table name ${this.currentProductGroup}`);

				// Make the POST request
				const response = await axios.post(`http://localhost:8080/product/dynamic/entry?table=${this.currentProductGroup}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});

				// Handle the response here
				console.log(response.data);
			} catch (error) {
				// Handle errors here
				console.error(error);
			}
		},
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
		saveProductWithImage() {
			let formData = new FormData();
			let blob = null;
			if (this.productImageFile) {
				blob = this.productImageFile instanceof Blob
					? this.productImageFile
					: new Blob([this.productImageFile], { type: this.productImageFile.type });
				if (blob) {
					formData.append('product_img', blob);
				}
			}
			if (
				this.localProduct.categories &&
				Array.isArray(this.localProduct.categories)
			) {
				this.localProduct.categories = this.localProduct.categories.join(', ');
			}
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
	},
	watch: {
		currentProductGroup(newVal) {
			this.loadFormFields(newVal);
		},
		formData: {
			handler(newVal) {
				console.log("Form Data Changed:", newVal);
			},
			deep: true
		}
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
