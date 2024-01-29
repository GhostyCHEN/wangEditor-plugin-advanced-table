import renderTable from './render-table.js'
import renderTableRow from './render-row.js'
import renderTableCell from './render-cell.js'

export const renderTableConf = {
  type: 'ntable',
  renderElem: renderTable,
}

export const renderTableRowConf = {
  type: 'ntable-row',
  renderElem: renderTableRow,
}

export const renderTableCellConf = {
  type: 'ntable-cell',
  renderElem: renderTableCell,
}
