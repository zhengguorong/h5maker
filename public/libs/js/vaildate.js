/**
 * Created by Wesdint on 2017/6/26.
 */
/**
 * 是否为email，options接收max、min参数
 */
const isEmail = (value, options) => {
  const rule = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  return rule.test(value) && isMatchLength(value, options)
}

/**
 * 是否为手机号
 */
const isMobile = (value) => {
  const rule = /^(((17[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(13[0-9]{1})|(18[0-9]{1}))+\d{8})$/
  return rule.test(value)
}

/**
 * 是否为数字
 */
const isNum = (value) => {
  const rule = /^[0-9]*$/
  return rule.test(value)
}

/**
 * 是否存在表情，options接收max、min参数
 */
const isEmoji = (substring, options) => {
  const rule = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return rule.test(substring) && isMatchLength(substring, options)
}

/**
 * 是否不为空
 */
const isNotNull = (value) => {
  return value && value.trim() !== ''
}

/**
 * 是否不为空，options接收max、min参数
 */
const isInteger = (value, options) => {
  const rule = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
  return rule.test(value) && isMatchLength(value, options)
}

/**
 * 是否匹配长度，options接收max、min参数
 */
const isMatchLength = (value, options) => {
  options = options || {}
  let maxCheck = !options.hasOwnProperty('max') || value.length <= Number(options.max)
  let minCheck = !options.hasOwnProperty('min') || value.length >= Number(options.min)
  return maxCheck && minCheck
}

const isIOS = () => {
  var ua = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(ua)
}

const isAndriod = () => {
  var ua = navigator.userAgent.toLowerCase()
  return /android/.test(ua)
}

const isMobilePhone = () => {
  return isIOS() || isAndriod()
}

var validateFuns = {
  isMobile,
  isEmail,
  isNum
}
;(function () {
  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = validateFuns
  } else {
    if (typeof define === 'function' && typeof define.amd) {
      define('validateFuns', [], function () {return validateFuns})
    }
  }
  if (typeof window === 'object' && typeof window.document === 'object') {
    window.validateFuns = validateFuns
  }
})()