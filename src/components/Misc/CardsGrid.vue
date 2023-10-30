<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4 ml-2 mr-2">
      <!-- Iterate over the cards array, passing each card's data into a Card component -->
      <Card 
        v-for="(card, index) in cards" 
        :key="index"
        :title="card.title"
        :description="card.description"
        :learnMore="card.learnMore"
        :link="card.link"
        :image="card.image"
      ></Card>
    </div>
  </template>
  
  <script>
  // Import the Card component if it's a separate component
  import Card from './Card.vue';
  
  export default {
    name: 'CardsGrid',
    components: { Card },
    props: {
      cards: {
        type: Array,
        required: true,
      },
    },
  }
  </script>
  
  <style scoped>
  /* Any styling specific to the CardsGrid component. */
  </style>
  