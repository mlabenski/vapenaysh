<template>
	<div v-if="formData" class="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
		<!-- Dynamic product group selection -->
		<div class="mb-6">
			<h1 class="text-2xl font-semibold mb-2">New product</h1>
			<p class="text-sm text-gray-500 mb-4">
				Add, view and edit your products all in one place.
				<a href="#" class="text-blue-500 hover:text-blue-600 underline">Need help?</a>
			</p>
		</div>

		<div class="dynamic-form grid gap-4 mb-4">
			<!-- Dynamically generated form fields -->
			<div v-for="field in formFields" :key="field.name" class="md:flex md:items-center md:justify-between">
				<label :for="field.name" class="block font-medium text-gray-700">{{ field.label || field.name }}</label>
				<div class="mt-1 md:mt-0 md:flex-1">
					<v-select v-if="field.isSelect" v-model="formData[field.name]" :options="field.options"
						class="w-full"></v-select>
					<input v-else-if="field.type === 'TEXT'" type="text" v-model="formData[field.name]"
						class="w-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md">
					<input v-else-if="field.type === 'INTEGER'" type="number" v-model="formData[field.name]"
						class="w-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md">
				</div>
			</div>
		</div>

		<div class="flex items-center justify-end mt-6">
			<button
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
				@click="cancel">
				Cancel
			</button>
			<button
				class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				@click="save">
				Save
			</button>
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
	data() {
		return {
			currentProductGroup: null,
			productGroups: {},
			formData: {},
			formFields: []
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
				this.currentProductGroup = Object.keys(this.productGroups)[1];
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
		cancel(){
			//not implemented yet
		},
		save() {
			//not implemented yet
		}
	},
	watch: {
		formData: {
			handler(newVal) {
				console.log("Form Data Changed:", newVal);
			},
			deep: true
		}
	}
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
}</style>
