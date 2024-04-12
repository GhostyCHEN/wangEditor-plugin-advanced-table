import withNTable from './plugin'
import {
  renderTableConf,
  renderTableRowConf,
  renderTableCellConf,
  renderTableHeadConf,
  renderTableBodyConf,
  renderTableFooterConf,
} from './render-elem/index'
import { tableToHtmlConf, tableRowToHtmlConf, tableCellToHtmlConf } from './elem-to-html'
import { preParseTableHtmlConf } from './pre-parse-html'
import { parseCellHtmlConf, parseRowHtmlConf, parseTableHtmlConf } from './parse-elem-html'
import { insertTableMenuConf, deleteTableMenuConf, mergeCellMenuConf } from './menu/index'

const table = {
  renderElems: [
    renderTableConf,
    renderTableRowConf,
    renderTableCellConf,
    renderTableHeadConf,
    renderTableBodyConf,
    renderTableFooterConf,
  ],
  elemsToHtml: [tableToHtmlConf, tableRowToHtmlConf, tableCellToHtmlConf],
  preParseHtml: [preParseTableHtmlConf],
  parseElemsHtml: [parseCellHtmlConf, parseRowHtmlConf, parseTableHtmlConf],
  menus: [insertTableMenuConf, deleteTableMenuConf, mergeCellMenuConf],
  editorPlugin: withNTable,
}

export default table
