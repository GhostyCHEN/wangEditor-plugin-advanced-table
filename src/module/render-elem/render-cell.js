import throttle from 'lodash.throttle'
import { Element as SlateElement, Transforms, Location } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import { isCellInFirstRow } from '../helpers'
import { h } from 'snabbdom'
import $ from '../../utils/dom'

// 拖拽列宽相关信息
let isMouseDownForResize = false
let clientXWhenMouseDown = 0
let cellWidthWhenMouseDown = 0
let cellPathWhenMouseDown = null
let editorWhenMouseDown = null
const $body = $('body')

function onMouseDown(event) {
  const elem = event.target
  if (elem.tagName !== 'TH' && elem.tagName !== 'TD') return

  // if (elem.style.cursor !== 'col-resize') return
  // elem.style.cursor = 'auto'

  event.preventDefault()
  // 记录必要信息
  isMouseDownForResize = true
  const { clientX } = event
  clientXWhenMouseDown = clientX
  const { width } = elem.getBoundingClientRect()
  cellWidthWhenMouseDown = width

  // 绑定事件
  $body.on('mousemove', onMouseMove)
  $body.on('mouseup', onMouseUp)
}

$body.on('mousedown', onMouseDown) // 绑定事件

function onMouseUp(event) {
  isMouseDownForResize = false
  editorWhenMouseDown = null
  cellPathWhenMouseDown = null
  if (!$body.off) return
  // 解绑事件
  $body.off('mousemove', onMouseMove)
  $body.off('mouseup', onMouseUp)
}

const onMouseMove = throttle(function (event) {
  if (!isMouseDownForResize) return
  if (editorWhenMouseDown == null || cellPathWhenMouseDown == null) return
  event.preventDefault()

  const { clientX } = event
  let newWith = cellWidthWhenMouseDown + (clientX - clientXWhenMouseDown) // 计算新宽度
  newWith = Math.floor(newWith * 100) / 100 // 保留小数点后两位
  if (newWith < 30) newWith = 30 // 最小宽度

  // 这是宽度
  Transforms.setNodes(
    editorWhenMouseDown,
    { width: newWith.toString() },
    {
      at: cellPathWhenMouseDown,
    }
  )
}, 100)

function renderTableCell(cellNode, children, editor) {
  const isFirstRow = isCellInFirstRow(editor, cellNode)
  const { colSpan = 1, rowSpan = 1, isHeader = false } = cellNode

  if (!isFirstRow) {
    return h(
      'td',
      {
        attrs: {
          colSpan: colSpan,
          rowSpan: rowSpan,
        },
      },
      children
    )
  }

  const Tag = isHeader ? 'th' : 'td'

  const vnode = h(
    Tag,
    {
      attrs: {
        colSpan: colSpan,
        rowSpan: rowSpan,
      },
      style: {
        borderRightWidth: '3px',
      },
      on: {
        mousemove: throttle(function (event, that) {
          const elem = that.elm
          if (elem == null) return
          const { left, width, top, height } = elem.getBoundingClientRect()
          const { clientX, clientY } = event

          if (isMouseDownForResize) return
          // 非 mousedown 状态，计算 cursor 样式
          const matchX = clientX > left + width - 5 && clientX < left + width // X 轴，是否接近 cell 右侧？
          const matchY = clientY > top && clientY < top + height // Y 轴，是否在 cell 之内
          // X Y 轴都接近，则修改鼠标样式
          if (matchX && matchY) {
            elem.style.cursor = 'col-resize'
            editorWhenMouseDown = editor
            cellPathWhenMouseDown = DomEditor.findPath(editor, cellNode)
          } else {
            if (!isMouseDownForResize) {
              elem.style.cursor = 'auto'
              editorWhenMouseDown = null
              cellPathWhenMouseDown = null
            }
          }
        }, 100),
      },
    },
    children
  )
  return vnode
}

export default renderTableCell
