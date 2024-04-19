import { Editor, Element, Path, Range, Transforms } from 'slate'
import { DomEditor } from '@wangeditor/editor'

/**
 * 获取range的范围数据
 * @param args
 * @returns
 */
export function getRange(...args) {
  const xArr = []
  const yArr = []
  args.forEach(item => {
    xArr.push(item[0])
    yArr.push(item[1])
  })
  return {
    xRange: [Math.min(...xArr), Math.max(...xArr)],
    yRange: [Math.min(...yArr), Math.max(...yArr)],
  }
}

/**
 * 单个源表格 path 获取真实 path(对于 slate 的相对 path)
 * @param originTable
 * @param path
 * @returns
 */
export function getRealPathByPath(originTable, path) {
  const [x, y] = path
  for (const [rowKey, row] of originTable.entries()) {
    for (const [cellKey, cell] of row.entries()) {
      if (Array.isArray(cell[0]) && Array.isArray(cell[1])) {
        // 是否在范围内
        const xRange = [cell[0][0], cell[1][0]]
        const yRange = [cell[0][1], cell[1][1]]
        if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
          return [rowKey, cellKey]
        }
      } else if (cell[0] === x && cell[1] === y) {
        return [rowKey, cellKey]
      }
    }
  }
  return [-1, -1]
}

/**
 * 计算行索引
 * @param originTable
 * @param rowIndex
 * @param colNum 源表格总列数
 * @returns
 */
function getRowOriginPosition(originTable, rowIndex, colNum) {
  let index = 0
  while (index < 10000) {
    // 初始化源表格列索引
    let colIndex = 0
    // 根据行索引计算当前行的0 ～ colNum列中是否存在当前源表格中
    while (colIndex < colNum) {
      const originCell = [rowIndex + index, colIndex]
      // 若都存在则行索引加继续计算
      // 若有不存在，则返回当前行索引，即为当前行的源表格索引
      if (!isContainPath(originTable, originCell)) {
        return originCell[0]
      }
      colIndex++
    }
    // 进行下一行计算
    index++
  }
}

/**
 * 判断坐标是否存在源表格中
 * @param originTable
 * @param target
 * @returns
 */

export function isContainPath(originTable, target) {
  const [x, y] = target
  for (const row of originTable) {
    for (const cell of row) {
      if (Array.isArray(cell[0]) && Array.isArray(cell[1])) {
        // 存在 跨行 / 跨列 单元格
        const xRange = [cell[0][0], cell[1][0]]
        const yRange = [cell[0][1], cell[1][1]]
        if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
          return true
        }
      } else if (cell[0] === x && cell[1] === y) {
        // 不存在合并单元格直接判断
        return true
      }
    }
  }
  return false
}

/**
 * 根据真实表格获取相应位置源表格数据 / 范围
 * @param table
 * @returns
 */
export function getOriginTable(table) {
  const originTable = []
  // 根据首行获取列数
  const body = table.children
  const colNum = body[0].children.reduce((value, cell) => {
    const { colSpan = 1 } = cell
    return colSpan + value
  }, 0)
  // 初始化行序号
  let rowIndex = 0
  body[0].children.forEach(row => {
    // 原始行数据
    const originRow = []
    rowIndex = getRowOriginPosition(originTable, rowIndex, colNum)
    let colOriginIndex = 0
    row.children.forEach(cell => {
      const { rowSpan = 1, colSpan = 1 } = cell
      while (colOriginIndex < 10000) {
        const target = [rowIndex, colOriginIndex]
        if (!isContainPath(originTable, target)) break
        colOriginIndex++
      }
      if (rowSpan === 1 && colSpan === 1) {
        originRow.push([rowIndex, colOriginIndex])
      } else {
        originRow.push([
          [rowIndex, colOriginIndex],
          [rowIndex + rowSpan - 1, colOriginIndex + colSpan - 1],
        ])
      }
      colOriginIndex += colSpan
    })
    originTable.push(originRow)
  })
  return originTable
}

/**
 * table node设置 originTable 数据，便于转换为word
 * @param editor
 * @param tablePath
 * @returns null
 */

export function setTableNodeOrigin(editor, tablePath) {
  const [tableNode] = Editor.node(editor, tablePath)
  const originTable = getOriginTable(tableNode)
  Transforms.setNodes(editor, { originTable }, { at: tablePath })
}

/**
 * 根据 dom 获取相应 cell node
 * @param editor
 * @param target
 * @returns
 */
export function getTableCellNode(editor, target) {
  const data = DomEditor.toSlateNode(editor, target)
  const path = DomEditor.findPath(editor, data)
  const [node] = Editor.nodes(editor, {
    at: path,
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'xtable-cell',
  })
  return node
}

/**
 * 获取指定单元格的 span 范围
 * 转换为源表格计算
 * @param editor
 * @param table
 * @param cellPaths
 * @returns
 */
export function getCellsSpan(editor, table, cellPaths) {
  const originTable = getOriginTable(table)
  const tablePath = DomEditor.findPath(editor, table)
  const ranges = []

  cellPaths.forEach(cellPath => {
    const cellRelative = Path.relative(cellPath, tablePath)
    const originRange = originTable[cellRelative[0]][cellRelative[1]]

    if (Array.isArray(originRange[0]) && Array.isArray(originRange[1])) {
      ranges.push(originRange[0], originRange[1])
    } else {
      ranges.push(cellRelative)
    }
  })
  const { xRange, yRange } = getRange(...ranges)
  return {
    rowSpan: xRange[1] - xRange[0] + 1,
    colSpan: yRange[1] - yRange[0] + 1,
  }
}

/**
 * 判断cellNode 是否为空cell
 * @param editor
 * @param cellNode
 */
export function isEmptyCell(editor, cellNode) {
  if (cellNode.children.length > 1) return false
  const content = cellNode.children[0]
  if (content.type !== 'paragraph') return false
  return Editor.isEmpty(editor, content)
}

/**
 * 生成空cell node
 */
export function getEmptyCellNode() {
  return {
    type: 'xtable-cell',
    children: [{ type: 'paragraph', children: [{ text: '' }] }],
  }
}

/**
 * 生成空row node
 * @param children
 */
export function getRowNode(children) {
  return {
    type: 'xtable-row',
    children,
  }
}

/**
 * 根据源单元格path获取源表格位置/范围
 * @param originTable
 * @param origin
 * @returns
 */
export function getRangeByOrigin(originTable, origin) {
  const [x, y] = origin
  for (const row of originTable) {
    for (const cell of row) {
      if (Array.isArray(cell[0]) && Array.isArray(cell[1])) {
        // 是否在范围内
        const xRange = [cell[0][0], cell[1][0]]
        const yRange = [cell[0][1], cell[1][1]]
        if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
          return cell
        }
      } else if (cell[0] === x && cell[1] === y) {
        return origin
      }
    }
  }
  return []
}
