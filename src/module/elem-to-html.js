import { Element } from 'slate'

function tableToHtml(elemNode, childrenHtml) {
  const { width = 'auto' } = elemNode
  return `<table width="${width}"><tbody>${childrenHtml}</tbody></table>`
}

function tableRowToHtml(elemNode, childrenHtml) {
  return `<tr>${childrenHtml}</tr>`
}

function tableCellToHtml(cellNode, childrenHtml) {
  const { colSpan = 1, rowSpan = 1, isHeader = false, width = 'auto' } = cellNode

  const tag = isHeader ? 'th' : 'td'

  return `<${tag} colspan="${colSpan}" rowspan="${rowSpan}" width="${width}">${childrenHtml}</${tag}>`
}

export const tableToHtmlConf = {
  type: 'ntable',
  elemToHtml: tableToHtml,
}

export const tableRowToHtmlConf = {
  type: 'ntable-row',
  elemToHtml: tableRowToHtml,
}

export const tableCellToHtmlConf = {
  type: 'ntable-cell',
  elemToHtml: tableCellToHtml,
}
