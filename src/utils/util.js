import { nanoid } from 'nanoid'

export function genRandomStr(prefix = 'r') {
  return `${prefix}-${nanoid()}`
}
