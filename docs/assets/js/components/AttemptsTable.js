export default {
  props: {
    attempts: Array,
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
          <td>{{attempt.message}}</td>
          <td>{{attempt.temperature}}</td>
        </tr>
      </tbody>
    </table>
  `
}
