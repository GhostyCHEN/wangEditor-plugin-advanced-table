import { h } from 'snabbdom'
import { TableCursor } from 'slate-table'

function renderTableCell(cellNode, children, editor) {
  const { type, rowSpan, colSpan } = cellNode
  const selected = TableCursor.isSelected(editor, cellNode)
  if (selected) {
    // console.log(editor.getSelectionPosition())
    console.log(editor.getConfig().hoverbarKeys)
  }
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
    },
    children
  )
}
export default renderTableCell
