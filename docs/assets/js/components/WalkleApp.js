import {getDistance, getCompassDirection, md5} from "../upstream.js";
import {KM, MILE} from "../units.js";
import getLatLong from "../getLatLong.js";

import AerialView from "./AerialView.js";
import CountdownTillNext from "./CountdownTillNext.js";
import SettingsTable from "./SettingsTable.js";
import AttemptsTable from "./AttemptsTable.js";
import HelpInfo from "./HelpInfo.js";

function ll(latLong) {
  const [latitude, longitude] = latLong;
  return {latitude, longitude};
}

async function getGoalLatLong({startInSeconds, freqInSeconds, grid}) {
  const seed = Math.floor(startInSeconds / freqInSeconds);
  const bytes = md5.array(String(seed));
  const [dx, dy] = [
    // between 0 and 1:
    (bytes[0] + 256 * bytes[1]) / (256**2),
    (bytes[2] + 256 * bytes[3]) / (256**2)
  ]
  const randomOffsetLatLong = [grid * dx, grid * dy];

  const [lat, long] = await getLatLong();
  const [gridLat, gridLong] = [
    Math.floor(lat / grid) * grid,
    Math.floor(long / grid) * grid,
  ]
  const [offsetLat, offsetLong] = randomOffsetLatLong;
  return [
    gridLat + offsetLat,
    gridLong + offsetLong,
  ]
}

const startInSeconds = Math.floor(Date.now() / 1000);
const freqInSeconds = 60 * 60 * 24; // ie, daily

export default {
  data() {
    return {
      // User configurations:
      unit: localStorage.unit || KM,
      grid: Number(localStorage.grid) || 1/60,
      radius: Number(localStorage.radius) || 0.1,

      // Where we are, and where we have been:
      goalLatLong: [undefined, undefined],
      hereLatLong: [undefined, undefined],
      attempts: [],

      // Time:
      startInSeconds,
      freqInSeconds,

      // String constants, for consistency:
      KM, MILE,
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
        return getDistance(ll(this.hereLatLong), ll(this.goalLatLong));
      } catch {
        return undefined;
      }
    },
    distance() {
      try {
        const distanceInMeters = getDistance(ll(this.hereLatLong), ll(this.goalLatLong));
        return (distanceInMeters * this.conversionFactor).toPrecision(2);
      } catch {
        return undefined;
      }
    },
    radiusInMeters() {
      return this.radius / this.conversionFactor;
    },
    compassDirection() {
      try {
        return getCompassDirection(ll(this.hereLatLong), ll(this.goalLatLong));
      } catch {
        return undefined;
      }
      
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
  async created() {
    this.goalLatLong = await getGoalLatLong({startInSeconds, freqInSeconds, grid: this.grid});
    this.updateHere(true);
  },
  components: {
    AerialView,
    CountdownTillNext,
    SettingsTable,
    AttemptsTable,
    HelpInfo,
  },
  template: `
    <div>
      <div class="pb-3">
        <div v-if="radiusInMeters > distanceInMeters">
          🎉 You're there! Great job!
          <div class="firework"></div>
          <CountdownTillNext
            :startInSeconds="startInSeconds"
            :freqInSeconds="freqInSeconds"
          />
        </div>
        <div v-else>
          <button
            @click="updateHere"
            class="btn btn-outline-dark"
          >
            Are we there yet?
          </button>
        </div>
      </div>
      <AttemptsTable :attempts="attempts" :unit="unit" />
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
        <summary class="btn btn-sm btn-outline-dark px-1 mb-3">⚙️ Settings...</summary>
        <SettingsTable
          v-model:unit="unit"
          v-model:grid="grid"
          v-model:radius="radius"
        />
      </details>
      <details>
        <summary class="btn btn-sm btn-outline-dark px-1 mb-3">ℹ️ Help...</summary>
        <HelpInfo />
      </details>
    </div>
  `
}
