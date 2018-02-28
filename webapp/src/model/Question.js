export default class Question {
  constructor (question = {}) {
    this.title = question.title || '' // 问题标题
    this.desc = question.desc || 0  // 问题排序
    this.isMust = question.isMust || false // 问题是否为必填
    this.tips = question.tips || '' // 问题提示
    this.isTips = question.isTips || false // 是否需要提示
    this.isActive = question.isActive || false // 是否正在编辑
    this.qsId = Date.now() // 题目id
    this.isExist = true // 是否被删除
    this.isNew = true
  }
}
