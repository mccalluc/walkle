import {md5} from "../upstream.js";

import CountdownTillNext from "./CountdownTillNext.js";
import AerialView from "./AerialView.js";

export default {
  // props: {
  //   init: Object,
  // },
  data() {
    return {
      startInSeconds: Math.floor(Date.now() / 1000),
      freqInSeconds: 60 * 60,
      gridInDegrees: 1/60,
      unit: 'mile',
      radiusUnitless: 1,
      origLatLong: [undefined, undefined],
    }
  },
  created() {
    function geolocationSuccess(position) {
      this.origLatLong = [position.coords.latitude, position.coords.longitude];
    }
    function geolocationError() {
      alert('Geolocation failed!');
    }
    navigator.geolocation.getCurrentPosition(
      geolocationSuccess.bind(this),
      geolocationError
    );
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
      const grid = this.gridInDegrees;
      return [
        lat - grid/2 + this.hashPair[0] * grid,
        long - grid/2 + this.hashPair[1] * grid
      ];
    }
  },
  // methods: {
  //   downloadFont() {
  //     this.font.download()
  //   },
  // },
  components: {
    CountdownTillNext,
    AerialView,
    // StencilEditor,
    // Input,
  },
  template: `
    <div>
      Ready to walk from
      <AerialView
        :lat="origLatLong[0]"
        :long="origLatLong[1]"
      />
      to
      <AerialView
        :lat="destLatLong[0]"
        :long="destLatLong[1]"
      />?      
      <CountdownTillNext
        :start-in-seconds="startInSeconds"
        :freq-in-seconds="freqInSeconds"
      />
      <details open="1">
        <summary>Settings</summary>

        frequency:
          <select v-model="freqInSeconds">
            <option :value="60">minutely</option>
            <option :value="60 * 60">hourly</option>
            <option :value="60 * 60 * 24">daily</option>
          </select>

        grid:
          <select v-model="gridInDegrees">
            <option :value="1 / 60">1'</option>
            <option :value="2 / 60">2'</option>
            <option :value="3 / 60">3'</option>
          </select>

        unit:
          <select v-model="unit">
            <option value="mile">mile</option>
            <option value="km">km</option>
          </select>

        destination radius:
          <select v-model="radiusUnitless">
            <option :value="1">1 {{unit}}</option>
            <option :value="1/2">1/2 {{unit}}</option>
            <option :value="1/4">1/4 {{unit}}</option>
            <option :value="1/10">1/10 {{unit}}</option>
            <option :value="1/20">1/20 {{unit}}</option>
          </select>
      </details>
    </div>
  `
}
