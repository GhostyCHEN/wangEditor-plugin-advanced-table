import { Editor, Path } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import { getOriginTable, getRange, getRangeByOrigin, getRealPathByPath, tableRange } from './util'

/**
 * 根据真实单元格位置获取源表格 数据 / 范围
 * @param originTable
 * @param real
 * @returns
 */
function getOriginPath(originTable, real) {
  return originTable[real[0]][real[1]]
}

/**
 * 判断一个range(ancestor)是否包含另外一个range（range)
 * @param range
 * @param ancestor
 * @returns
 */
function isContainRange(range, ancestor) {
  if (
    range.xRange[0] >= ancestor.xRange[0] &&
    range.xRange[1] <= ancestor.xRange[1] &&
    range.yRange[0] >= ancestor.yRange[0] &&
    range.yRange[1] <= ancestor.yRange[1]
  )
    return true
  return false
}

/**
 * 获取指定范围返回的range(解决合并扩大range)
 * @param originTable
 * @param xRange
 * @param yRange
 * @returns
 */
function getOriginRange(originTable, xRange, yRange) {
  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      const path = [x, y]
      const rangePath = getRangeByOrigin(originTable, path)
      if (rangePath.toString() !== path.toString()) {
        // 返回范围数据
        const range = getRange([xRange[0], yRange[0]], [xRange[1], yRange[1]], ...rangePath)
        const isContain = isContainRange(range, { xRange, yRange })
        if (!isContain) {
          // 得到更大的范围
          return getOriginRange(originTable, range.xRange, range.yRange)
        }
      }
    }
  }
  return {
    xRange,
    yRange,
  }
}

/**
 * 获取选中内容中源表格的范围
 * @param originTable
 * @param startPath
 * @param endPath
 * @returns
 */
function getAllOriginRange(originTable, startPath, endPath) {
  // 单元格未合并数据
  const originStart = getOriginPath(originTable, startPath)
  const originEnd = getOriginPath(originTable, endPath)

  const newRange = []
  if (Array.isArray(originStart[0]) && Array.isArray(originStart[1])) {
    newRange.push(originStart[0], originStart[1])
  } else {
    newRange.push(originStart)
  }
  if (Array.isArray(originEnd[0]) && Array.isArray(originEnd[1])) {
    newRange.push(originEnd[0], originEnd[1])
  } else {
    newRange.push(originEnd)
  }

  const range = getRange(...newRange)
  return getOriginRange(originTable, range.xRange, range.yRange)
}

/**
 * 判断path是否存在paths中
 * @param paths
 * @param path
 */
function isIncludePath(paths, path) {
  for (const p of paths) {
    if (p[0] === path[0] && p[1] === path[1]) return true
  }
  return false
}

/**
 * 根据源表格range获取真实相对paths
 * @param originTable
 * @param range
 */
function getRealRelativePaths(originTable, range) {
  const realPaths = []
  const { xRange, yRange } = range
  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      const path = getRealPathByPath(originTable, [x, y])
      if (path && !isIncludePath(realPaths, path)) {
        realPaths.push(path)
      }
    }
  }
  return realPaths
}

/**
 * 根据相对path获取真实path
 * @param relativePaths
 * @param tablePath
 */
function getRealPaths(relativePaths, tablePath) {
  return relativePaths.map(relativePath => [...tablePath, ...relativePath])
}

/**
 * 获取选区真实路径
 * @param editor
 * @param start
 * @param end
 * @param table
 * @returns
 */
export function getSelection(editor, start, end, table) {
  const tablePath = DomEditor.findPath(editor, table)
  const startPath = Path.relative(start, tablePath)
  const endPath = Path.relative(end, tablePath)

  const originTable = getOriginTable(table)
  const originRange = getAllOriginRange(originTable, startPath, endPath)

  const realRelativePaths = getRealRelativePaths(originTable, originRange)
  const realPaths = getRealPaths(realRelativePaths, tablePath)

  return realPaths
}
