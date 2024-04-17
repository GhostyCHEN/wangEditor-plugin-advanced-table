import { Editor, Element as SlateElement, Range, Point, Path } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import { h } from 'snabbdom'
import { TableCursor } from 'slate-table'
import { setTableNodeOrigin } from '../../utils/util.js'
function renderTable(elemNode, children, editor) {
  const [isSelecting] = TableCursor.selection(editor)
  if (!(!editor || !elemNode || elemNode.originTable)) {
    const tablePath = DomEditor.findPath(editor, elemNode)
    setTableNodeOrigin(editor, tablePath)
  }
  const vnode = h(
    'table',
    {
      className: `table-container ${isSelecting ? 'table-selection-none' : ''}`,
      attrs: {
        // ...elemNode,
      },
    },
    children
  )
  return vnode
}

export default renderTable
