<template>
	<div class="bg-gray-100 h-[calc(100vh-90px)] overflow-auto relative">
		<!-- Main Content -->
		<div class="w-full float-right p-4 bg-white rounded">
			<!-- Product Filter -->
			<ProductFilter />

			<!-- Product Table -->
			<vue-good-table ref="myTable" :columns="columns" :rows="displayedProducts" :paginate="true"
				styleClass="vgt-table striped condensed" @on-row-click="onRowClick" @on-cell-click="onCellClick"
				:pagination-options="{
					enabled: true,
					mode: 'records',
					perPage: 20,
					position: 'top',
					perPageDropdown: [3, 7, 9],
					dropdownAllowAll: false,
					setCurrentPage: 1,
					jumpFirstOrLast: true,
					firstLabel: 'First Page',
					lastLabel: 'Last Page',
					nextLabel: 'next',
					prevLabel: 'prev',
					rowsPerPageLabel: 'Rows per page',
					ofLabel: 'of',
					pageLabel: 'page', // for 'pages' mode
				}">
				<template v-slot:table-row="{ row, column }">
					<span v-if="!isRowEditable(row)">
						{{ row[column.field] }}
					</span>
					<multiselect v-else-if="column.field === 'stores' && storeEdit" style="color: black" v-model="row.stores"
						:options="allStores" :multiple="true" :close-on-select="false" placeholder="Select stores"
						@input="onPropertyEdit(row, 'stores')" />
					<multiselect style="color: black" v-else-if="column.field === 'categories' && categoryEdit"
						v-model="row.categories" :options="allCategories" :multiple="true" :close-on-select="false"
						placeholder="Pick some" @input="onPropertyEdit(row, 'categories')">
					</multiselect>
					<input v-else-if="isRowEditable(row) && column.field !== 'categories'" v-model="row[column.field]"
						@input="onPropertyEdit(row, column.field)" type="text" class="table-input" />
				</template>
			</vue-good-table>
		</div>
	</div>
</template>


<script>
import { VueGoodTable } from 'vue-good-table';
import { mapGetters, mapActions } from 'vuex';
import Multiselect from 'vue-multiselect'

import "vue-good-table/dist/vue-good-table.css";
import ProductFilter from './ProductFilter.vue'

export default {
	name: 'ProductsHome',
	components: {
		VueGoodTable,
		ProductFilter,
		Multiselect
	},
	data() {
		return {
			searchTerm: '',
			selectedRows: [],
			editingRowId: null,
			categoryEdit: [],
			columns: [
				{
					label: 'Brand Name',
					field: 'brand_name',
				},
				{
					label: 'Price',
					field: 'price',
					width: '25px'
				},
				{
					label: 'Nicotine Amount',
					field: 'nicotine_amount',
					width: '25px'
				},
				{
					label: 'Bottle Size',
					field: 'bottle_size',
					width: '25px'
				},
				{
					label: 'Description',
					field: 'description',
					sortable: false,
				},
				{
					label: 'Flavor',
					field: 'flavor',
				},
				{
					label: 'Categories',
					field: 'categories',
					editable: true,
				},
				{ label: 'Stores', field: 'stores', width: '150px' },
			],
			allStores: [1, 2, 3, 4]
		};
	},
	created() {
	},
	methods: {
		updateFilteredProducts(newFilteredProducts) {
			this.filteredProducts = newFilteredProducts;
		},
		...mapActions({
			loadProducts: 'loadProducts',
			updateEditableProductID: 'updateEditableProductID',
			setUnsavedChange: 'setChange',
			saveAllUnsavedChanges: 'pendingEdits/saveAllChanges'
		}),
		editProduct() {
			if (this.selectedRows.length) {
				const productToEdit = this.selectedRows[0]; // if you're only allowing single selection
				this.updateEditableProductID(productToEdit.product_id);
			}
		},
		selectionChanged(params) {
			this.selectedRows = params.selectedRows;
		},
		onRowClick(params) {
			console.log(params);
			const { row } = params;
			console.log('Row clicked:', row);

			// If you want to initiate editing when any cell in a row is clicked:
			this.categoryEdit = [...row.categories];
			this.storeEdit = [...row.stores]
			console.log('category edit');
			console.log(this.categoryEdit);
			this.editingRowId = row.product_id; // Assuming 'id' is your unique identifier for the row
		},
		onCellClick(params) {
			const { row, column } = params;
			console.log(params);
			console.log('Cell clicked:', row, column);

			// If you want to initiate editing when a category cell is clicked:
			if (column.field === 'categories') {
				this.editingRowIndex = params.rowIndex; // Assuming 'id' is your unique identifier for the row
			}
		},
		isRowEditable(row) {
			//so we could use row.product_id to determine which row is in use?
			return this.editingRowId === row.product_id;
		},

		onPropertyEdit(row, propertyName) {
			console.log(row);
			let propertyChanges = {};
			propertyChanges[propertyName] = row[propertyName];
			console.log(propertyChanges);
			this.setUnsavedChange({
				productId: row.product_id,
				propertyChanges
			});
		},
		handleClickOutside(event) {
			const table = this.$refs.myTable;
			if (table && !table.$el.contains(event.target)) {
				this.editingRowId = null;
			}
		}
	},
	computed: {
		...mapGetters(['allProducts', 'categories', 'filteredProducts']),
		products() {
			return this.allProducts;
		},
		allCategories() {
			return this.categories;
		},
		displayedProducts() {
			// Check for the existence of filteredProducts before accessing length
			return this.filteredProducts && this.filteredProducts.length ? this.filteredProducts : this.allProducts;
		},
	},
	mounted() {
		// Add global click event listener
		document.addEventListener('click', this.handleClickOutside);
	},

	beforeDestroy() {
		// Remove the event listener when the component is destroyed
		document.removeEventListener('click', this.handleClickOutside);
	},
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
/* Add any additional styles if needed */
</style>
