import renderTable from './render-table.js'
import renderTableRow from './render-row.js'
import renderTableCell from './render-cell.js'
import renderTableHead from './render-table-head.js'
import renderTableBody from './render-table-body.js'
import renderTableFooter from './render-table-footer.js'

export const renderTableConf = {
  type: 'xtable',
  renderElem: renderTable,
}

export const renderTableRowConf = {
  type: 'xtable-row',
  renderElem: renderTableRow,
}

export const renderTableCellConf = {
  type: 'xtable-cell',
  renderElem: renderTableCell,
}

export const renderTableHeadConf = {
  type: 'xtable-head',
  renderElem: renderTableHead,
}

export const renderTableBodyConf = {
  type: 'xtable-body',
  renderElem: renderTableBody,
}

export const renderTableFooterConf = {
  type: 'xtable-footer',
  renderElem: renderTableFooter,
}
