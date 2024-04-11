import { Range } from 'slate'
import { TABLE_SVG } from '../../constants/icon-svg'
import { DomEditor } from '@wangeditor/editor'
import { TableEditor } from 'slate-table'
class InsertTable {
  constructor() {
    this.title = '表格'
    this.iconSvg = TABLE_SVG
    this.tag = 'button'
  }

  getValue(editor) {
    return ''
  }

  isActive(editor) {
    return false
  }

  exec(editor, value) {
    TableEditor.insertTable(editor, { rows: 3, cols: 3 })
  }

  isDisabled(editor) {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true //选区非折叠，禁用

    const selectionElems = DomEditor.getSelectedElems(editor)
    const types = ['pre', 'ntable', 'list-item']
    const hasVoidOrPreOrTable = selectionElems.some(elem => {
      const type = DomEditor.getNodeType(elem)
      return types.includes(type) || editor.isVoid(elem)
    })
    if (hasVoidOrPreOrTable) return true // 选区内有 void 或 pre 或 table，禁用

    return false
  }
}

export default InsertTable
