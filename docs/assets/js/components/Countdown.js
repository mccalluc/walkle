
export default {
  props: {
    frequency_s: Number,
  },
  data() {
    return {
      now_s: Math.floor(Date.now() / 1000)
    }
  },
  created() {
    setInterval(() => {
			this.now_s++;
		}, 1000)
  },
  computed: {
    next_s() {return Math.ceil((this.now_s || 0) / this.frequency_s) * this.frequency_s},
    remaining_s() {return this.next_s - this.now_s},
    remaining_str() {
      const date = new Date(0);
      date.setSeconds(this.remaining_s);
      return date.toISOString().substring(11, 19)
    }
  },
  template: `
    <div>
      Next walkle in: {{remaining_str}}
    </div>
  `
}
