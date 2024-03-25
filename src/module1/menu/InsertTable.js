import { Transforms, Range } from 'slate'
import { genRandomStr } from '../../utils/util'
import { TABLE_SVG } from '../../constants/icon-svg'
import { DomEditor } from '@wangeditor/editor'
import $ from '../../utils/dom'

function genTableNode(rowNum, colNum) {
  // 拼接rows
  const rows = []
  for (let i = 0; i < rowNum; i++) {
    // 拼接cells
    const cells = []
    for (let j = 0; j < colNum; j++) {
      const cellNode = {
        type: 'ntable-cell',
        children: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      }
      if (i === 0) {
        cellNode.isHeader = true
      }
      cells.push(cellNode)
    }
    rows.push({
      type: 'ntable-row',
      children: cells,
    })
  }
  return {
    type: 'ntable',
    children: rows,
  }
}

// 生成唯一DOM id
function genDomId() {
  return genRandomStr('w-e-insert-table')
}

class InsertTable {
  constructor() {
    this.title = '表格'
    this.iconSvg = TABLE_SVG
    this.tag = 'button'
    this.showDropPanel = true
    this.$content = null
  }

  getValue(editor) {
    return ''
  }

  isActive(editor) {
    return false
  }

  exec(editor, value) {}

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

  // 获取panel内容
  getPanelContentElem(editor) {
    // 存在，直接返回
    if (this.$content) return this.$content[0]

    // 初始化
    const $content = $(`<div class="w-e-panel-content-table"></div>`)
    const $info = $(`<span>0 &times; 0</span>`)

    // 渲染10 * 10 table，以快速创建表格
    const $table = $(`<table></table>`)
    for (let i = 0; i < 10; i++) {
      const $tr = $(`<tr></tr>`)
      for (let j = 0; j < 10; j++) {
        const $td = $(`<td></td>`)
        $td.attr('data-x', j.toString())
        $td.attr('data-y', i.toString())
        $tr.append($td)

        // 绑定mouseenter事件
        $td.on('mouseenter', e => {
          const { target } = e
          if (target == null) return
          const $focusTd = $(target)
          const { x: focusX, y: focusY } = $focusTd.dataset()

          // 显示行列数量
          $info[0].innerHTML = `${focusX + 1}  &times; ${focusY + 1}`

          // 修改table td的样式
          $table.children().each(tr => {
            $(tr)
              .children()
              .each(td => {
                const $td = $(td)
                const { x, y } = $td.dataset()
                if (x <= focusX && y <= focusY) {
                  $td.addClass('active')
                } else {
                  $td.removeClass('active')
                }
              })
          })
        })

        // 绑定 click
        $td.on('click', e => {
          e.preventDefault()
          const { target } = e
          const $td = $(target)
          const { x, y } = $td.dataset()
          this.insertTable(editor, y + 1, x + 1)
        })
      }
      $table.append($tr)
    }
    $content.append($table)
    $content.append($info)

    // 记录，并返回
    this.$content = $content
    return $content[0]
  }

  insertTable(editor, rowNumStr, colNumStr) {
    const rowNum = parseInt(rowNumStr, 10)
    const colNum = parseInt(colNumStr, 10)
    if (!rowNum || !colNum) return
    if (rowNum <= 0 || colNum <= 0) return

    // 如果当前是空 p ，则删除该 p
    if (DomEditor.isSelectedEmptyParagraph(editor)) {
      Transforms.removeNodes(editor, { mode: 'highest' })
    }

    // 插入表格
    const tableNode = genTableNode(rowNum, colNum)
    Transforms.insertNodes(editor, tableNode, { mode: 'highest' })
  }
}

export default InsertTable
