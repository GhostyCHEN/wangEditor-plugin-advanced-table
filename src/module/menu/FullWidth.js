import { Transforms, Range } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import { FULL_WIDTH_SVG } from '../../constants/icon-svg'
class TableFullWidth {
  constructor() {
    this.title = '宽度自适应'
    this.iconSvg = FULL_WIDTH_SVG
    this.tag = 'button'
  }

  getValue(editor) {
    const tableNode = DomEditor.getSelectedNodeByType(editor, 'ntable')
    if (tableNode == null) return false
    return tableNode.width === '100%'
  }

  isActive(editor) {
    return !!this.getValue(editor)
  }

  isDisabled(editor) {
    const { selection } = editor
    if (selection == null) return true
    if (!Range.isCollapsed(selection)) return true

    const tableNode = DomEditor.getSelectedNodeByType(editor, 'ntable')
    if (tableNode == null) {
      return true
    }
    return false
  }

  exec(editor, value) {
    if (this.isDisabled(editor)) return

    const props = {
      width: value ? 'auto' : '100%',
    }

    Transforms.setNodes(editor, props, { mode: 'highest' })
  }
}

export default TableFullWidth
