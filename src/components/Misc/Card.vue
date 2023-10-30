<template>
    <div class="p-6 border rounded-md hover:shadow-xl transition-transform transform hover:scale-105 bg-white">
      <div class="relative">
        <img :src="image" alt="Card Image" class="w-26 h-26 mb-4">
        <div class="absolute inset-0 bg-blue-100 opacity-75 rounded-md"></div>
      </div>
      <div class="relative z-10">
        <h2 class="text-xl mb-2 font-semibold">{{ title }}</h2>
        <p class="mb-4 text-gray-600 font-semibold">{{ description }}</p>
        <a :href="link" class="text-blue-500 font-semibold hover:underline">{{ learnMore }}</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Card',
    props: {
      title: String,
      description: String,
      learnMore: String,
      link: String,
      image: String, // or Object if you are using require while passing in the prop
    },
  }
  </script>
  
  <style scoped>
  /* Styles specific to Card component */
  </style>
  