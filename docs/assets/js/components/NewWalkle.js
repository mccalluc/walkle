export default {
  methods: {
    restart() {
      localStorage.removeItem('attempts');
      localStorage.removeItem('goalLatLong');
      document.location.reload();
    }
  },
  template: `
    <button 
      @click="restart()"
      class="btn btn-sm btn-outline-dark px-1 py-0">
      New Walkle!
    </button>
  `
}
