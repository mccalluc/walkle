export default {
  // props: {
  //   init: Object,
  // },
  // data() {
  //   return {
  //     segmentMap: fillLowerCase(this.init.segmentMap),
  //     segments: this.init.segments,
  //     stretch: this.init.stretch,
  //     pad: this.init.pad,
  //     skew: this.init.skew,
  //     shrink: this.init.shrink,
  //     grow: this.init.grow,
  //     bevel: this.init.bevel,
  //   }
  // },
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
      <details>
        <summary>Settings</summary>
        frequency:
          <select>
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        neighborhood:
          <select>
            <option>30 seconds</option>
          </select>
        units:
          <select>
            <option>Miles</option>
            <option>Kilometers</option>
          </select>
        target:
          <select>
            <option>1/2 Mile</option>
          </select>
      </details>
    </div>
  `
}
