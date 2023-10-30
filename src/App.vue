<template>
  <div class="container-no-padding">
    <header class="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-black to-gray-800 shadow-md">
    <!-- Adjusted the logo and name styling -->
    <div class="flex items-center space-x-6">
        <img src="./assets/logo-curbside.png" alt="Curbside Logo" class="w-12 h-auto"> 
        <h1 class="text-white text-xl font-semibold tracking-wide">Larry Toking</h1>
    </div>
      
    <div class="flex items-center space-x-4">
        <p class="text-white hover:text-gray-400 transition duration-150 cursor-pointer">Help</p>
        <div class="filler-icon hover:text-gray-400 transition duration-150"></div>
        <button class="border border-white text-white px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-150">Sign In</button>
    </div>
</header>

    <div class="flex">
      <NavBar @navigate="setActivePanel" ref="navbar" class="hidden md:block w-72 text-lg border-r border-gray-300 shadow-md h-[calc(100vh-70px)] overflow-auto relative" />
      
      <div class="flex-1 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
        <div v-if="activePanel === 'store'" class="">
          <StoreSummary v-if="activePanel === 'store'" :store="activePanelStore" class="" />
         <!-- Product data table here -->
      </div>
      <div class="flex-1 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
        <div v-if="activePanel === 'products'" class="">
          <ProductsHome v-if="activePanel === 'products'" class="" />
          </div>
         <!-- Product data table here -->
      </div>
    <header v-if="!activePanel" class="flex h-86 justify-between items-center py-2 pb-4 px-4 bg-gradient-to-r from-gray-600 to-gray-400 shadow-md h-[calc(33vh-70px)]" >
      <div>
        <h1 class="text-white text-2xl font-bold">Welcome back, Cloud Jammer!</h1>
        <p class="text-white text-sm">Save your products, or click here for the live site</p>
      </div>
      <div class="bg-gradient-to-t from-gray-100 to-gray-50 p-1 border border-gray-300 shadow-lg rounded-lg">
        <DashboardWidget v-if="!isMobile" user="123"></DashboardWidget>
            <SmDashboardWidget v-else user="123" class="w-8"></SmDashboardWidget>
      </div>
    </header>
    <div class="flex flex-col space-y-2 mx-auto px-4 sm:px-6 lg:px-4 pt-2">
      <div v-for="notification in notifications" :key="notification.title" class="bg-blue-900 text-white p-3 rounded-lg sm:flex sm:space-x-4 relative">
        <h1 class="flex-none text-white mb-1 w-full sm:w-1/3">{{ notification.title }}</h1>
        <div class="flex-grow sm:flex sm:items-center sm:justify-end">
            <p v-if="notification.desc" class="mb-2 w-full sm:mr-4">{{ notification.desc }}</p>
            <a v-if="notification.route" :href="notification.route" class="inline-block text-white px-2 py-1 mr-6 rounded border border-grey">{{ notification.action }}</a>
        </div>
        
        <!-- Close button -->
        <button @click="hideNotification(notification)" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg hover:text-gray-400 z-50">X</button>
      </div>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4 ml-2 mr-2">
      <div v-for="card in cards" :key="card.title" class="p-6 border rounded-md hover:shadow-xl transition-transform transform hover:scale-105 bg-white">
        <div class="relative">
          <img :src="card.image" alt="Card Image" class="w-26 h-26 mb-4">
          <div class="absolute inset-0 bg-blue-100 opacity-75 rounded-md"></div>
        </div>
        <div class="relative z-10">
          <h2 class="text-xl mb-2 font-semibold">{{ card.title }}</h2>
          <p class="mb-4 text-gray-600 font-semibold">{{ card.description }}</p>
          <a :href="card.link" class="text-blue-500 font-semibold hover:underline">Learn More</a>
        </div>
      </div>
    </div>  
  </div>
</div>

  </div>
</template>


<script>
import NavBar from '@/components/NavBar.vue';
import DashboardWidget from './components/DashboardWidget.vue';
import SmDashboardWidget from './components/SmDashboardWidget.vue';

import StoreSummary from './components/storeID/StoreSummary.vue'
import { mapGetters, mapActions } from 'vuex';
import ProductsHome from './components/Products/ProductsHome.vue'
export default {
  components: {NavBar, DashboardWidget, SmDashboardWidget, StoreSummary, ProductsHome},
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      activePanel: null,
      activePanelStore: null,
      cards: [
    {
        title: 'Set up your outlets and registers',
        description: 'Accurately report on sales performance and manage your inventory.',
        learnMore: 'Learn more about outlets and registers',
        link: '#',
        image: require("./assets/set-up-users-v2.svg")
    },
    {
        title: 'Get started with selling',
        description: 'Jumpstart your sales process and begin transactions with ease.',
        learnMore: 'Learn more about getting started with selling',
        link: '#',
        image: require("./assets/set-up-get-selling-v3.svg")
    },
    {
        title: 'Organize your inventory',
        description: 'Keep track of your products and maintain optimal stock levels.',
        learnMore: 'Learn more about inventory management',
        link: '#',
        image: require("./assets/set-up-inventory-v8.svg")
    },
    {
        title: 'Expand with more outlets',
        description: 'Set up additional outlets to cater to a wider customer base.',
        learnMore: 'Learn more about setting up additional outlets',
        link: '#',
        image: require("./assets/set-up-outlets-v3.svg")
    }
],
notifications: [
        {
          title: 'You have 15 days left on your trial.',
          action: 'Activate your account now',
          route: '#', // Placeholder, replace with the actual route/link if you have one
        },
        {
          title: 'Hi Use Wrapper, let\'s get your store set up.',
          desc: 'Follow our lead to get the basics in order',
        }
      ]
    };
    
  },
  methods: {
    hideNotification(notification) {
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
    setActivePanel(payload) {
      console.log(payload)
      this.activePanel = payload.panel;
      this.activePanelStore = payload.store;
         //this.activePanel = panel;
    },
    ...mapActions(['loadProducts']),
  },
  computed: {
     ...mapGetters(['allProducts']),
     products() {
       return this.allProducts;
     },
   },
  mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    created() {
     this.loadProducts();
   },
  };
  
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@500&display=swap");
html,
  body {
    font-family: "Montserrat", sans-serif;
    background-color: lightgray;
  }
</style>
