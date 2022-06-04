
export default {
  props: {
    lat: Number,
    long: Number,
  },
  data() {
    return {
      width: 300,
      height: 300,
    }
  },
  computed: {
    src() {
      // TODO: Handle initial undef.
      const params = `w=${this.width}&h=${this.height}&cp=${this.lat}~${this.long}&lvl=20&sty=a`;
      return `https://www.bing.com/maps/embed?${params}`;
    },
  },
  template: `
    <div>
      <iframe
        :width="width"
        :height="height"
        frameborder="0"
        :src="src">
      </iframe>
    </div>
  `
}


