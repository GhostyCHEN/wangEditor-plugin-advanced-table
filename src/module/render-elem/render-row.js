import { h } from 'snabbdom'
function renderTableRow(elemNode, children, editor) {
  return h(
    'tr',
    {
      attrs: {
        // ...elemNode,
      },
    },
    children
  )
}

export default renderTableRow
