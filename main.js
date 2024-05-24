const app = new Vue({
  el: '#app',
  data: {
    query: '',
    loading: false,
    error: '',
    results: []
  },
  methods: {
    async search() {
      if (this.query.trim() === '') {
        return;
      }
      
      this.loading = true;
      this.error = '';
      this.results = [];

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(this.query)}`);
        const data = await response.json();
        this.results = data;
      } catch (error) {
        console.error('There was a problem with your request:', error);
        this.error = 'Internal server error';
      } finally {
        this.loading = false;
      }
    }
  }
});
