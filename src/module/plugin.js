import { withTable } from 'slate-table'

function withNTable(editor) {
  return withTable(editor, {
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
}

export default withNTable
