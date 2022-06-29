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
    async updateHere(addToAttempts = true) {
      this.hereLatLong = await getLatLong();
      const attemptsCount = this.attempts.length;

      if (!addToAttempts) {
        this.attempts[0] = {
          distance: this.distance,
          direction: this.direction
        };
      } else {
        this.attempts.unshift({
          count: attemptsCount,
          distance: this.distance,
          direction: this.direction,
          temperature: this.attempts.length
            ? (Number(this.distance) < Number(this.attempts[0].distance) ? '🔥 warmer' : '🧊 cooler')
            : ''
        });
      }
    },
    move(dLat, dLong) {
      function callback() {
        const [lat, long] = this.goalLatLong;
        this.goalLatLong = [lat + dLat, long + dLong];
        this.updateHere(false);
      }
      return callback.bind(this);
    }
  },
  created() {
    this.updateHere(true);
  },
  components: {
    AerialView,
  },
  template: `
    <div>
      <div class="pb-3">
        <div v-if="distance < radius">
          🎉 You're there! Great job! 🗺️
          <div class="firework"></div>
        </div>
        <div v-else>
          <button
            @click="updateHere"
            class="btn btn-outline-dark"
          >
            Am I there yet?
          </button>
        </div>
      </div>
      <table class="table table-bordered">
        <tbody>
          <tr v-for="attempt in attempts" class="attempt">
            <td>
              <span v-if="attempt.count">
                #{{attempt.count}}
              </span>
            </td>
            <td>{{attempt.distance}} {{unit}} {{attempt.direction}}</td>
            <td>{{attempt.temperature}}</td>
          </tr>
        </tbody>
      </table>
      <div class="mb-3">
        Move the goal:
        <span v-if="attempts.length < 2">
          <button @click="move(grid,0)()" class="btn btn-sm btn-outline-dark px-1 py-0">North</button> /
          <button @click="move(-grid,0)()" class="btn btn-sm btn-outline-dark px-1 py-0">South</button> /
          <button @click="move(0,grid)()" class="btn btn-sm btn-outline-dark px-1 py-0">East</button> /
          <button @click="move(0,-grid)()" class="btn btn-sm btn-outline-dark px-1 py-0">West</button>
        </span>
        <span v-else>
          ... not allowed after start!
        </span>
      </div>
      <details>
        <summary class="btn btn-sm btn-outline-dark px-1 mb-3">🗺️ Hint...</summary>
        <AerialView
          :lat="goalLatLong[0]"
          :long="goalLatLong[1]"
        />
      </details>
    </div>
  `
}
