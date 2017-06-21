import Question from './Question'
export default class FileQuestion extends Question {
  constructor (question = {}) {
    super(question)
    this.qsType = question.qsType || 'file' // 问题类型
    this.count = question.count || 1 // 数量限制
  }
}
