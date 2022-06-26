import {getDistance, getCompassDirection} from "../upstream.js";
import {KM, MILE} from "../units.js";
import getLatLong from "../getLatLong.js";

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
      goalLatLong: params.goal.split(',').map(l => Number(l)),
      unit: params.unit,
      grid: Number(params.grid),
      radius: Number(params.radius),
      mapStyle: params.mapStyle,
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
      try {
        const distanceInMeters = getDistance(ll(this.hereLatLong), ll(this.goalLatLong));
        return (distanceInMeters * this.coversionFactor).toPrecision(2);
      } catch {
        return undefined;
      }
    },
    direction() {
      const compassDirection = getCompassDirection(ll(this.hereLatLong), ll(this.goalLatLong));
      return compassDirection;
    }
  },
  methods: {
    async updateHere() {
      this.hereLatLong = await getLatLong();
      const attemptsCount = this.attempts.length + 1;
      this.attempts.unshift({
        count: attemptsCount,
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
      <div class="pb-3">
        Pick a goal farther:
        <button @click="move(grid,0)()" class="btn btn-sm btn-outline-dark px-1 py-0">North</button> /
        <button @click="move(-grid,0)()" class="btn btn-sm btn-outline-dark px-1 py-0">South</button> /
        <button @click="move(0,grid)()" class="btn btn-sm btn-outline-dark px-1 py-0">East</button> /
        <button @click="move(0,-grid)()" class="btn btn-sm btn-outline-dark px-1 py-0">West</button>
      </div>
      <AerialView
        :lat="goalLatLong[0]"
        :long="goalLatLong[1]"
        :mapStyle="mapStyle"
      />
      <div>
        <div v-if="distance < radius">You're there! Great job!</div>
        <button
          v-else
          @click="updateHere"
          class="btn btn-outline-dark"
        >
          Am I there yet?
        </button>
        
      </div>
      <table class="table table-bordered">
        <tbody>
          <tr v-for="attempt in attempts">
            <td>#{{attempt.count}}</td>
            <td>{{attempt.distance}} {{unit}} {{attempt.direction}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}
