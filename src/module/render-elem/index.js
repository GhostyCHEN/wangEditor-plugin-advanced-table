import renderTable from './render-table'
import renderTableRow from './render-row'
import renderTableCell from './render-cell'

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
