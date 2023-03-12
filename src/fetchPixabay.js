import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34170895-3b717d95f13cef959b3654060';

export class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchPixabay() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}`;
    try {
      return await axios.get(url).then(response => response.data);
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
