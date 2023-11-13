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
				<button
					class="border border-white text-white px-4 py-1.5 rounded hover:bg-white hover:text-black transition duration-150">Sign
					In</button>
			</div>
		</header>

		<div class="flex">
			<NavBar @navigate="setActivePanel" @pendingUpdates="setPendingUpdatesView" ref="navbar"
				class="hidden md:block w-72 text-lg border-r border-gray-300 shadow-md h-[calc(100vh-70px)] overflow-auto relative" />
			<div v-if="showPendingUpdates" class="modal">
				<div class="modal-content">
					<span class="close" @click="closeModal">&times;</span>
					<PendingUpdates :pending-edits="changes" />
				</div>
			</div>
			<div class="flex-1 p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
				<ActivePanels
					v-if="activePanel && (activePanel.store === 'View All' || activePanel.panel === 'store') && !editableProduct"
					:panelData="activePanel" />
				<DefaultPanel v-if="!activePanel" :username="`123`" :isMobile="isMobile"></DefaultPanel>
				<ProductEntryUpdated v-if="(activePanel && activePanel.store === 'Create New') || editableProduct"
					:product="editableProduct" @cancelProductEntry="handleCancelProductEntry"></ProductEntryUpdated>
				<Notifications v-if="!activePanel" :notifications="notifications"
					@notification-removed="handleNotificationRemoval"></Notifications>
				<CardsGrid v-if="!activePanel" :cards="cards" />
			</div>
		</div>

	</div>
</template>


<script>
import NavBar from '@/components/NavBar.vue';

import ActivePanels from './components/Panels/Panels.vue'
import DefaultPanel from './components/Panels/DefaultPanel.vue'
//import ProductEntry from './components/Products/productEntry.vue'
import ProductEntryUpdated from './components/Products/ProductEntryUpdated.vue'
import Notifications from './components/Misc/Notifications.vue'
import CardsGrid from './components/Misc/CardsGrid.vue'
import PendingUpdates from './components/Products/Updates/PendingUpdates'
import { mapGetters, mapActions } from 'vuex';
export default {
	components: { NavBar, ActivePanels, DefaultPanel, Notifications, CardsGrid, ProductEntryUpdated, PendingUpdates },
	data() {
		return {
			isMobile: window.innerWidth <= 768,
			activePanel: null,
			activePanelStore: null,
			showPendingUpdates: false,
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
		handleCancelProductEntry() {
			console.log('emitted')
			this.updateEditableProductID(0);
		},
		getProductDetails(id) {
			if (id) {
				return this.fetchProductById(id);
			}
			return {};
		},
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
			this.activePanel = { 'panel': payload.panel, 'store': payload.store };
			//this.activePanel = panel;
		},
		setPendingUpdatesView() {
			console.log('we should be showing updates');
			console.log(this.showPendingUpdates)
			this.showPendingUpdates = !this.showPendingUpdates;
			//this.activePanel = panel;
		},
		closeModal() {
			this.showPendingUpdates = false;
		},
		...mapActions(['loadProducts', 'updateEditableProductID', 'fetchCategories']),
	},
	computed: {
		...mapGetters(['allProducts', 'getEditableProduct', 'categories', 'getChanges']),
		products() {
			return this.allProducts;
		},
		changes() {
			return this.getChanges;
		},
		editableProduct() {
			console.log(this.getEditableProduct);
			return this.getEditableProduct;
		}
	},
	mounted() {
		window.addEventListener('resize', this.handleResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize);
	},
	created() {
		this.fetchCategories();
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

.overlay {
	position: fixed;
	/* or absolute, depending on your needs */
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	/* semi-transparent background */
	display: flex;
	align-items: center;
	/* center the content vertically */
	justify-content: center;
	/* center the content horizontally */
	z-index: 1000;
	/* high z-index to ensure it sits above other content */
}

.panel-content {
	background-color: #ffffff;
	/* white background for the actual panel */
	padding: 20px;
	border-radius: 8px;
	max-width: 600px;
	/* or whatever maximum width you prefer */
	width: 100%;
	/* takes up full width, but will respect max-width */
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
	/* shadow for a lifted effect */
}
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 10px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
