export default {
  // props: {
  //   init: Object,
  // },
  data() {
    return {
      frequency_s: 60 * 60,
      neighborhood_deg: 1/60,
      unit: 'mile',
      target_either: 1,
    }
  },
  computed: {
    // charChoices() {
    //   return Object.keys(this.segmentMap);
    // },
    // font() {
    //   const font = makeFont({
    //     fontName: 'spiro-font',
    //     segmentMap: this.segmentMap,
    //     segments: this.segments,
    //     stretch: this.stretch,
    //     pad: this.pad,
    //     skew: this.skew,
    //     shrink: this.shrink,
    //     grow: this.grow,
    //     bevel: this.bevel
    //   });
    //   return font;
    // },
  },
  // methods: {
  //   downloadFont() {
  //     this.font.download()
  //   },
  // },
  components: {
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
      <details open="1">
        <summary>Settings</summary>
        frequency:
          <select v-model="frequency_s">
            <option :value="60 * 60">Hourly</option>
            <option :value="60 * 60 * 24">Daily</option>
            <option :value="60 * 60 * 24 * 7">Weekly</option>
          </select>
        neighborhood:
          <select v-model="neighborhood_deg">
            <option :value="1 / 60">1'</option>
            <option :value="2 / 60">2'</option>
            <option :value="3 / 60">3'</option>
          </select>
        units:
          <select v-model="unit">
            <option value="mile">Miles</option>
            <option value="km">Kilometers</option>
          </select>
        target:
          <select v-model="target_either">
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
