import * as types from './mutation-type'
import api from '../../api/editor'
import Page from '../../model/Page'
import Theme from '../../model/Theme'
import Element from '../../model/Element'
import tools from '../../util/tools'
import appConst from '../../util/appConst'
import Vue from 'vue'

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
  return api.getUserThemeList(type).then((res) => {
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
export const savePic = ({commit}, {imgData, themeId, width, height, type}) => {
  return api.uploadPic({imgData, themeId, width, height}).then((res) => {
    // commit(types.SAVE_PIC, res)
    setTimeout(() => {
      if (type === 'elementImg') {
        commit(types.PUSH_PIC_LIST, res)
      } else {
        commit(types.PUSH_BG_LIST, res)
      }
    }, 500)
  })
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
  return api.getPageByThemeId(id).then((res) => {
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

export const cleanPicList = ({commit}) => {
  commit(types.CLEAN_PIC_LIST)
}

export const cleanBgList = ({commit}) => {
  commit(types.CLEAN_BG_LIST)
}
export const sortElementsByZindex = ({commit}, location) => {
  commit(types.SORTELEMENTS_BY_ZINDEX, location)
}

export const deleteTheme = ({commit}, theme) => {
  return Promise.resolve(api.delTheme(theme).then((res) => {
    commit(types.DELETE_THEME, theme)
  }))
}

// 上传音乐
export const uploadMusic = ({commit, state}, file) => {
  let upload = true
  if (!/^audio/.test(file.type)) {
    Vue.prototype.$message('请上传正确的音乐格式！')
    return
  }
  state.defaultMusicList[0].music.map(music => {
    if (file.name === music.name) {
      Vue.prototype.$message('不能上传同样的音乐')
      upload = false
      return
    }
  })
  if (upload) {
    let form = new window.FormData()
    form.append('inputFile', file)
    form.append('themeId', state.editorTheme._id)
    api.uploadPic(form).then((res) => {
      commit(types.PUSH_MUSIC_LIST, {name: res.fileName, link: res.filePath})
      commit(types.PUSH_DEFAULT_MUSIC_LIST, {name: res.fileName, link: res.filePath})
    })
  }
}

// 更新音乐播放状态
export const updateMusicStatus = ({commit}, data) => {
  commit(types.UPDATE_MUSIC_LIST_PLAYING, data)
  commit(types.UPDATE_MUSIC_PLAYING, data.isPlaying)
}

// 删除音乐
export const delMusic = ({state, commit}, {list, index}) => {
  if (index > -1) {
    commit(types.UPDATE_MUSIC_LIST, index)
    commit(types.UPDATE_DEFAULT_MUSIC_LIST, index)
  }
  if (list.musicName || list.name === state.editorTheme.musicName) {
    commit(types.UPDATE_MUSIC_PLAYING, false)
    commit(types.UPDATE_THEME_MUSIC, {musicName: null, musicLink: null, musicStyle: '默认'})
  }
}

// 保存音乐
export const saveMusic = ({dispatch, commit, state}, defaultMusicStyle) => {
  commit(types.UPDATE_MUSIC_PLAYING, false)
  dispatch('updateMusicListStatus', defaultMusicStyle)
  commit('SET_THEME_MUSIC_LIST', state.defaultMusicList[0].music)
}

// 切换音乐风格
export const toggleDefaultMusicList = ({dispatch, commit}, {list, defaultMusicStyle}) => {
  commit('CLEAN_MUSIC_LIST')
  list.music.map(item => {
    commit('PUSH_MUSIC_LIST', item)
  })
  dispatch('updateMusicListStatus', defaultMusicStyle)
}

// 播放音乐栏
export const playMusic = ({dispatch, state}, defaultMusicStyle) => {
  if (!state.editorTheme.musicName) return
  if (state.editorTheme.musicStyle !== defaultMusicStyle) {
    dispatch('toggleMusic', -1)
    return
  }
  state.musicList.map((item, itemIndex) => {
    if (state.editorTheme.musicName === item.name) {
      dispatch('toggleMusic', itemIndex)
      return
    }
  })
}

// 播放音乐列表
export const playMusicList = ({dispatch, state, commit}, {list, index, defaultMusicStyle}) => {
  if (list.name !== state.editorTheme.musicName) {
    commit(types.UPDATE_THEME_MUSIC, {musicName: list.name, musicLink: appConst.BACKEND_DOMAIN + list.link, musicStyle: defaultMusicStyle})
    return true
  } else {
    dispatch('toggleMusic', index)
    return false
  }
}

// 初始化音乐
export const initMusic = ({dispatch, commit, state}, defaultMusicStyle) => {
  commit('CLEAN_MUSIC_LIST')
  commit('SET_DEFAULT_MUSIC_LIST', state.editorTheme.uploadMusicList)
  state.defaultMusicList.map(list => {
    if (list.style === state.editorTheme.musicStyle) {
      dispatch('toggleDefaultMusicList', {list, defaultMusicStyle})
      return
    }
  })
}

// 更新音乐列表状态
export const updateMusicListStatus = ({state, commit}, defaultMusicStyle) => {
  if (state.musicList.length > 0 && defaultMusicStyle === state.editorTheme.musicStyle) {
    state.musicList.map((item, itemIndex) => {
      if (state.editorTheme.musicName === item.name) {
        commit(types.UPDATE_MUSIC_LIST_PLAYING, {index: itemIndex, isPlaying: state.musicPlaying})
        return
      }
    })
  }
}

export const toggleMusic = ({dispatch, state}, itemIndex) => {
  if (state.musicPlaying) { // 暂停
    dispatch('updateMusicStatus', {index: itemIndex, isPlaying: false})
  } else { // 播放
    dispatch('updateMusicStatus', {index: itemIndex, isPlaying: true})
  }
}
