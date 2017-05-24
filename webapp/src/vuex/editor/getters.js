export const editingElement = state => {
  return state['editorElement']
}

export const editingTheme = state => {
  return state['editorTheme']
}

export const editingPage = state => {
  return state['editorPage']
}

export const editingPageElements = state => {
  return state['editorPage']['elements']
}

export const elements = (state, getter) => {
  let pages = getter['editingTheme']['pages']
  if (pages) {
    let result = []
    pages.forEach(v => {
      v['elements'] && v['elements'].forEach(v => {
        result.push(v)
      })
    })
    return result
  } else {
    return null
  }
}
