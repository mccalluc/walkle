import {getDistance, getCompassDirection} from "../upstream.js";
import {KM, MILE} from "../units.js";
import getLatLong from "../getLatLong.js";

import AerialView from "./AerialView.js";


function ll(latLong) {
  const [latitude, longitude] = latLong;
  return {latitude, longitude};
}

const grid = 5 / 60; // ie, 5 minutes of a degree

export default {
  data() {
    const params = Object.fromEntries(
      new URLSearchParams(location.hash.slice(1))
    );
    return {
      goalLatLong: params.goal.split(',').map(l => Number(l)),
      unit: params.unit,
      radius: Number(params.radius),
      hereLatLong: [undefined, undefined],
      attempts: [],
      grid,
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
      const distanceInMeters = getDistance(ll(this.hereLatLong), ll(this.goalLatLong));
      return (distanceInMeters * this.coversionFactor).toPrecision(2);
    },
    direction() {
      const compassDirection = getCompassDirection(ll(this.hereLatLong), ll(this.goalLatLong));
      return compassDirection;
    }
  },
  methods: {
    async updateHere() {
      this.hereLatLong = await getLatLong();
      this.attempts.push({
        distance: this.distance,
        direction: this.direction
      });
    },
    move(dLat, dLong) {
      function callback() {
        const [lat, long] = this.goalLatLong;
        this.goalLatLong = [lat + dLat, long + dLong];
        this.updateHere();
      }
      return callback.bind(this);
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
      <div>
        Pick a goal farther:
        <button @click="move(grid,0)()" class="btn btn-sm btn-outline-dark px-1 py-0">North</button> /
        <button @click="move(-grid,0)()" class="btn btn-sm btn-outline-dark px-1 py-0">South</button> /
        <button @click="move(0,grid)()" class="btn btn-sm btn-outline-dark px-1 py-0">East</button> /
        <button @click="move(0,-grid)()" class="btn btn-sm btn-outline-dark px-1 py-0">West</button>
      </div>
      <AerialView
        :lat="goalLatLong[0]"
        :long="goalLatLong[1]"
      />
      <div>
        <button
          v-if="distance > radius"
          @click="updateHere"
          class="btn btn-outline-dark"
        >
          Am I closer?
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
