import * as types from './mutation-type'
import api from '../../api/editor'
import Page from '../../model/Page'
import Theme from '../../model/Theme'
import Element from '../../model/Element'
import tools from '../../util/tools'

/**
 * 保存页面数据
 */
export const saveTheme = ({commit}, theme) => {
  if (theme && theme._id) {
    return Promise.resolve(api.updateTheme(theme).then((res) => {
      commit(types.UPDATE_THEME_SUCCESS, res)
    }))
  } else {
    return Promise.resolve(api.saveTheme(theme).then((res) => {
      commit(types.ADD_THEME_SUCCESS, res)
    }))
  }
}

/**
 * 获取用户所有场景主题
 * @param commit
 */
export const getUserThemeList = ({commit}, type) => {
  api.getUserThemeList(type).then((res) => {
    commit(types.GET_USER_THEME_LIST, res)
  })
}

/**
 * 创建场景主题
 * @param commit
 */

export const createTheme = ({commit}, type) => {
  var theme = new Theme({type: type})
  commit(types.CREATE_THEME, theme)
  commit(types.SET_CUR_EDITOR_THEME, theme)
}

/**
 * 设置当前编辑的主题
 */
export const setEditorTheme = ({commit}, theme) => {
  var newTheme = new Theme(theme)
  commit(types.SET_CUR_EDITOR_THEME, newTheme)
}

/**
 * 设置当前正在编辑的页面
 * @param commit
 * @param page
 */
export const setEditorPage = ({commit}, page) => {
  commit(types.SET_CUR_EDITOR_PAGE, page)
}

/**
 * 给主题添加页面
 * @param commit
 */
export const addPage = ({commit}) => {
  var page = new Page()
  commit(types.ADD_PAGE, page)
  commit(types.SET_CUR_EDITOR_PAGE, page)
}

/**
 * 添加页面元素
 */
export const addElement = ({commit, state}, data) => {
  commit(types.ADD_PIC_ELEMENT, new Element(data))
  var list = state.editorPage.elements
  var lastIndex = list.length - 1
  list[lastIndex]['zindex'] = lastIndex ? list[lastIndex - 1]['zindex'] + 1 : 1
  commit(types.SET_CUR_EDITOR_ELEMENT, state.editorPage.elements[lastIndex])
}

/**
 * 添加背景图片
 */
export const addBGElement = ({commit}, data) => {
  var element = new Element(data)
  commit(types.SET_BG_ELEMENT, element)
  commit(types.SET_CUR_EDITOR_ELEMENT, null)
}

/**
 * 保存图片
 * @param commit
 * @param data
 */
export const savePic = ({commit}, data) => {
  commit(types.PUSH_PIC_LIST, data)
}

/**
 * 保存视频
 * @param commit
 * @param data
 */
export const saveVideo = ({commit}, data) => {
  commit(types.PUSH_VIDEO_LIST, data)
}
/**
 * 清除背景
 * @param commit
 */
export const cleanBG = ({commit}) => {
  commit(types.CLEAN_BG)
}

export const cleanEle = ({commit}, ele) => {
  commit(types.CLEAN_ELE, ele)
}
/**
 * 复制页面
 * @param commit
 */
export const copyPage = ({commit}, data) => {
  var page = tools.vue2json(data)
  commit(types.ADD_PAGE, page)
}

/**
 * 删除页面
 * @param commit
 */
export const delPage = ({commit}, page) => {
  commit(types.DELETE_PAGE, page)
}

export const getPageByThemeId = ({dispatch, commit}, id) => {
  api.getPageByThemeId(id).then((res) => {
    commit(types.SET_CUR_EDITOR_THEME, res)
    commit(types.SET_CUR_EDITOR_PAGE, res.pages[0])
  }).then(() => {
    dispatch('sortElementsByZindex')
  })
}

export const setEditorElement = ({commit}, element) => {
  commit(types.SET_CUR_EDITOR_ELEMENT, element)
}

// 删除元素
export const deleteElement = ({commit}, element) => {
  commit(types.DELETE_ELEMENT, element)
}

export const deleteSelectedElement = ({commit, state}) => {
  commit(types.DELETE_ELEMENT, state.editorElement)
}

export const playAnimate = ({state, commit, getters}) => {
  commit(types.PLAY_ANIMATE)
  let target = getters['editingElement'] || getters['editingPageElements'] || null
  let time = 0
  if (target instanceof Array) {
    target.forEach(v => {
      time = v['animatedName'] && (v['duration'] + v['delay']) > time ? (v['duration'] + v['delay']) : time
    })
  } else if (target instanceof Object) {
    time = (target['duration'] + target['delay'])
  }
  setTimeout(() => {
    commit(types.STOP_ANIMATE, target)
  }, time * 1000)
}

export const getPicListByThemeId = ({commit}, _id) => {
  api.getPicListByThemeId(_id).then((res) => {
    commit(types.FETCH_PIC_LIST, res)
  })
}
export const getVideoListByThemeId = ({commit}, _id) => {
  api.getVideoListByThemeId(_id).then((res) => {
    commit(types.FETCH_VIDEO_LIST, res)
  })
}

export const cleanPicList = ({commit}) => {
  commit(types.CLEAN_PIC_LIST)
}

export const sortElementsByZindex = ({commit}, location) => {
  commit(types.SORTELEMENTS_BY_ZINDEX, location)
}

export const deleteTheme = ({commit}, theme) => {
  return Promise.resolve(api.delTheme(theme).then((res) => {
    commit(types.DELETE_THEME, theme)
  }))
}

