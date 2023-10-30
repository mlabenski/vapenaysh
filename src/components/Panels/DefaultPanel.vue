// DefaultHeader.vue

<template>
  <header v-if="!activePanel" class="flex h-86 justify-between items-center py-2 pb-4 px-4 bg-gradient-to-r from-gray-600 to-gray-400 shadow-md h-[calc(33vh-70px)]">
    <div>
      <h1 class="text-white text-2xl font-bold">Welcome back, {{ username }}!</h1>
      <p class="text-white text-sm">Save your products, or click here for the live site</p>
    </div>
    <div class="bg-gradient-to-t from-gray-100 to-gray-50 p-1 border border-gray-300 shadow-lg rounded-lg">
      <!-- The widgets receive the user prop for any user-specific data or controls -->
      <DashboardWidget v-if="!isMobile" :user="username"></DashboardWidget>
      <SmDashboardWidget v-else :user="username" class="w-8"></SmDashboardWidget>
    </div>
  </header>
</template>

<script>
// Import the child components used in this header
import DashboardWidget from './DefaultPanel/DashboardWidget.vue';
import SmDashboardWidget from './DefaultPanel/SmDashboardWidget.vue';

export default {
  name: 'DefaultPanel',

  // Register the child components
  components: {
    DashboardWidget,
    SmDashboardWidget
  },

  props: {
    user: {
      type: [String, Number], // or Object if it's a complex entity
      default: '' // or provide a meaningful default
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    activePanel: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      default: 'User'
    }
    // ... other props if needed
  },

  // Data, methods, computed properties, lifecycle hooks can go here
};
</script>

<style scoped>
/* Your CSS styles go here */
</style>
