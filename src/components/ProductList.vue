<template>
   <div>
     <h1>Product List</h1>
     <vue-good-table
       :columns="columns"
       :rows="products"
       :paginate="true"
       :lineNumbers="true"
       styleClass="vgt-table striped condensed"
     >
     </vue-good-table>
   </div>
 </template>
 
 <script>
 import { mapGetters, mapActions } from 'vuex';
 import { VueGoodTable } from 'vue-good-table';
 
 // import the styles 
 import 'vue-good-table/dist/vue-good-table.css'
 
 export default {
   name: 'ProductList',
   components: {
     VueGoodTable,
   },
   data() {
     return {
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
         },
       ],
     };
   },
   computed: {
     ...mapGetters(['allProducts']),
     products() {
       return this.allProducts;
     },
   },
   methods: {
     ...mapActions(['loadProducts']),
   },
   created() {
     this.loadProducts();
   },
 };
 </script>
 