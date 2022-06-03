import {getDistance, getCompassDirection} from "../upstream.js";

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
    distance() {
      const distanceInMeters = getDistance(ll(this.hereLatLong), ll(this.destLatLong));
      return distanceInMeters;
    },
    direction() {
      const comassDirection = getCompassDirection(ll(this.hereLatLong), ll(this.destLatLong));
      return comassDirection;
    }
  },
  methods: {
    updateHere() {
      // TODO: clean up copy and paste.
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
      <table>
        <tr v-for="attempt in attempts">
          <td>{{attempt.distance}} {{attempt.direction}}</td>
        </tr>
      </table>
      <button @click="updateHere">Closer?</button>
    </div>
  `
}
