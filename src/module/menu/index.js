import InsertTable from './InsertTable'
import DeleteTable from './DeleteTable'
import MergeCell from './MergeCell'

export const insertTableMenuConf = {
  key: 'insertXTable',
  factory() {
    return new InsertTable()
  },
}

export const deleteTableMenuConf = {
  key: 'deleteXTable',
  factory() {
    return new DeleteTable()
  },
}

export const mergeCellMenuConf = {
  key: 'mergeXCell',
  factory() {
    return new MergeCell()
  },
}
