const vue2json = (vue) => {
  if (vue) {
    return JSON.parse(JSON.stringify(vue))
  }
}

// 深拷贝(未兼容支持类型化数组)
const deepClone = (obj) => {
  if (obj == null || typeof obj !== 'object') {
    return obj
  }
  switch (Object.prototype.toString.call(obj)) {
    case '[object Array]' : {
      const result = new Array(obj.length)
      for (let i = 0; i < result.length; i++) {
        result[i] = deepClone(obj[i])
      }
      return result
    }
    case '[object Object]': {
      const keys = Object.keys(obj)
      const result = {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        result[key] = deepClone(obj[key])
      }
      return result
    }
    case '[object Date]':
    case '[object RegExp]':
    case '[object Map]':
    case '[object Set]':
      return new obj.constructor(obj)
    default: {
      throw new Error('not support')
    }
  }
}

export default {
  vue2json,
  deepClone
}
