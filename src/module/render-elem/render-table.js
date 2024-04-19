import { Editor, Element as SlateElement, Range, Point, Path } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import { h } from 'snabbdom'
import { TableCursor } from 'slate-table'
import { setTableNodeOrigin, getTableCellNode, setStartPath } from '../../utils/util.js'
import { getSelection } from '../../utils/selection.js'
function updateSelection(endPath, startPath, editor, elemNode) {
  if (!startPath) return
  if (Path.equals(startPath, endPath)) {
    // 选区为一个
    editor.emit('SetShowWrap', false)
    return
  }
  const selection = getSelection(editor, startPath, endPath, elemNode)
  console.log(selection)
  if (selection.length >= 2) {
    console.log(selection)
    editor.emit('SetShowWrap', true)
  }
  editor.emit('SetSelectCells', selection)
}
function renderTable(elemNode, children, editor) {
  const selected = DomEditor.isNodeSelected(editor, elemNode)
  const editorState = {
    showWrap: false,
    selection: null,
    startPath: null,
  }
  if (!(!editor || !elemNode || elemNode.originTable)) {
    const tablePath = DomEditor.findPath(editor, elemNode)
    setTableNodeOrigin(editor, tablePath)
  }

  const vnode = h(
    'table',
    {
      className: `table-container ${selected ? 'table-selection-none' : ''}`,
      attrs: {
        // ...elemNode,
      },
      hook: {
        update: vnode => {
          editor.on('SetShowWrap', state => {
            editorState.showWrap = state
            console.log(editorState)
          })
          editor.on('SetSelectCells', selection => {
            editorState.selection = selection
          })
        },
      },
      on: {
        mousedown: e => {
          if (e.target.tagName === 'DIV') e.preventDefault()
          if (editor.isDisabled()) return
          const node = getTableCellNode(editor, e.target)

          if (!node || e.button !== 0) return
          editorState.startPath = node[1]
          console.log(editorState.startPath)
        },
        mousemove: e => {
          if (editorState.startPath) {
            console.log(editorState.startPath)
            const endNode = getTableCellNode(editor, e.target)
            if (endNode[1]) updateSelection(endNode[1], editorState.startPath, editor, elemNode)
          }
        },
        mouseup: e => {
          console.log('mouseup')
          editorState.startPath = null
        },
        dragstart: e => {
          e.preventDefault()
        },
      },
    },

    children
  )
  return h('div', {}, [
    h('div', {
      className: 'yt-e-table-selection',
      style: {
        display: `${editorState.showWrap ? 'block' : 'none'}`,
      },
    }),
    vnode,
  ])
}

export default renderTable
