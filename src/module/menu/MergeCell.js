import { TRASH_SVG } from '../../constants/icon-svg'
import { TableEditor } from 'slate-table'

class MergeCell {
  constructor() {
    this.title = '合并单元格'
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
    return TableEditor.canMerge(editor)
  }

  exec(editor, value) {
    if (this.isDisabled(editor)) return
    TableEditor.merge(editor)
  }
}

export default MergeCell
