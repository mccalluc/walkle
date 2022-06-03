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
  computed: {
    now_s() {return Math.floor(Date.now() / 1000)},
    next_s() {return Math.ceil((this.now_s || 0) / this.frequency_s) * this.frequency_s},
    remaining_s() {return this.next_s - this.now_s},
    remaining_str() {
      const date = new Date(0);
      date.setSeconds(this.remaining_s);
      return date.toISOString().substring(11, 19)
    }
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
      <div>
        Next walkle in: {{remaining_str}}
      </div>
      <details open="1">
        <summary>Settings</summary>
        frequency:
          <select v-model="frequency_s">
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
