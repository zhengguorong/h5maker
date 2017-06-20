import Question from './Question'
export default class TextQuestion extends Question {
  constructor (question = {}) {
    super(question)
    this.validate = question.validate || 'text' // 回答验证类型
    this.qsType = question.qsType || 'text' // 问题类型
    this.minLength = question.minLength || 0 // 答案最少字数
    this.maxLenth = question.maxLenth || 0 // 答案最多字数
  }
}
