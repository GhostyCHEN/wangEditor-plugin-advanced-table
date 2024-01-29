import { DomEditor } from '@wangeditor/editor'

// 获取第一行所有cells
export function getFirstRowCells(tableNode) {
  const rows = tableNode.children
  if (rows.length === 0) return []
  const firstRow = rows[0] || {}
  const cells = firstRow.children || []
  return cells
}

// 表格是否带有表头
export function isTableWithHeader(tableNode) {
  const firstRowCells = getFirstRowCells(tableNode)
  return firstRowCells.every(cell => !!cell.isHeader)
}

// 单元格是否在第一行
export function isCellInFirstRow(editor, cellNode) {
  const rowNode = DomEditor.getParentNode(editor, cellNode)
  if (rowNode == null) return false
  const tableNode = DomEditor.getParentNode(editor, rowNode)
  if (tableNode == null) return false

  const firstRowCells = getFirstRowCells(tableNode)
  return firstRowCells.some(c => c === cellNode)
}
