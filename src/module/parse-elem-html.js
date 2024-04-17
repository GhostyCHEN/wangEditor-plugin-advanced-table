import { Descendant, Text } from 'slate'
import { DomEditor } from '@wangeditor/editor'
import $, { getTagName, getStyleValue } from '../utils/dom'

function parseCellHtml(elem, children, editor) {
  const $elem = $(elem)
  // children = children.filter(child => {
  //   if (Text.isText(child)) return true
  //   if (editor.isInline(child)) return true
  //   return false
  // })

  // // 若无children，则用纯文本
  // if (children.length === 0) {
  //   children = [{ text: $elem.text().replace(/\s+/gm, ' ') }]
  // }

  const colSpan = parseInt($elem.attr('colSpan') || '1')
  const rowSpan = parseInt($elem.attr('rowSpan') || '1')
  return {
    type: 'xtable-cell',
    colSpan,
    rowSpan,
    children,
  }
}

export const parseCellHtmlConf = {
  selector: 'td:not([data-w-e-type]),th:not([data-w-e-type])', // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseCellHtml,
}

function parseRowHtml(elem, children, editor) {
  return {
    type: 'xtable-row',
    children: children.filter(child => DomEditor.getNodeType(child) === 'xtable-cell'),
  }
}

export const parseRowHtmlConf = {
  selector: 'tr:not([data-w-e-type])',
  parseElemHtml: parseRowHtml,
}

function parseTableHtml(elem, children, editor) {
  return {
    type: 'xtable',
    children: children.filter(child => DomEditor.getNodeType(child) === 'xtable-row'),
  }
}

export const parseTableHtmlConf = {
  selector: 'table:not([data-w-e-type])',
  parseElemHtml: parseTableHtml,
}
