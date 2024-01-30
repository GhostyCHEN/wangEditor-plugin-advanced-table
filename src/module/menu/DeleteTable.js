import { Transforms } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import { TRASH_SVG } from '../../constants/icon-svg'

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

    const tableNode = DomEditor.getSelectedNodeByType(editor, 'ntable')

    if (tableNode == null) {
      return true
    }

    return false
  }

  exec(editor, value) {
    if (this.isDisabled(editor)) return
    // 删除表格
    Transforms.removeNodes(editor, { mode: 'highest' })
  }
}

export default DeleteTable
