import { h } from 'snabbdom'
function renderTableFooter(elemNode, children, editor) {
  const vnode = h(
    'thead',
    {
      attrs: {
        ...elemNode,
      },
    },
    children
  )
  return vnode
}

export default renderTableFooter
