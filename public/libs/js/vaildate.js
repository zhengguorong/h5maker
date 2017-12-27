/**
 * Created by Wesdint on 2017/6/26.
 */
/**
 * 是否为email，options接收max、min参数
 */
var isEmail = function(value, options) {
  var rule = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  return rule.test(value) && isMatchLength(value, options)
}

/**
 * 是否为手机号
 */
var isMobile = function(value) {
  var rule = /^(((17[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(13[0-9]{1})|(18[0-9]{1}))+\d{8})$/
  return rule.test(value)
}

/**
 * 是否为数字
 */
var isNum = function(value) {
  var rule = /^[0-9]*$/
  return rule.test(value)
}

/**
 * 是否存在表情，options接收max、min参数
 */
var isEmoji = function(substring, options) {
  var rule = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return rule.test(substring) && isMatchLength(substring, options)
}

/**
 * 是否不为空
 */
var isNotNull = function(value) {
  return value && value.trim() !== ''
}

/**
 * 是否不为空，options接收max、min参数
 */
var isInteger = function(value, options) {
  var rule = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
  return rule.test(value) && isMatchLength(value, options)
}

/**
 * 是否匹配长度，options接收max、min参数
 */
 var isMatchLength = function(value, options) {
   options = options || {}
   var maxCheck = !options.hasOwnProperty('max') || value.length <= Number(options.max)
   var minCheck = !options.hasOwnProperty('min') || value.length >= Number(options.min)
   return maxCheck && minCheck
 }

var isIOS = function() {
  var ua = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(ua)
}

var isAndriod = function() {
  var ua = navigator.userAgent.toLowerCase()
  return /android/.test(ua)
}

var isMobilePhone = function(){
  return isIOS() || isAndriod()
}

var funDict = {
  'phone': 'isMobile',
  'email': 'isEmail',
  'num': 'isNum'
}
var validateFuns = {
  isMobile: isMobile,
  isEmail: isEmail,
  isNum: isNum,
  funDict: funDict
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
