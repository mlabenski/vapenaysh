// dataLoaderService.js
import axios from 'axios';

class DataLoaderService {
  async fetchData(url) {
    try {
      this.isLoading = true;
      const response = await axios.get(url);
      return response.data; // return the data to be used in components
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}

export default new DataLoaderService();
