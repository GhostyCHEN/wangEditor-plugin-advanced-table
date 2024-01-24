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
// function deleteHandler(newEditor) {
//   const { selection } = newEditor
//   if(selection == null) return false

//   const [cellNodeEntry] = Editor.nodes(newEditor, {
//     match:n => DomEditor.checkNodeType(n, 'table-cell')
//   })

// }
