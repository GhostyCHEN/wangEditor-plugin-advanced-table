import { Editor, Node, Path, Transforms } from 'slate'
import { h } from 'snabbdom'
import { TableCursor } from 'slate-table'
import { DomEditor } from '@wangeditor/editor'
function renderTableCell(cellNode, children, editor) {
  const { type, rowSpan, colSpan } = cellNode
  const selected = TableCursor.isSelected(editor, cellNode)
  const Tag = type === 'xtable-cell' ? 'td' : 'th'
  return h(
    Tag,
    {
      className: ` ${selected ? 'selected-cell' : ''}`,
      style: {
        borderWidth: '1px',
        borderColor: '#cbd5e0',
        padding: '8px',
        verticalAlign: 'middle',
      },
      attrs: {
        rowSpan,
        colSpan,
      },
      on: {
        mousedown: e => {
          // @ts-ignore 阻止光标定位到 table 后面
          if (e.target.tagName === 'DIV') e.preventDefault()

          if (editor.isDisabled()) return

          // 是否需要定位到 table 内部
          const tablePath = DomEditor.findPath(editor, cellNode)
          const tableStart = Editor.start(editor, tablePath)
          const { selection } = editor
          if (selection == null) {
            editor.select(tableStart) // 选中 table 内部
            return
          }
          const { path } = selection.anchor
          if (path[0] === tablePath[0]) return // 当前选区，就在 table 内部

          editor.select(tableStart) // 选中 table 内部
        },
      },
    },
    children
  )
}
export default renderTableCell
