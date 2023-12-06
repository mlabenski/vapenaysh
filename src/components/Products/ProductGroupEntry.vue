<template>
	<div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
		<h2 class="text-2xl font-bold text-gray-800 mb-8">Create New Product Group</h2>

		<!-- Static fields with grouped elements and consistent layout -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="product-group-name">
					Product Group Name
				</label>
				<input id="product-group-name" type="text" v-model="productGroup.name"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required placeholder="Enter product group name">
			</div>

			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="product-group-price">
					Default Price
				</label>
				<input id="product-group-price" type="number" v-model="productGroup.price"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required placeholder="0.00">
			</div>

			<div class="md:col-span-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="eligible-stores">
					Eligible Stores
				</label>
				<v-select id="eligible-stores" multiple v-model="productGroup.eligibleStores" :options="storeIDs"
					class="w-full" placeholder="Select eligible stores" required></v-select>
			</div>
		</div>

		<!-- Dynamic fields with visual hierarchy -->
		<div class="space-y-6 mb-6">
			<div v-for="(field, index) in productGroup.fields" :key="index">
				<label class="block text-gray-800 text-lg font-semibold mb-1">{{ field.name }}</label>

				<!-- Consistent layout for text and number fields -->
				<input v-if="field.type === 'text'" type="text" v-model="field.name"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					:placeholder="`Enter ${field.name}`">

				<input v-if="field.type === 'image'" type="text" v-model="field.name"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					:placeholder="`Enter image column name: ${field.name}`">

				<input v-if="field.type === 'number'" type="number" v-model="field.name"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					:placeholder="`Enter ${field.name}`">

				<!-- Array type fields with visual hierarchy -->
				<div v-if="field.type === 'array'" class="space-y-2">
					<input type="text" v-model="field.name"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Field title (e.g., 'Size')">

					<div class="flex flex-wrap items-center gap-2">
						<input type="text" v-model="field.newOption"
							class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							placeholder="Enter option">
						<button type="button"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							@click="addOption(field)">
							Add Option
						</button>
					</div>
					<div class="flex flex-wrap gap-2 mt-2">
						<template v-for="(option, optionIndex) in field.options">
							<span :key="`option-${index}-${optionIndex}`"
								class="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
								{{ option }}
								<button type="button" @click="removeOption(field, optionIndex)"
									class="ml-2 bg-transparent text-gray-600 hover:text-gray-900 rounded-lg text-lg">
									&times;
								</button>
							</span>
						</template>
					</div>
				</div>
				<hr class="my-4"> <!-- Divider for visual separation -->
			</div>
		</div>

		<!-- Add field options with grouped buttons -->
		<div class="flex flex-wrap gap-4 mb-6">
			<!-- Buttons now have consistent style and layout -->
			<button @click="addField('text')"
				class="flex-grow bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
				Add Text Field
			</button>
			<button @click="addField('number')"
				class="flex-grow bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
				Add Number Field
			</button>
			<button @click="addField('array')"
				class="flex-grow bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
				Add Array of Options
			</button>
			<button @click="addField('image')"
				class="flex-grow bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
				Add Image Field
			</button>
		</div>

		<!-- Submit button with visual emphasis -->
		<div class="flex justify-end">
			<button @click="submitProductGroup"
				class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded text-lg focus:outline-none focus:shadow-outline">
				Create Product Group
			</button>
		</div>
	</div>
</template>


<script>
import VueSelect from 'vue-select';
import "vue-select/dist/vue-select.css";
export default {
	name: "ProductGroupEntry",
	components: { 'v-select': VueSelect },
	props: {
		storeIDs: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			storesOptions: [], // Populate this with the list of stores
			productGroup: {
				name: '',
				price: null,
				eligibleStores: [],
				fields: []
			}
		};
	},
	methods: {
		addField(type) {
			let newField = {
				type: type,
				name: '', // This will be the value for 'text' and 'number' types
				options: type === 'array' ? ['Small', 'Medium', 'Large'] : [],
				// `newOption` was not in the original structure, assuming it is for adding new options to 'array' type
				newOption: ''
			};

			// Set a default name based on the type
			switch (type) {
				case 'text':
					newField.name = ''; // Default text value
					break;
				case 'number':
					newField.name = 0; // Default number value
					break;
				case 'image':
					newField.name = ''
					break;
				case 'array':
					// Options are already set by default
					break;
				default:
					// Handle other types if necessary
					break;
			}

			this.productGroup.fields.push(newField);
		},
		addOption(field) {
			if (field.newOption.trim()) {
				field.options.push(field.newOption.trim());
				field.newOption = '';
			}
		},
		removeOption(field, optionIndex) {
			field.options.splice(optionIndex, 1);
		},

		submitProductGroupToServer(productData) {
			const url = 'http://localhost:8080/productgroups'; // Replace with your API endpoint
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productData),
			})
				.then(response => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json();
				})
				.then(data => {
					console.log('Success:', data);
					// Handle success - you can also emit an event or call another method
				})
				.catch(error => {
					console.error('Error:', error);
					// Handle error - show user feedback, etc.
				});
		},
		submitProductGroup() {
			//Could use the  cleanedData function to validate the input prior to sql
			//let cleanedData = this.prepareDataForSubmission();
			let preparedData = JSON.parse(JSON.stringify(this.productGroup));
			console.log(preparedData)
			this.submitProductGroupToServer(preparedData);
		},
		prepareDataForSubmission() {
			// Create a copy of the productGroup to avoid mutating the original data
			let preparedData = JSON.parse(JSON.stringify(this.productGroup));

			// Iterate over the fields and modify them as needed
			preparedData.fields.forEach(field => {
				// Remove the title for non-array fields
				if (field.type === 'array') {
					field.value = field.title;
				}
				delete field.title;
				delete field.newOption;

				// Remove null values
				for (let key in field) {
					if (field[key] === null) {
						delete field[key];
					}
				}
			});

			return preparedData;
		},
	},
};
</script>

<style scoped>
/* Tailwind utility classes are primarily used, but you can add custom styles if needed */
.input,
.multiselect,
.file {
	width: 100%;
}

.button {
	transition: background-color .3s ease;
}

.button:hover {
	opacity: 0.9;
}

/* Include any additional custom styles or overrides here */
</style>
