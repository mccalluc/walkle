import {getDistance, getCompassDirection, md5} from "../upstream.js";
import {KM, MILE} from "../units.js";
import getLatLong from "../getLatLong.js";

import AerialView from "./AerialView.js";
import SettingsTable from "./SettingsTable.js";
import AttemptsTable from "./AttemptsTable.js";
import HelpInfo from "./HelpInfo.js";
import FoldDown from "./FoldDown.js";
import NewWalkle from "./NewWalkle.js";

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
      goalLatLong: JSON.parse(localStorage.goalLatLong || 'null'),
      hereLatLong: [null, null],
      attempts: JSON.parse(localStorage.attempts || '[]'),
      isGoalReached: false,

      // ... or an error message:
      message: null,

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
        return getDistance(ll(this.hereLatLong), ll(this.goalLatLong)) - this.radiusInMeters;
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
    setGoalLatLong(pair) {
      this.goalLatLong = pair;
      localStorage.setItem('goalLatLong', JSON.stringify(pair));
    },
    setMessage(message) {
      this.message = message;
    },
    move(dLat, dLong) {
      function callback() {
        const [lat, long] = this.goalLatLong;
        this.setGoalLatLong([lat + dLat, long + dLong]);
        this.updateHere(false);
      }
      return callback.bind(this);
    },
    restart() {
      localStorage.removeItem('attempts');
      localStorage.removeItem('goalLatLong');
      document.location.reload();
    }
  },
  async created() {
    if (! this.goalLatLong) {
      try {
        this.setGoalLatLong(await getGoalLatLong({startInSeconds, freqInSeconds, grid: this.grid}));
        this.updateHere(false);
      } catch (error) {
        // TODO: Handle different cases.
        this.setMessage('Error!');
      }
    } else {
      // Reloading an in-progress walk:
      // We don't need to update the table, but we do need to figure out where we are.
      this.hereLatLong = await getLatLong();
    }
  },
  components: {
    AerialView,
    SettingsTable,
    AttemptsTable,
    HelpInfo,
    FoldDown,
    NewWalkle,
  },
  template: `
    <div>
      <div v-if="message">
        TODO: Message here
      </div>
      <div v-else>
        <div class="pb-3">
          <button
            @click="updateHere"
            class="btn btn-outline-dark"
            :disabled="isGoalReached"
          >
            Are we there yet?
          </button>
        </div>
        <AttemptsTable
          :attempts="attempts"
          :startInSeconds="startInSeconds"
          :freqInSeconds="freqInSeconds"
        />
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
      </div>

      <FoldDown label="👟 New...">
        <p>
          Are you sure you want to clear and restart?
          <NewWalkle />
        </p>
      </FoldDown>
      <FoldDown label="🗺️ Hint...">
        <p v-if="goalLatLong">
          <AerialView
            :lat="goalLatLong[0]"
            :long="goalLatLong[1]"
          />
        </p>
      </FoldDown>
      <FoldDown label="⚙️ Settings...">
        <SettingsTable
          v-model:unit="unit"
          v-model:grid="grid"
          v-model:radius="radius"
        />
      </FoldDown>
      <FoldDown label="ℹ️ Help...">
        <HelpInfo />
      </FoldDown>
    </div>
  `
}
