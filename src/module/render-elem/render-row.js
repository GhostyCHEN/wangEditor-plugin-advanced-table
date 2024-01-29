import { h } from 'snabbdom'
function renderTableRow(elemNode, children, editor) {
  return h('tr', {}, children)
}

export default renderTableRow
