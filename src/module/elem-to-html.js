import { Element } from 'slate'

function tableToHtml(elemNode, childrenHtml) {
  const { originTable = [] } = elemNode
  return `<table originTable="${JSON.stringify(
    originTable
  )}"><tbody>${childrenHtml}</tbody></table>`
}

function tableRowToHtml(elemNode, childrenHtml) {
  return `<tr>${childrenHtml}</tr>`
}

function tableCellToHtml(cellNode, childrenHtml) {
  const { colSpan = 1, rowSpan = 1 } = cellNode

  // const tag = isHeader ? 'th' : 'td'

  return `<td colspan="${colSpan}" rowspan="${rowSpan}">${childrenHtml}</td>`
}

export const tableToHtmlConf = {
  type: 'xtable',
  elemToHtml: tableToHtml,
}

export const tableRowToHtmlConf = {
  type: 'xtable-row',
  elemToHtml: tableRowToHtml,
}

export const tableCellToHtmlConf = {
  type: 'xtable-cell',
  elemToHtml: tableCellToHtml,
}
