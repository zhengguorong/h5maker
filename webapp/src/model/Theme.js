/**
 * Created by zhengguorong on 2016/11/24.
 */
export default class Theme {
  constructor (theme = {}) {
    this.title = theme.title || '标题'
    this.description = theme.description || '描述'
    this.pages = theme.pages || []
    this.type = theme.type || 'h5'
    this.canvasHeight = theme.canvasHeight || 504
    this.musicName = theme.musicName || null
    this.musicLink = theme.musicLink || null
    this.musicStyle = theme.musicStyle || '默认'
    this.uploadMusicList = theme.uploadMusicList || []
  }
}
