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
    title: '蓝月亮',
    description: '蓝月亮',
    canvasHeight: 504,
    musicLink: null,
    musicName: null
  }, // 正在编辑的主题
  picList: [], // 图片列表
  musicList: [], // 音乐列表
  musicPlaying: true, // 音乐播放
  defaultMusicList: [ // 默认音乐列表
    {style: '默认', choose: false, music: []},
    {style: '复古', choose: false, music: [{name: '古典回味', link: '/music/fugu/gudianhuiwei.mp3'}, {name: '诙谐轻快', link: '/music/fugu/huixieqingkuai.mp3'}]},
    {style: '节日', choose: false, music: []},
    {style: '大气', choose: false, music: []},
    {style: '治愈', choose: false, music: []},
    {style: '浪漫', choose: false, music: []},
    {style: '轻松', choose: false, music: []},
    {style: '商务', choose: false, music: []}
  ]
}

export default{
  state,
  getters,
  actions,
  mutations
}
