import {KM, MILE} from "../units.js";

export default {
  props: {
    unit: String,
    grid: Number,
    radius: Number,
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
            <select
              :value="unit"
              @input="$emit('update:unit', $event.target.value)"
            >
              <option :value="MILE">{{MILE}}</option>
              <option :value="KM">{{KM}}</option>
            </select>
          </td>
          <td><small>Preferred units?</small></td>
        </tr>

        <tr>
          <td>grid</td>
          <td>
            <select
              :value="grid"
              @input="$emit('update:grid', +$event.target.value)"
            >
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
            <select
              :value="radius"
              @input="$emit('update:radius', +$event.target.value)"
            >
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