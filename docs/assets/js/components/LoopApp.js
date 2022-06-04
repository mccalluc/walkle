import {getDistance, getCompassDirection} from "../upstream.js";
import {KM, MILE} from "../units.js";

import AerialView from "./AerialView.js";


function ll(latLong) {
  const [latitude, longitude] = latLong;
  return {latitude, longitude};
}

export default {
  data() {
    const params = Object.fromEntries(
      new URLSearchParams(location.hash.slice(1))
    );
    return {
      destLatLong: params.dest.split(','),
      unit: params.unit,
      radius: params.radius,
      hereLatLong: [undefined, undefined],
      attempts: [],
    }
  },
  computed: {
    coversionFactor() {
      return {
        [MILE]: 1/1609,
        [KM]: 1/1000
      }[this.unit]
    },
    distance() {
      const distanceInMeters = getDistance(ll(this.hereLatLong), ll(this.destLatLong));
      return (distanceInMeters * this.coversionFactor).toPrecision(2);
    },
    direction() {
      const comassDirection = getCompassDirection(ll(this.hereLatLong), ll(this.destLatLong));
      return comassDirection;
    }
  },
  methods: {
    updateHere() {
      function geolocationSuccess(position) {
        this.hereLatLong = [position.coords.latitude, position.coords.longitude];
        this.attempts.push({
          distance: this.distance,
          direction: this.direction
        })
      }
      function geolocationError() {
        alert('Geolocation failed!');
      }
      navigator.geolocation.getCurrentPosition(
        geolocationSuccess.bind(this),
        geolocationError
      );
    }
  },
  created() {
    this.updateHere();
  },
  components: {
    AerialView,
  },
  template: `
    <div>
      <AerialView
        :lat="destLatLong[0]"
        :long="destLatLong[1]"
      />
      <div>
        <button
          v-if="distance > radius"
          @click="updateHere"
          class="btn btn-outline-dark"
        >
          Closer?
        </button>
        <div v-else>You're there! Awesome!</div>
      </div>
      <table>
        <tr v-for="attempt in attempts">
          <td>{{attempt.distance}} {{unit}} {{attempt.direction}}</td>
        </tr>
      </table>
    </div>
  `
}
