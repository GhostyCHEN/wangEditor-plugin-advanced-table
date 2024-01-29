import withNTable from './plugin'
import { renderTableConf, renderTableRowConf, renderTableCellConf } from './render-elem/index'
import { tableToHtmlConf, tableRowToHtmlConf, tableCellToHtmlConf } from './elem-to-html'
import { preParseTableHtmlConf } from './pre-parse-html'
import { parseCellHtmlConf, parseRowHtmlConf, parseTableHtmlConf } from './parse-elem-html'
import { insertTableMenuConf } from './menu/index'

const table = {
  renderElems: [renderTableConf, renderTableRowConf, renderTableCellConf],
  elemsToHtml: [tableToHtmlConf, tableRowToHtmlConf, tableCellToHtmlConf],
  preParseHtml: [preParseTableHtmlConf],
  parseElemsHtml: [parseCellHtmlConf, parseRowHtmlConf, parseTableHtmlConf],
  menus: [insertTableMenuConf],
  editorPlugin: withNTable,
}

export default table
