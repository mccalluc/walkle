import NewWalkle from "./NewWalkle.js";

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
    remainingSeconds() {
      const nextInSeconds = 
        Math.ceil(this.startInSeconds / this.freqInSeconds)
        * this.freqInSeconds;
      return nextInSeconds - this.nowInSeconds},
    remainingFormatted() {
      const date = new Date(0);
      date.setSeconds(this.remainingSeconds);
      return date.toISOString().substring(11, 19)
    }
  },
  components: {
    NewWalkle,
  },
  template: `
    <div>
      ⏰ Next Walkle in: 
      <span v-if="remainingSeconds >= 0">{{remainingFormatted}}</span>
      <span v-else>
        <NewWalkle />
      </span>
    </div>
  `
}
