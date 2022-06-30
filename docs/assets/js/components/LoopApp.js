import {getDistance, getCompassDirection} from "../upstream.js";
import {KM, MILE} from "../units.js";
import getLatLong from "../getLatLong.js";

import AerialView from "./AerialView.js";
import CountDownTillNext from "./CountDownTillNext.js";
import Config from "./Config.js";


function ll(latLong) {
  const [latitude, longitude] = latLong;
  return {latitude, longitude};
}

export default {
  data() {
    const params = Object.fromEntries(
      new URLSearchParams(location.hash.slice(1))
    );
    console.info('localStorage:', localStorage)
    return {
      goalLatLong: params.goal.split(',').map(l => Number(l)),
      unit: localStorage.unit || KM,
      grid: Number(localStorage.grid) || 1/60,
      radius: Number(localStorage.radius) || 0.1,
      hereLatLong: [undefined, undefined],
      attempts: [],
      KM, MILE,
    }
  },
  computed: {
    coversionFactor() {
      return {
        [MILE]: 1/1609,
        [KM]: 1/1000
      }[this.unit]
    },
    distanceInMeters() {
      try {
        return getDistance(ll(this.hereLatLong), ll(this.goalLatLong));
      } catch {
        return undefined;
      }
    },
    distance() {
      try {
        const distanceInMeters = getDistance(ll(this.hereLatLong), ll(this.goalLatLong));
        return (distanceInMeters * this.coversionFactor).toPrecision(2);
      } catch {
        return undefined;
      }
    },
    compassDirection() {
      return getCompassDirection(ll(this.hereLatLong), ll(this.goalLatLong));
    }
  },
  methods: {
    async updateHere(addToAttempts = true) {
      this.hereLatLong = await getLatLong();
      const attemptsCount = this.attempts.length;

      if (!addToAttempts) {
        this.attempts[0] = {
          distanceInMeters: this.distanceInMeters,
          compassDirection: this.compassDirection
        };
      } else {
        this.attempts.unshift({
          count: attemptsCount,
          distanceInMeters: this.distanceInMeters,
          compassDirection: this.compassDirection,
          temperature: this.attempts.length
            ? (
              this.distanceInMeters < this.attempts[0].distanceInMeters
                ? '🔥 warmer'
                : '🧊 cooler'
              )
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
    CountDownTillNext,
    Config,
  },
  template: `
    <div>
      <div class="pb-3">
        <div v-if="distance < radius">
          🎉 You're there! Great job!
          <div class="firework"></div>
          <CountDownTillNext
            :startInSeconds="Math.floor(Date.now() / 1000)"
            :freqInSeconds="60 * 60 * 24"
          />
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
            <td>
              {{(distanceInMeters * this.coversionFactor).toPrecision(2)}}
              {{unit}}
              {{attempt.compassDirection}}
            </td>
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
          not allowed after start!
        </span>
      </div>
      <details>
        <summary class="btn btn-sm btn-outline-dark px-1 mb-3">🗺️ Hint...</summary>
        <AerialView
          :lat="goalLatLong[0]"
          :long="goalLatLong[1]"
        />
      </details>
      <details>
        <summary class="btn btn-sm btn-outline-dark px-1 mb-3">⚙️ Config...</summary>
        <Config
          v-model:unit="unit"
          v-model:grid="grid"
          v-model:radius="radius"
        />
      </details>
    </div>
  `
}
