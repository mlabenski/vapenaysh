// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { pendingEdits } from './pendingEdits/index.js';
Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		pendingEdits,
	},
	state: {
		products: [],
		productfilters: {
			supplier: null,
			brand: null,
			category: null,
			channelStatus: null,
			tags: null,
			searchTerm: null,
			orderNumbers: null,
			searchQuery: '',
		},
		editProductID: null,
		availableCategories: [],
	},
	mutations: {
		SET_PRODUCTS(state, products) {
			state.products = products;
		},
		SET_CATEGORIES(state, categories) {
			state.availableCategories = categories;
		},
		SET_SEARCH_TERM(state, payload) {
			state.searchTerm = payload;
		},
		SET_FILTERS(state, filters) {
			console.log(filters);
			state.productfilters = { ...state.productfilters, ...filters };
		},
		SET_EDITABLE_PRODUCT_ID(state, payload) {
			console.log(payload);
			state.editProductID = payload;
		},
		PRODUCT_SAVE_SUCCESS(state, payload) {
			// Handle the successful save
			// This could mean updating the state with the new product
			// or just setting a flag that the save was successful.
			console.log(payload.product);
			state.saveStatus = 'SUCCESS';
			state.products.push(payload.product);
		},
		PRODUCT_SAVE_ERROR(state, error) {
			// Handle the error
			// Set an error state, and maybe log the error or display a message
			state.saveStatus = 'ERROR';
			state.saveError = error;
		},
	},
	actions: {
		loadProducts({ commit }) {
			axios
				.get('http://127.0.0.1:8080/v2/store/products', {
					params: {
						details: true,
					},
				})
				.then((response) => {
					const products = response.data.map((product) => {
						// Convert categories from a comma-separated string to an array
						if (product.categories) {
							product.categories = product.categories
								.split(',')
								.map((cat) => cat.trim())
								.sort();
						} else {
							product.categories = []; // Set to an empty array if there are no categories
						}

						return product;
					});
					commit('SET_PRODUCTS', products);
				})
				.catch((error) => {
					console.log(error);
					// Handle the error here, e.g., you might commit to a 'SET_ERROR' mutation.
				});
		},

		// Categories Get retrieval
		async fetchCategories({ commit }) {
			const url = 'http://localhost:8080/categories';

			try {
				const response = await axios.get(url);
				console.log('Response data:', response.data); // Check the raw response

				const categories = response.data
					.map((item) => {
						console.log('Item before flat:', item.categories); // Log the data before flat
						return item.categories;
					})
					.flat();

				console.log('Categories before commit:', categories); // Final log before commit
				commit('SET_CATEGORIES', categories);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		},

		updateSearchTerm({ commit }, searchTerm) {
			commit('SET_SEARCH_TERM', searchTerm);
		},
		updateEditableProductID({ commit }, id) {
			console.log('made it to the editable product ID');
			commit('SET_EDITABLE_PRODUCT_ID', id);
		},
		saveProduct({ commit }, { productData, store_ids }) {
			console.log(productData);
			// Convert categories array to a comma-separated string
			if (
				productData.categories &&
				Array.isArray(productData.categories)
			) {
				productData.categories = productData.categories.join(', ');
			}

			// Remove tags property from productData
			delete productData.tags;

			axios({
				method: 'post',
				url: 'http://localhost:8080/product/entry',
				data: {
					product: productData,
					store_ids: store_ids
				},
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => {
					// Commit to a mutation if necessary
					// Or directly handle the response
					commit('PRODUCT_SAVE_SUCCESS', { product: response.data });
					console.log('Product saved:', response.data);
				})
				.catch((error) => {
					// Commit to an error handling mutation or handle error
					commit('PRODUCT_SAVE_ERROR', error);
					console.error('Error saving product:', error);
				});
		},
	},
	getters: {
		allProducts: (state) => state.products,
		uniqueCategories: (state) => {
			// Flatten the categories arrays from all products
			const categories = state.products.flatMap(
				(product) => product.categories
			);

			// Use Set to find unique values
			return [...new Set(categories)];
		},

		categories: (state) => state.availableCategories,

		uniqueBrands: (state) => {
			const brands = state.products.map((product) => product.brand_name);
			return [...new Set(brands)];
		},
		uniqueBottleSizes: (state) => {
			const bottleSizes = state.products.map(
				(product) => product.bottle_size
			);
			return [...new Set(bottleSizes)];
		},
		uniqueNicotineAmount: (state) => {
			const nicotineAmount = state.products.map(
				(product) => product.nicotine_amount
			);
			return [...new Set(nicotineAmount)];
		},
		getEditableProduct: (state) => {
			console.log('inside the editable product');
			return state.products.find(
				(product) => product.product_id === state.editProductID
			);
		},
		filteredProducts: (state) => {
			return state.products.filter((product) => {
				let matches = true;

				// For each filter, check if product matches criteria
				if (
					state.productfilters.supplier &&
					product.supplier !== state.productfilters.supplier
				)
					matches = false;
				if (
					state.productfilters.brand &&
					!state.productfilters.brand.includes(product.brand_name)
				)
					matches = false;
				if (
					state.productfilters.category &&
					!state.productfilters.category.some((category) =>
						product.categories.includes(category)
					)
				) {
					matches = false;
				}
				if (
					state.productfilters.channelStatus &&
					product.channelStatus !== state.productfilters.channelStatus
				)
					matches = false;
				if (
					state.productfilters.tags &&
					!product.tags.includes(state.productfilters.tags)
				)
					matches = false;
				if (
					state.productfilters.searchTerm &&
					!product.name.includes(state.productfilters.searchTerm) &&
					!product.description.includes(
						state.productfilters.searchTerm
					)
				)
					matches = false;
				if (
					state.productfilters.orderNumbers &&
					product.orderNumbers !== state.productfilters.orderNumbers
				)
					matches = false;
				if (
					state.productfilters.searchQuery &&
					(!product.name ||
						!product.name.includes(
							state.productfilters.searchQuery
						)) &&
					(!product.description ||
						!product.description.includes(
							state.productfilters.searchQuery
						))
				) {
					matches = false;
				}
				if (
					state.productfilters.store &&
					(!product.stores ||
						!product.stores.includes(state.productfilters.store))
				) {
					matches = false;
				}
				return matches;
			});
		},
		errorGetter: () => {
			throw new Error('Error from getter');
		},
		//end of getters
	},
});
