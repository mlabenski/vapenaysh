<!-- eslint-disable vue/multi-word-component-names -->
// Notifications.vue

<template>
  <div class="notifications-container flex flex-col space-y-2 mx-auto px-4 sm:px-6 lg:px-4 pt-2">
    <div 
    v-for="(notification, index) in internalNotifications" 
    :key="index" 
      class="notification-item bg-blue-900 text-white p-3 rounded-lg sm:flex sm:space-x-4 relative"
    >
      <h1 class="flex-none text-white mb-1 w-full sm:w-1/3">{{ notification.title }}</h1>
      <div class="flex-grow sm:flex sm:items-center sm:justify-end">
        <p v-if="notification.desc" class="mb-2 w-full sm:mr-4">{{ notification.desc }}</p>
        <a 
          v-if="notification.route" 
          :href="notification.route" 
          class="inline-block text-white px-2 py-1 mr-6 rounded border border-grey"
        >{{ notification.action }}</a>
      </div>
      <!-- Close button -->
      <button 
        @click="removeNotification(notification.id)" 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg hover:text-gray-400 z-50"
      >
        X
      </button>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Notifications',
  props: {
    notifications: {
      type: Array,
      default: () => [], // Default as empty array, meaning no notifications
    },
  },
  data() {
    return {
      // We're creating an internal copy to freely modify it without affecting the parent
      internalNotifications: [...this.notifications],
    };
  },
  methods: {
    removeNotification(notificationIndex) {
      this.internalNotifications = this.internalNotifications.filter(
        (notification) => notification.id !== notificationIndex
      );
      // You might want to emit an event to the parent to notify about the removal
      this.$emit('notification-removed', notificationIndex);
    },
  },
  watch: {
    // Watching the passed prop to reflect changes when the parent's state changes
    notifications(newNotifications) {
      this.internalNotifications = [...newNotifications];
    },
  },
};
</script>

<style scoped>
/* CSS for styling the notification items can be placed here */
</style>
