import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  editorElement: {}, // 正在编辑的元素
  editorPage: {
    elements: []
  }, // 正在编辑的页面
  themeList: [], // 用户所有主题列表
  editorTheme: {
    title: '',
    description: '',
    canvasHeight: 504
  }, // 正在编辑的主题
  picList: [], // 图片列表
  videoList: [] // 视频列表
}

export default{
  state,
  getters,
  actions,
  mutations
}
