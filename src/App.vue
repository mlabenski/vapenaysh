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
      
      <div class="flex-1 p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
        <ActivePanels v-if="activePanel" :panelData="activePanel" />
        <DefaultPanel v-if="!activePanel" :username="`123`" :isMobile="isMobile" ></DefaultPanel>
        <Notifications v-if="!activePanel" :notifications="notifications" @notification-removed="handleNotificationRemoval"></Notifications>
        <CardsGrid  v-if="!activePanel" :cards="cards"/>
  </div>
</div>

  </div>
</template>


<script>
import NavBar from '@/components/NavBar.vue';

import ActivePanels from './components/Panels/Panels.vue'
import DefaultPanel from './components/Panels/DefaultPanel.vue'

import Notifications from './components/Misc/Notifications.vue'
import CardsGrid from './components/Misc/CardsGrid.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {NavBar, ActivePanels, DefaultPanel, Notifications, CardsGrid},
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
    handleNotificationRemoval(notificationIndex) {
    // Removes the notification at the specified index
    this.notifications.splice(notificationIndex, 1);
  },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
    setActivePanel(payload) {
      console.log('clicked')
      console.log(payload)
      this.activePanel = {'panel': payload.panel, 'store': payload.store };
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Noto+Sans&display=swap');
html,
  body {
    font-family: "Montserrat", sans-serif;
    background-color: lightgray;
  }
</style>
