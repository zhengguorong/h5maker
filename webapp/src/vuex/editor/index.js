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
    musicName: null,
    musicStyle: '默认',
    uploadMusicList: []
  }, // 正在编辑的主题
  picList: [], // 图片列表
  musicList: [], // 音乐列表
  musicPlaying: false, // 音乐播放
  defaultMusicList: [ // 默认音乐列表
    {style: '默认', music: []},
    {style: '复古',
      music: [
        {name: '古典回味', link: '/music/fugu/gudianhuiwei.mp3'},
        {name: '诙谐轻快', link: '/music/fugu/huixieqingkuai.mp3'},
        {name: '回忆往事', link: '/music/fugu/huiyiwangshi.mp3'},
        {name: '轻松序曲', link: '/music/fugu/qingsongxuqu.mp3'}
      ]},
    {style: '节日',
      music: [
        {name: '柔和舒缓', link: '/music/jieri/rouheshuhuan.mp3'},
        {name: '青春舞曲', link: '/music/jieri/qingcunwuqu.mp3'},
        {name: '欢快和谐', link: '/music/jieri/huankuaihexie.mp3'},
        {name: '中国风情', link: '/music/jieri/zhongguofengqing.mp3'}
      ]},
    {style: '大气',
      music: [
        {name: '磅礴递进', link: '/music/daqi/pangbodijin.mp3'},
        {name: '紧张气氛', link: '/music/daqi/jinzhangqifen.mp3'},
        {name: '魔幻轻快', link: '/music/daqi/mohuanqingkuai.mp3'},
        {name: '宏伟激荡', link: '/music/daqi/hongweijidang.mp3'}
      ]},
    {style: '治愈',
      music: [
        {name: '清新早晨', link: '/music/zhiyu/qingxinzaocen.mp3'},
        {name: '梦想绽放', link: '/music/zhiyu/mengxiangzhanfang.mp3'},
        {name: '内心独白', link: '/music/zhiyu/neixindubai.mp3'},
        {name: '此刻启程', link: '/music/zhiyu/cikeqicheng.mp3'},
        {name: '寻找远方', link: '/music/zhiyu/xunzhaoyuanfang.mp3'},
        {name: '少女思念', link: '/music/zhiyu/shaonvxinsi.mp3'},
        {name: '阳光重现', link: '/music/zhiyu/yangguangchongxian.mp3'}
      ]},
    {style: '浪漫',
      music: [
        {name: '温馨点滴', link: '/music/langman/wenxindiandi.mp3'},
        {name: '浪漫回忆', link: '/music/langman/langmanhuiyi.mp3'},
        {name: '神圣时刻', link: '/music/langman/shenshengshike.mp3'},
        {name: '相守誓言', link: '/music/langman/xiangshoushiyan.mp3'}
      ]},
    {style: '轻快',
      music: [
        {name: '阳光海滩', link: '/music/qingkuai/yangguanghaitan.mp3'},
        {name: '加油打气', link: '/music/qingkuai/jiayoudaqi.mp3'}
      ]},
    {style: '商务',
      music: [
        {name: '繁忙日常', link: '/music/shangwu/fanmangrichang.mp3'},
        {name: '愉快工作', link: '/music/shangwu/yukuaigongzuo.mp3'},
        {name: '压力暴增', link: '/music/shangwu/yalibaozeng.mp3'},
        {name: '陷入迷茫', link: '/music/shangwu/xianrumimang.mp3'}
      ]}
  ]
}

export default{
  state,
  getters,
  actions,
  mutations
}
