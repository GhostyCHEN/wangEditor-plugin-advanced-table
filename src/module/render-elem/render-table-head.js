import { h } from 'snabbdom'
function renderTableHead(elemNode, children, editor) {
  const vnode = h(
    'thead',
    {
      style: {
        borderBottomWidth: '1px',
        fontSize: '14px',
        textTransform: 'uppercase',
        backgroundColor: '#f5fafa',
      },
      attrs: {
        ...elemNode,
      },
    },
    children
  )
  return vnode
}

export default renderTableHead
