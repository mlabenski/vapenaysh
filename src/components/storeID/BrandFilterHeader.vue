<template>
    <div>
      <!-- Alphabet Filter -->
      <div class="flex justify-between mb-4">
        <button 
          v-for="(range, index) in alphabetRanges" 
          :key="index" 
          @click="emitFilterChoice(range)" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {{ range.join(' - ') }}
        </button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'BrandFilterHeader',
  props: {
    brands: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      alphabetRanges: [],
    };
  },
  created() {
    this.initializeAlphabetRanges();
  },
  methods: {
    initializeAlphabetRanges() {
      let alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      for (let i = 0; i < alphabets.length; i += 6) {
        let rangeEnd = i + 5;
        if (rangeEnd > alphabets.length - 1) rangeEnd = alphabets.length - 1;
        this.alphabetRanges.push([alphabets[i], alphabets[rangeEnd]]);
      }
    },
    emitFilterChoice(range) {
      this.$emit('filter-chosen', range);
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
