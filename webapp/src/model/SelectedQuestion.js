import Question from './Question'
import Check from './Check'
export default class SelectedQuestion extends Question {
  constructor (question = {}) {
    super(question)
    this.qsType = question.qsType || 'check' // 问题类型
    this.askList = question.askList || [new Check()]// 选项列表
  }
}
