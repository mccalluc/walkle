import {KM, MILE} from "../units.js";

export default {
  props: {
    attempts: Array,
    unit: String,
  },
  computed: {
    coversionFactor() {
      return {
        [MILE]: 1/1609,
        [KM]: 1/1000
      }[this.unit]
    },
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
            {{(attempt.distanceInMeters * this.coversionFactor).toPrecision(2)}}
            {{unit}}
            {{attempt.compassDirection}}
          </td>
          <td>{{attempt.temperature}}</td>
        </tr>
      </tbody>
    </table>
  `
}
