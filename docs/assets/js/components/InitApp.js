import {md5} from "../upstream.js";
import {KM, MILE} from "../units.js";
import getLatLong from "../getLatLong.js";

import CountdownTillNext from "./CountdownTillNext.js";
import AerialView from "./AerialView.js";

export default {
  data() {
    return {
      startInSeconds: Math.floor(Date.now() / 1000),
      freqInSeconds: Number(localStorage.freqInSeconds) || 60 * 60,
      unit: localStorage.unit || MILE,
      radius: localStorage.radius || 1/20,
      origLatLong: [undefined, undefined],
      KM, MILE,
    }
  },
  watch: {
    freqInSeconds(newValue) {localStorage.freqInSeconds = newValue},
    unit(newValue)          {localStorage.unit = newValue},
    radius(newValue)        {localStorage.radius = newValue},
  },
  async created() {
    this.origLatLong = await getLatLong();
  },
  computed: {
    hashPair() {
      const seed = Math.floor(this.startInSeconds / this.freqInSeconds);
      const bytes = md5.array(String(seed));
      return [
        (bytes[0] + 256 * bytes[1]) / (256**2),
        (bytes[2] + 256 * bytes[3]) / (256**2)
      ];
    },
    destLatLong() {
      const [lat, long] = this.origLatLong;
      const grid = 5;
      return [
        lat - grid/2 + this.hashPair[0] * grid,
        long - grid/2 + this.hashPair[1] * grid
      ];
    },
    loopUrl() {
      const [lat, long] = this.destLatLong;
      return `#dest=${lat},${long}&unit=${this.unit}&radius=${this.radius}`; 
    }
  },
  components: {
    CountdownTillNext,
    AerialView,
  },
  template: `
    <div>
      <AerialView
        :lat="destLatLong[0]"
        :long="destLatLong[1]"
      /> 
      <a :href="loopUrl" class="btn btn-outline-dark">Start walking</a>    
      <CountdownTillNext
        :start-in-seconds="startInSeconds"
        :freq-in-seconds="freqInSeconds"
      />
      <div class="card">
        <div class="card-body">
          <details>
            <summary>Settings</summary>

            <table>
              <tr>
                <td>frequency</td>
                <td>
                  <select v-model="freqInSeconds">
                    <option :value="60">minutely</option>
                    <option :value="60 * 60">hourly</option>
                    <option :value="60 * 60 * 24">daily</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>unit</td>
                <td>
                  <select v-model="unit">
                    <option :value="MILE">{{MILE}}</option>
                    <option :value="KM">{{KM}}</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>target radius</td>
                <td>
                  <select v-model="radius">
                    <option :value="1">1 {{unit}}</option>
                    <option :value="1/2">1/2 {{unit}}</option>
                    <option :value="1/4">1/4 {{unit}}</option>
                    <option :value="1/10">1/10 {{unit}}</option>
                    <option :value="1/20">1/20 {{unit}}</option>
                  </select>
                </td>
              </tr>
            </table>

          </details>
        </div>
      </div>
    </div>
  `
}
