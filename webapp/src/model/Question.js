export default class Question {
  constructor (question = {}) {
    this.title = question.title || '请输入问题内容' // 问题标题
    this.desc = question.desc || 0  // 问题排序
    this.isMust = question.isMust || false // 问题是否为必填
    this.tips = question.tips || '' // 问题提示
    this.isTips = question.isTips || false // 是否需要提示
    this.isActive = question.isActive || false // 是否正在编辑
  }
}
