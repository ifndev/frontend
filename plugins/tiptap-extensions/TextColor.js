import { Mark, Plugin } from 'tiptap'
import { updateMark, removeMark, pasteRule } from 'tiptap-commands'
import { getMarkAttrs } from 'tiptap-utils'

export default class TextColor extends Mark {

  get name() {
    return 'textcolor'
  }

  get schema() {
    return {
      attrs: {
        style: {
          default: null,
        },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'span[style]',
          getAttrs: dom => ({
            style: dom.getAttribute('style'),
          }),
        },
      ],
      toDOM: node => ['span', {
        ...node.style,
      }, 0],
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.style) {
        return updateMark(type, attrs)
      }

      return removeMark(type)
    }
  }

}
