export default class Check {
  constructor (check = {}) {
    this.title = check.title || '选项'
    this.isDefault = check.isDefault || false
    this.imgPath = check.imgPath || ''
  }
}
