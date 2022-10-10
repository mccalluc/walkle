import WalkleApp from "./WalkleApp.js";


export default {
  data() {
    return {
      hasConsented: localStorage.hasConsented,
    }
  },
  methods: {
    setHasConsented() {
      localStorage.setItem('hasConsented', true);
      this.hasConsented = true;
    },
  },
  components: {
    WalkleApp,
  },
  template: `
    <div>
      <div v-if="hasConsented">
        <WalkleApp />
      </div>
      <div v-else>
        Walkle is a location-based game, and it requires access to your device's GPS.
        It runs on the client-side, and your location is not sent to the server or stored.
        If you click "OK", your browser will prompt you to confirm.
        <button 
          @click="setHasConsented()"
          class="btn btn-sm btn-outline-dark px-1 py-0">
          OK
        </button>
      </div>
    </div>
  `
}
