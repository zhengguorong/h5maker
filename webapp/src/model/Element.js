/**
 * Created by zhengguorong on 2016/11/21.
 */
export default class Element {
  constructor (ele = {}) {
    this.type = ele.type || 'pic'
    this.imgSrc = ele.imgSrc || ''
    this.videoSrc = ele.videoSrc || ''
    this.left = ele.left || 0
    this.top = ele.top || 0
    this.width = ele.width || 0
    this.height = ele.height || 0
    this.lineHeight = ele.lineHeight || 0
    this.animatedName = ele.animatedName || ''
    this.duration = ele.duration || 1
    this.delay = ele.delay || 0
    this.playing = false
    this.loop = false
    this.opacity = ele.opacity || 100
    this.transform = ele.transform || 0
    this.text = ele.text || ''
    this.textAlign = ele.textAlign || 'left'
    this.iconKey = ele.iconKey || ''
    this.bg = ele.bg || ''
    this.fontSize = ele.fontSize || 18
    this.fontFamily = ele.fontFamily || '微软雅黑'
    this.fontWeight = ele.fontWeight || 'normal'
    this.color = ele.color || '#000000'
    this.zindex = ele.zindex || 1
  }
}
