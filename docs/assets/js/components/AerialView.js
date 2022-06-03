
export default {
  props: {
    lat: Number,
    long: Number,
  },
  data() {
    return {
      width: 500,
      height: 500,
    }
  },
  computed: {
    src() {
      // TODO: Handle initial undef.
      const params = `w=${this.width}&h=${this.height}&cp=${this.lat}~${this.long}&lvl=19&sty=a`;
      return `https://www.bing.com/maps/embed?${params}`;
    },
  },
  template: `
    <iframe
      :width="width"
      :height="height"
      frameborder="0"
      :src="src">
    </iframe>
  `
}


