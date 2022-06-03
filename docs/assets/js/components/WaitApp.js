import Countdown from "./Countdown.js";

export default {
  // props: {
  //   init: Object,
  // },
  data() {
    return {
      frequency_s: 60 * 60,
      neighborhood_deg: 1/60,
      unit: 'mile',
      radius_either: 1,
    }
  },
  // methods: {
  //   downloadFont() {
  //     this.font.download()
  //   },
  // },
  components: {
    Countdown,
    // Style,
    // StencilEditor,
    // Input,
  },
  template: `
    <div>
      <div>
        {{frequency_s}}
        {{neighborhood_deg}}
        {{unit}}
        {{target_either}}
      </div>
      <Countdown :frequency_s="frequency_s" />
      <details open="1">
        <summary>Settings</summary>
        frequency:
          <select v-model="frequency_s">
            <option :value="60">Minutely</option>
            <option :value="60 * 60">Hourly</option>
            <option :value="60 * 60 * 24">Daily</option>
          </select>
        neighborhood:
          <select v-model="neighborhood_deg">
            <option :value="1 / 60">1'</option>
            <option :value="2 / 60">2'</option>
            <option :value="3 / 60">3'</option>
          </select>
        unit:
          <select v-model="unit">
            <option value="mile">mile</option>
            <option value="km">km</option>
          </select>
        radius:
          <select v-model="radius_either">
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
