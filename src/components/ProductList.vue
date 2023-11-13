<template>
	<div>
		<h1>Product List</h1>
		<vue-good-table :columns="columns" :rows="products" :paginate="true" :lineNumbers="true"
			styleClass="vgt-table striped condensed" @row-click="onRowClick">
			<template slot="table-row" slot-scope="props">
				<span v-if="!isRowEditable(props.row.id)">
					{{ props.row[props.column.field] }}
				</span>
				<multiselect v-else-if="props.column.field === 'categories'" v-model="props.row[props.column.field]"
					:options="allCategories" :multiple="true" tag-placeholder="Add this as new category"
					placeholder="Search or add a category" label="name" track-by="name"
					@input="updateCategories(props.row)"></multiselect>
			</template>
		</vue-good-table>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { VueGoodTable } from 'vue-good-table';
import Multiselect from 'vue-multiselect';

// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
	name: 'ProductList',
	components: {
		VueGoodTable,
		Multiselect,
	},
	data() {
		return {
			selectedCategory: null,
			columns: [
				{
					label: 'Brand Name',
					field: 'brand_name',
				},
				{
					label: 'Price',
					field: 'price',
				},
				{
					label: 'Nicotine Amount',
					field: 'nicotine_amount',
				},
				{
					label: 'Bottle Size',
					field: 'bottle_size',
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
			],
		};
	},
	computed: {
		...mapGetters(['allProducts', 'allCategories']),
		products() {
			return this.allProducts.map(product => ({
				...product,
				categories: this.allCategories.filter(category =>
					product.categories.includes(category)
				),
			}));
		},
	},
	methods: {
		...mapActions(['loadProducts']),
		//removing column and event parameter
		onRowClick(row) {
			// Toggle edit mode for the clicked row
			if (this.editingRowId === row.id) {
				// If the clicked row is already in edit mode, exit edit mode
				this.editingRowId = null;
			} else {
				// Enter edit mode for the clicked row
				this.editingRowId = row.id;
			}
		},
		isRowEditable(rowId) {
			// Check if the row is currently being edited
			return this.editingRowId === rowId;
		},
		updateCategories(row) {
			// Handle updating categories for the row, potentially with a Vuex action
			this.updateProductCategories({ productId: row.id, categories: row.categories });
		},
	},
	created() {
		this.loadProducts();
	},
};
</script>
