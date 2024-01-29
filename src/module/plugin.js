import {
  Editor,
  Transforms,
  Location,
  Point,
  Element as SlateElement,
  Descendant,
  NodeEntry,
  Node,
  BaseText,
  Path,
} from 'slate'
import { DomEditor } from '@wangeditor/editor'

// table cell 内部删除处理
function deleteHandler(newEditor) {
  const { selection } = newEditor
  if (selection == null) return false

  const [cellNodeEntry] = Editor.nodes(newEditor, {
    match: n => DomEditor.checkNodeType(n, 'ntable-cell'),
  })

  if (cellNodeEntry) {
    const [, cellPath] = cellNodeEntry
    const start = Editor.start(newEditor, cellPath)

    if (Point.equals(selection.anchor, start)) {
      return true // 阻止删除 cell
    }
  }
  return false
}

// 判断location是否命中table
function isTableLocation(editor, location) {
  const tables = Editor.nodes(editor, {
    at: location,
    match: n => DomEditor.getNodeType(n) === 'ntable',
  })
  let hasTable = false
  for (const table of tables) {
    hasTable = true //找到table
  }
  return hasTable
}

function withNTable(editor) {
  const {
    insertBreak,
    deleteBackward,
    deleteForward,
    normalizeNode,
    insertData,
    handleTab,
    selectAll,
  } = editor
  const newEditor = editor
  // 重写insertBreak - cell内换行，只换行文本，不拆分node
  newEditor.insertBreak = () => {
    const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'ntable')
    if (selectedNode != null) {
      newEditor.insertText('\n')
      return
    }

    // 未命中table，执行默认换行
    insertBreak()
  }

  // 重写delete cell 内删除，只删除文字，不删除 node
  newEditor.deleteBackward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return //命中table cell，自己处理删除

    // 防止从table后面的p删除时，删除最后一个cell
    const { selection } = newEditor
    if (selection) {
      const before = Editor.before(newEditor, selection) // 前一个location
      if (before) {
        const isTableOnBeforeLocation = isTableLocation(newEditor, before) // before是否table
        const isTableOnCurSelection = isTableLocation(newEditor, selection) // 当前是否table
        if (isTableOnBeforeLocation && !isTableOnCurSelection) {
          return // 如果当前不是 table ，前面是 table ，则不执行删除。否则会删除 table 最后一个 cell
        }
      }
    }
    // 执行默认的删除
    deleteBackward(unit)
  }

  // 重写handleTab 在table内按tab跳到下一个单元格
  newEditor.handleTab = () => {
    const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'ntable')
    if (selectedNode) {
      const above = Editor.above(editor)

      // 常规情况下选中文字外层 ntable-cell进行跳转
      if (DomEditor.checkNodeType(above[0], 'ntable-cell')) {
        Transforms.select(editor, above[1])
      }

      let next = Editor.next(editor)
      if (next) {
        if (next[0] && next[0].text) {
          next = Editor.next(editor, { at: next[1] }) ?? next
        }
        Transforms.select(editor, next[1])
      } else {
        const topLevelNodes = newEditor.children || []
        const topLevelNodesLength = topLevelNodes.length
        // 在最后一个单元格按tab时table末尾如果没有p则插入p后光标切到p上
        if (DomEditor.checkNodeType(topLevelNodes[topLevelNodesLength - 1], 'ntable')) {
          const p = DomEditor.genEmptyParagraph()
          Transforms.insertNodes(newEditor, p, { at: [topLevelNodesLength] })
          // 在表格末尾插入p后再次执行光标切到p上
          newEditor.handleTab()
        }
      }
      return
    }
    handleTab()
  }

  newEditor.deleteForward = unit => {
    const res = deleteHandler(newEditor)
    if (res) return //命中table cell，自己处理删除

    deleteForward(unit)
  }

  // 重写normalize
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    if (type !== 'ntable') {
      // 未命中table，执行默认的normalizeNode
      return normalizeNode([node, path])
    }
    // -------------- table 是 editor 最后一个节点，需要后面插入 p --------------
    const isLast = DomEditor.isLastNode(newEditor, node)
    if (isLast) {
      const p = DomEditor.genEmptyParagraph()
      Transforms.insertNodes(newEditor, p, { at: [path[0] + 1] })
    }
  }

  // 重写insertData 粘贴文本
  newEditor.insertData = data => {
    const tableNode = DomEditor.getSelectedNodeByType(newEditor, 'ntable')
    if (tableNode == null) {
      insertData(data) //执行默认的insertData
      return
    }

    // 获取文本，并插入到 cell
    const text = data.getData('text/plain')

    // 单图或图文 插入
    if (text === '\n' || /<img[^>]+>/.test(data.getData('text/html'))) {
      insertData(data)
      return
    }

    Editor.insertText(newEditor, text)
  }

  // 重写table-cell的全选
  newEditor.selectAll = () => {
    const selection = newEditor.selection
    console.log(selection)
    if (selection == null) {
      selectAll()
      return
    }
    const cell = DomEditor.getSelectedNodeByType(newEditor, 'ntable-cell')
    if (cell == null) {
      selectAll()
      return
    }

    const { auchor, focus } = selection
    if (!Path.equals(auchor.path.slice(0, 3), focus.path.slice(0, 3))) {
      selectAll()
      return
    }

    const path = DomEditor.findPath(newEditor, cell)
    const start = DomEditor.start(newEditor, path)
    const end = DomEditor.end(newEditor, path)

    const newSelection = {
      auchor: start,
      focus: end,
    }

    newEditor.select(newSelection)

    // TODO:其他需要改api的地方
  }

  return DomEditor
}

export default withNTable
