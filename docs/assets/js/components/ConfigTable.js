import {KM, MILE} from "../units.js";

export default {
  props: {
    unit: String,
    grid: Number,
    radius: Number,
  },
  computed: {
    computedUnit: {
      get() {
        return this.unit
      },
      set(value) {
        localStorage.unit = value;
        this.$emit('update:unit', value);
      }
    },
    computedGrid: {
      get() {
        return this.grid
      },
      set(value) {
        localStorage.grid = value;
        this.$emit('update:grid', value);
      }
    },
    computedRadius: {
      get() {
        return this.radius
      },
      set(value) {
        localStorage.radius = value;
        this.$emit('update:radius', value)
      }
    },
  },
  emits: ['update:unit', 'update:grid', 'update:radius'],
  data() {
    return {KM, MILE}
  },
  template: `
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td>unit</td>
          <td>
            <select v-model="computedUnit">
              <option :value="MILE">{{MILE}}</option>
              <option :value="KM">{{KM}}</option>
            </select>
          </td>
          <td><small>Preferred units?</small></td>
        </tr>

        <tr>
          <td>grid</td>
          <td>
            <select v-model="computedGrid">
              <option :value="8 / 60">8'</option>
              <option :value="4 / 60">4'</option>
              <option :value="2 / 60">2'</option>
              <option :value="1 / 60">1'</option>
            </select>
          </td>
          <td><small>How far do you want to walk? (1' is about a mile.)</small></td>
        </tr>

        <tr>
          <td>goal radius</td>
          <td>
            <select v-model="computedRadius">
              <option :value="0.1">0.1 {{unit}}</option>
              <option :value="0.05">0.05 {{unit}}</option>
              <option :value="0.02">0.02 {{unit}}</option>
              <option :value="0.01">0.01 {{unit}}</option>
            </select>
          </td>
          <td><small>How close to the goal is close enough?</small></td>
        </tr>
      </tbody>
    </table>
  `
}
