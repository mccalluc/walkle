export default {
  props: {
    label: String,
  },
  template: `
    <details>
      <summary class="btn btn-sm btn-outline-dark px-1 mb-3" style="width: 7em;">{{label}}</summary>
      <slot></slot>
    </details>
  `
}
