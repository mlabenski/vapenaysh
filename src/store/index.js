// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
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
      searchQuery: ''
    },
    editProductID: null
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_SEARCH_TERM(state, payload) {
      state.searchTerm = payload;
    },
    SET_FILTERS(state, filters) {
      console.log(filters);
      state.productfilters = {...state.productfilters, ...filters};
    },
    SET_EDITABLE_PRODUCT_ID(state, payload) {
      console.log(payload);
      state.editProductID = payload
    }
  },
  actions: {
    loadProducts({ commit }) {
      axios
        .get('http://127.0.0.1:8080/store/products', {
          params: {
            storeID: 2,
            details: true,
          },
        })
        .then((response) => {
          commit('SET_PRODUCTS', response.data);
        })
        .catch((error) => {
          console.log(error);
          // Handle the error here, e.g., you might commit to a 'SET_ERROR' mutation.
        });
    },
    updateSearchTerm({ commit }, searchTerm) {
      commit('SET_SEARCH_TERM', searchTerm);
    },
    updateEditableProductID({ commit }, id) {
      console.log('made it to the editable product ID');
      commit('SET_EDITABLE_PRODUCT_ID', id)
    }
  },
  getters: {
    allProducts: (state) => state.products,
  uniqueCategories: (state) => {
    console.log(state.products);
    const categories = state.products.map(product => product.categories);
    return [...new Set(categories)];
  },
  uniqueBrands: (state) => {
    const brands = state.products.map(product => product.brand_name);
    return [...new Set(brands)];
  },
  uniqueBottleSizes: (state) => {
    const bottleSizes = state.products.map(product => product.bottle_size);
    return [...new Set(bottleSizes)];
  },
  uniqueNicotineAmount: (state) => {
    const nicotineAmount = state.products.map(product => product.nicotine_amount);
    return [...new Set(nicotineAmount)];
  },
  getEditableProduct: (state) => {
    console.log('inside the editable product')
    return state.products.find(product => product.product_id === state.editProductID);
  },
  filteredProducts: (state) => {
    return state.products.filter(product => {
      let matches = true;

      // For each filter, check if product matches criteria
      if (state.productfilters.supplier && product.supplier !== state.productfilters.supplier) matches = false;
      if (state.productfilters.brand && !state.productfilters.brand.includes(product.brand_name)) matches = false;
      if (state.productfilters.category && !state.productfilters.category.some(category => product.categories.includes(category))) {
        matches = false;
      }
      if (state.productfilters.channelStatus && product.channelStatus !== state.productfilters.channelStatus) matches = false;
      if (state.productfilters.tags && !product.tags.includes(state.productfilters.tags)) matches = false;
      if (state.productfilters.searchTerm && !product.name.includes(state.productfilters.searchTerm) && !product.description.includes(state.productfilters.searchTerm)) matches = false;
      if (state.productfilters.orderNumbers && product.orderNumbers !== state.productfilters.orderNumbers) matches = false;
      if (
        state.productfilters.searchQuery &&
        (!product.name || !product.name.includes(state.productfilters.searchQuery)) &&
        (!product.description || !product.description.includes(state.productfilters.searchQuery))
      ) {
        matches = false;
      }
      return matches;
    });
  },
}
});
