<template>
	<div v-if="!isMobile || showNavOnMobile" class="p-5 pl-2 resize-nav-bar">
		<div v-if="isLoading">
			Loading.
		</div>
		<div v-if="!isLoading">
			<template v-for="item in navbarItems">
				<div :key="item.name" @click="toggleItem(item.name)"
					class="mb-2.5 py-2.5 cursor-pointer flex w-full hover:bg-gray-100 hover:border-l-4 hover:border-gray-300">
					<font-awesome-icon :icon="['fas', expandedItems[item.name] ? 'minus' : 'plus']" class="mr-3.5" />
					<span>{{ item.label }}</span>

					<!-- Render sub-menu using 'myData' when 'store' is selected -->
					<div v-if="item.name === 'store' && expandedItems[item.name]" class="mt-5">
						<template v-for="subItem in myData">
							<div :key="subItem.storeID" @click="emitNavigation('store', subItem.storeID)"
								class="ml-7.5 mt-2.5 py-1.25 cursor-pointer hover:bg-gray-150 hover:border-l-4 hover:border-gray-700">
								{{ subItem.name_dba }}
							</div>
						</template>
					</div>

					<!-- Render hardcoded sub-menu for items other than 'store' -->
					<div v-else-if="expandedItems[item.name] && item.subItems.length" class="mt-5">
						<template v-for="subItem in item.subItems">
							<div :key="subItem" @click="emitNavigation(item.name, subItem)"
								class="ml-7.5 mt-2.5 py-1.25 cursor-pointer hover:bg-gray-150 hover:border-l-4 hover:border-gray-700">
								{{ subItem }}
							</div>
						</template>
					</div>
				</div>
			</template>

			<div class="resizable-handle" @mousedown="handleMouseDown"></div>
			<div class="absolute bottom-2 w-full flex items-center">
				<!-- Save Button (Green and 1/3 width) -->
				<button class="w-2/3 bg-green-500 text-white p-2 rounded hover:bg-green-600">Save</button>

				<!-- White space (1/3 width) -->
				<div class="w-1/4"></div>

				<button class="w-1/6 p-2 rounded relative" @click="emitPendingUpdates">
					<!-- Edit Icon (Default) -->
					<font-awesome-icon :icon="['fas', 'edit']"
						class="absolute top-0 left-0 w-full h-full text-gray-700 hover:hidden" />

					<!-- Hover Icon for Edit (Shown on hover) -->
					<font-awesome-icon :icon="['fas', 'edit']" bounce
						class="absolute top-0 left-0 w-full h-full text-gray-700 hidden hover:block" />
				</button>

				<button class="w-1/6 p-2 m-2 rounded relative">
					<!-- Trash Icon (Default) -->
					<font-awesome-icon :icon="['fas', 'trash']"
						class="absolute top-0 left-0 w-full h-full text-gray-700 hover:hidden" />

					<!-- Hover Icon for Trash (Shown on hover) -->
					<font-awesome-icon :icon="['fas', 'trash']" bounce
						class="absolute top-0 left-0 w-full h-full text-gray-700 hidden hover:block" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import DataLoaderService from '../dataLoaderService.js'
export default {
	data() {
		return {
			myData: null,
			isLoading: true,
			isResizing: false,
			isMobile: window.innerWidth <= 768,
			showNavOnMobile: false,
			navbarItems: [
				{ name: 'home', label: 'Home', subItems: [] },
				{ name: 'store', label: 'Store' },
				{ name: 'products', label: 'Products', subItems: ['Create New', 'View All', 'Search'] },
				{ name: 'settings', label: 'Settings', subItems: ['Add New Store', 'Account', 'Support'] },
				// Add more items as necessary
			],
			expandedItems: {
				home: false,
				store: false,
				products: false,
				settings: false,
				// Initialize other items as false as well
			},
		};
	},
	methods: {
		emitNavigation(menu, storeID) {
			this.$emit('navigate', { panel: menu, store: storeID });
		},
		emitPendingUpdates() {
			this.$emit('pendingUpdates')
		},
		toggleNav() {
			this.showNavOnMobile = !this.showNavOnMobile;
		},
		toggleItem(item) {
			this.expandedItems[item] = !this.expandedItems[item];
		},
		handleMouseDown(event) {
			this.isResizing = true;
			const initialWidth = this.$el.offsetWidth;
			const initialX = event.clientX;

			const handleMouseUp = () => {
				this.isResizing = false;
				if (this.$el.offsetWidth < 100) { // Collapses the navbar if its width is less than 100px.
					this.$el.style.width = '0px';
				}
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};

			const handleMouseMove = (e) => {
				if (!this.isResizing) return;
				const offset = initialX - e.clientX;
				this.$el.style.width = `${initialWidth - offset}px`;
			};

			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		},
	},
	async created() {
		try {
			this.myData = await DataLoaderService.fetchData('http://localhost:8080/user/stores?userID=1923011923');
		} catch (error) {
			console.error('Failed to fetch data', error);
		} finally {
			this.isLoading = false;
		}
	},
};
</script>
<style scoped>
/* The .navbar class doesn't appear in the given template, but here's its conversion */
.navbar {
	@apply w-80 text-lg border-r border-gray-300 shadow-md;
}

.navbar-icon {
	@apply text-xl p-2.5 cursor-pointer;
}

.mobile {
	/* Apply mobile-specific classes here */
}

.resize-nav-bar {
	resize: horizontal;
	position: relative;
	overflow: hidden;
	background-color: rgb(227, 234, 243);
}

.resizable-handle {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 5px;
	cursor: w-resize;
	z-index: 10;
}</style>
