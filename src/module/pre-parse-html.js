import $, { getTagName } from '../utils/dom'

function preParse(tableElem) {
  const $table = $(tableElem)
  const tagName = getTagName(tableElem)
  if (tagName !== 'table') return tableElem

  // 没有<tbody>直接返回
  const $tbody = $table.find('tbody')
  if ($tbody.length === 0) return tableElem

  // 去掉 <tbody> 把 <tr> 移动到 <table> 下面
  const $tr = $table.find('tr')
  $table.append($tr)
  $tbody.remove()

  return $table[0]
}

export const preParseTableHtmlConf = {
  selector: 'ntable',
  preParseHtml: preParse,
}
