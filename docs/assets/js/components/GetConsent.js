import WalkleApp from "./WalkleApp.js";


export default {
  data() {
    return {
      hasConsented: localStorage.hasConsented,
    }
  },
  computed: {
    conversionFactor() {
      return {
        [MILE]: 1/1609,
        [KM]: 1/1000
      }[this.unit]
    },
    distanceInMeters() {
      try {
        return geolib.getDistance(ll(this.hereLatLong), ll(this.goalLatLong)) - this.radiusInMeters;
      } catch {
        return undefined;
      }
    },
    radiusInMeters() {
      return this.radius / this.conversionFactor;
    },
    compassDirection() {
      try {
        return geolib.getCompassDirection(ll(this.hereLatLong), ll(this.goalLatLong));
      } catch {
        return undefined;
      }
    },
  },
  methods: {
    async updateHere(addToAttempts = true) {
      this.hereLatLong = await getLatLong();
      const attemptsCount = this.attempts.length;
      const distanceDirection = `${
        (this.distanceInMeters * this.conversionFactor).toPrecision(2)
      } ${this.unit} ${this.compassDirection}`;

      if (!addToAttempts) {
        this.attempts[0] = {
          message: `Walk ${distanceDirection}`,
          distanceInMeters: this.distanceInMeters,
        };
      } else {
        if (this.radiusInMeters > this.distanceInMeters) {
          this.isGoalReached = true;
          this.attempts.unshift({
            isGoalReached: true,
            count: attemptsCount,
          });
        } else {
          let temperature = '';
          const hasMoved = !this.attempts[0].message.includes(distanceDirection);
          if (hasMoved) {
            temperature = this.distanceInMeters < this.attempts[0].distanceInMeters
              ? '🔥 warmer'
              : '🧊 cooler';
          }
          this.attempts.unshift({
            message: `${hasMoved ? 'Now go' : 'Still'} ${distanceDirection}`,
            count: attemptsCount,
            distanceInMeters: this.distanceInMeters,
            temperature
          });
        }
      }

      localStorage.setItem('attempts', JSON.stringify(this.attempts))
    },
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
          class="btn btn-sm btn-outline-dark">
          OK
        </button>
      </div>
    </div>
  `
}
