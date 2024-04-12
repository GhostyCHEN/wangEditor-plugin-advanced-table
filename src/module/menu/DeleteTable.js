import { DomEditor } from '@wangeditor/editor'
import { TRASH_SVG } from '../../constants/icon-svg'
import { TableEditor } from 'slate-table'

class DeleteTable {
  constructor() {
    this.title = '删除表格'
    this.iconSvg = TRASH_SVG
    this.tag = 'button'
  }

  getValue(editor) {
    return ''
  }

  isActive(editor) {
    return false
  }

  isDisabled(editor) {
    if (editor.selection == null) return true

    const tableNode = DomEditor.getSelectedNodeByType(editor, 'xtable')

    if (tableNode == null) {
      return true
    }

    return false
  }

  exec(editor, value) {
    if (this.isDisabled(editor)) return
    // 删除表格
    TableEditor.removeTable(editor)
  }
}

export default DeleteTable
