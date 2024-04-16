import { Editor, Element as SlateElement, Range, Point, Path } from 'slate'
import { h } from 'snabbdom'
import { TableCursor } from 'slate-table'

function renderTable(elemNode, children, editor) {
  const [isSelecting] = TableCursor.selection(editor)
  console.log('isSelecting', isSelecting)
  const vnode = h(
    'table',
    {
      className: `table-container ${isSelecting ? 'table-selection-none' : ''}`,
      attrs: {
        ...elemNode,
      },
    },
    children
  )
  return vnode
}

export default renderTable
