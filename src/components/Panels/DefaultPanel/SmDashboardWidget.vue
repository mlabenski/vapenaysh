<template>
        <div class="flex flex-wrap justify-between items-center space-x-4">
            <!-- Mobile View -->
            <div class="flex wrap items-center">
                <font-awesome-icon :icon="['fas', 'carrot']" class="w-3 h-4 text-gray-700 mr-2"/>
                <h3 class="text-xl font-bold">235</h3>
            </div>
            <div class="flex flex-row items-center">
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="w-3 h-4 text-gray-700 mr-2"/>
                <h3 class="text-xl font-bold">120</h3>
            </div>
            <div class="flex flex-row items-center">
                <font-awesome-icon :icon="['fas', 'store']" class="w-3 h-4 text-gray-700 mr-2"/>
                <h3 class="text-xl font-bold">15</h3>
            </div>
        </div>
</template>

<script>
export default {
    name: 'SmDashboardWidget',
    props: {
      user: String
    },
    computed: {
        isMobile() {
            return window.innerWidth <= 768;  // or any breakpoint you prefer for mobile
        }
    }
}
</script>

<style scoped>
.box1 {


grid-column-start: 1;


grid-column-end: 4;


grid-row-start: 1;


grid-row-end: 2;


}

</style>