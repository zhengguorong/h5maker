if (process.env.NODE_ENV === 'production') {
    module.exports = require('./index.pro.js')
} else if(process.env.NODE_ENV === 'development') {
    module.exports = require('./index.dev.js')
} else {
    module.exports = require('./index.local.js')
}