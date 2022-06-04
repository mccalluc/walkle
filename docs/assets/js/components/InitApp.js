import {md5} from "../upstream.js";
import {KM, MILE, grid} from "../units.js";
import getLatLong from "../getLatLong.js";

import CountdownTillNext from "./CountdownTillNext.js";
import AerialView from "./AerialView.js";


export default {
  data() {
    return {
      startInSeconds: Math.floor(Date.now() / 1000),
      freqInSeconds: Number(localStorage.freqInSeconds) || 60 * 60 * 24,
      unit: localStorage.unit || MILE,
      radius: localStorage.radius || 1/20,
      mapStyle: 'none',
      origLatLong: [undefined, undefined],
      KM, MILE,
    }
  },
  watch: {
    freqInSeconds(newValue) {localStorage.freqInSeconds = newValue},
    unit(newValue)          {localStorage.unit = newValue},
    radius(newValue)        {localStorage.radius = newValue},
    mapStyle(newValue)      {localStorage.mapStyle = newValue}
  },
  async created() {
    this.origLatLong = await getLatLong();
  },
  computed: {
    offsetLatLong() {
      const seed = Math.floor(this.startInSeconds / this.freqInSeconds);
      const bytes = md5.array(String(seed));
      const [dx, dy] = [
        // between 0 and 1:
        (bytes[0] + 256 * bytes[1]) / (256**2),
        (bytes[2] + 256 * bytes[3]) / (256**2)
      ]
      return [grid * dx, grid * dy];
    },
    goalLatLong() {
      const [lat, long] = this.origLatLong;
      const [gridLat, gridLong] = [
        Math.floor(lat / grid) * grid,
        Math.floor(long / grid) * grid,
      ]
      const [offsetLat, offsetLong] = this.offsetLatLong;
      return [
        gridLat + offsetLat,
        gridLong + offsetLong,
      ]
    },
    loopUrl() {
      const params = new URLSearchParams({
        goal: this.goalLatLong.join(','),
        unit: this.unit,
        radius: this.radius,
        mapStyle: this.mapStyle,
      })
      return `#${params}`; 
    }
  },
  components: {
    CountdownTillNext,
    AerialView,
  },
  template: `
    <div>
      <AerialView
        :lat="goalLatLong[0]"
        :long="goalLatLong[1]"
        :mapStyle="mapStyle"
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
                <td>goal radius</td>
                <td>
                  <select v-model="radius">
                    <option :value="1/10">1/10 {{unit}}</option>
                    <option :value="1/40">1/40 {{unit}}</option>
                    <option :value="1/100">1/100 {{unit}}</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>map style</td>
                <td>
                  <select v-model="mapStyle">
                    <option value="none">none</option>
                    <option value="photo">photo</option>
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
