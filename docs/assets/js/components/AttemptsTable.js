import CountdownTillNext from "./CountdownTillNext.js";

export default {
  props: {
    attempts: Array,
  },
  components: {
    CountdownTillNext,
  },
  template: `
    <table class="table table-bordered">
      <tbody>
        <tr v-for="attempt in attempts" class="attempt">
          <td>
            <span v-if="attempt.count">
              #{{attempt.count}}
            </span>
          </td>
          <td>
            <span v-if="attempt.isGoalReached">
              🎉 You're there! Great job!
              <div class="firework"></div>
              <CountdownTillNext
                :startInSeconds="startInSeconds"
                :freqInSeconds="freqInSeconds"
              />
            </span>
            <span v-else>
              {{attempt.message}}
            </span>
          </td>
          <td>{{attempt.temperature}}</td>
        </tr>
      </tbody>
    </table>
  `
}
