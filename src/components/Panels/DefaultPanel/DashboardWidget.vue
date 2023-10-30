<template>
  <div class="mt-1 mx-auto w-full md:w-2/3 lg:w-1/2 xl:w-2/5 hello">
      <div class="p-3 rounded-lg shadow-md bg-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Statistic 1 -->
              <div class="flex flex-col items-center text-center">
                  <font-awesome-icon :icon="['fas', 'carrot']" class="w-8 h-6 text-gray-700 mb-2"/>
                  <h3 class="text-xl font-bold">235</h3>
                  <p class="text-gray-900">Orders</p>
              </div>
              <!-- Statistic 2 -->
              <div class="flex flex-col items-center text-center">
                  <font-awesome-icon :icon="['fas', 'paper-plane']" class="w-8 h-6 text-gray-700 mb-2"/>
                  <h3 class="text-xl font-bold">120</h3>
                  <p class="text-gray-900">Products</p>
              </div>
              <!-- Statistic 3 -->
              <div class="flex flex-col items-center text-center">
                  <font-awesome-icon :icon="['fas', 'store']" class="w-8 h-6 text-gray-700 mb-2"/>
                  <h3 class="text-xl font-bold">15</h3>
                  <p class="text-gray-900">Stores</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardWidget',
  props: {
    user: String
  }
}
</script>

<style scoped>
.hello {
  width: 16em;
  background-color: grey;
}
h3 {
  margin: 10px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
