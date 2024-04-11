import { h } from 'snabbdom'
function renderTableBody(elemNode, children, editor) {
  const vnode = h(
    'thead',
    {
      style: {
        borderBottomWidth: '1px',
        fontSize: '14px',
      },
      attrs: {
        ...elemNode,
      },
    },
    children
  )
  return vnode
}

export default renderTableBody
