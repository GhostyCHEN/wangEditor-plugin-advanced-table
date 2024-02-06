import isEqual from 'lodash.isequal'
import { Editor, Element, Transforms, Range, Node } from 'slate'
import { ADD_COL_SVG } from '../../constants/svg'
import { DomEditor } from '@wangeditor/editor'

class InsertCol {
  constructor() {
    this.title = '插入列'
    this.iconSvg = ADD_COL_SVG
    this.tag = 'button'
  }
}

export default InsertCol
