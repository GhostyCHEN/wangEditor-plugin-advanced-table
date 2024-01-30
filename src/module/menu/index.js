import InsertTable from './InsertTable'
import DeleteTable from './DeleteTable'
import FullWidth from './FullWidth'

export const insertTableMenuConf = {
  key: 'insertNTable',
  factory() {
    return new InsertTable()
  },
}

export const deleteTableMenuConf = {
  key: 'deleteNTable',
  factory() {
    return new DeleteTable()
  },
}

export const fullWidthMenuConf = {
  key: 'fullNWidth',
  factory() {
    return new FullWidth()
  },
}
