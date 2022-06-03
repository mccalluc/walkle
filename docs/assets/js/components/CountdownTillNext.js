
export default {
  props: {
    startInSeconds: Number,
    freqInSeconds: Number,
  },
  data() {
    return {
      nowInSeconds: Math.floor(Date.now() / 1000)
    }
  },
  created() {
    setInterval(() => {
			this.nowInSeconds++;
		}, 1000)
  },
  computed: {
    nextInSeconds() {return Math.ceil(this.startInSeconds / this.freqInSeconds) * this.freqInSeconds},
    remainingSeconds() {return this.nextInSeconds - this.nowInSeconds},
    remainingFormatted() {
      const date = new Date(0);
      date.setSeconds(this.remainingSeconds);
      return date.toISOString().substring(11, 19)
    }
  },
  template: `
    <div>
      Next walkle in: 
      <span v-if="remainingSeconds >= 0">{{remainingFormatted}}</span>
      <a href="/walkle/" v-else>now!</a>
    </div>
  `
}
