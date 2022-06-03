import CountdownTillNext from "./CountdownTillNext.js";

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
    }
  },
  // methods: {
  //   downloadFont() {
  //     this.font.download()
  //   },
  // },
  components: {
    CountdownTillNext,
    // Style,
    // StencilEditor,
    // Input,
  },
  template: `
    <div>
      <div>
        {{freqInSeconds}}
        {{gridInDegrees}}
        {{unit}}
        {{radiusUnitless}}
      </div>
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
        radius:
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
