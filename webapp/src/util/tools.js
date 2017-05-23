const vue2json = (vue) => {
  if (vue) {
    return JSON.parse(JSON.stringify(vue))
  }
}
export default {
  vue2json
}
