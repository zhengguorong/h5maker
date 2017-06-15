export default class Form {
  constructor (form = {}) {
    this.title = form.title || '标题'
    this.description = form.description || '描述'
    this.questions = form.questions || []
  }
}
