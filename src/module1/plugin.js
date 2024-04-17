import { Editor, Node, Path, Transforms } from 'slate'
import { withTable, TableCursor } from 'slate-table'
import { DomEditor } from '@wangeditor/editor'
function withNTable(editor) {
  const {
    insertBreak,
    deleteBackward,
    deleteForward,
    normalizeNode,
    insertData,
    handleTab,
    selectAll,
    select,
    apply,
  } = editor
  const newEditor = withTable(editor, {
    blocks: {
      table: 'xtable',
      thead: 'xtable-head',
      tbody: 'xtable-body',
      tfoot: 'xtable-footer',
      tr: 'xtable-row',
      th: 'xheader-cell',
      td: 'xtable-cell',
      content: 'paragraph',
    },
    withDelete: true,
    withFragments: true,
    withInsertText: true,
    withNormalization: true,
    withSelection: true,
    withSelectionAdjustment: true,
  })
  newEditor.selectAll = () => {
    const selection = newEditor.selection
    if (selection == null) {
      selectAll()
      return
    }

    const cell = DomEditor.getSelectedNodeByType(newEditor, 'xtable-cell')
    if (cell == null) {
      selectAll()
      return
    }

    const { anchor, focus } = selection
    if (!Path.equals(anchor.path.slice(0, 3), focus.path.slice(0, 3))) {
      // 选中了多个 cell ，忽略
      // selectAll()
      return
    }

    const text = Node.string(cell)
    const textLength = text.length
    if (textLength === 0) {
      selectAll()
      return
    }

    const path = DomEditor.findPath(newEditor, cell)
    const start = Editor.start(newEditor, path)
    const end = Editor.end(newEditor, path)
    const newSelection = {
      anchor: start,
      focus: end,
    }

    newEditor.select(newSelection) // 选中 table-cell 内部的全部文字
  }

  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    if (type !== 'xtable') {
      // 未命中 table ，执行默认的 normalizeNode
      return normalizeNode([node, path])
    }

    // -------------- table 是 editor 最后一个节点，需要后面插入 p --------------
    const isLast = DomEditor.isLastNode(newEditor, node)
    if (isLast) {
      const p = DomEditor.genEmptyParagraph()
      Transforms.insertNodes(newEditor, p, { at: [path[0] + 1] })
    }
  }
  return newEditor
}

export default withNTable
