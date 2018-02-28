const all = {
    port: 9000,
    ip: process.env.ip || '0.0.0.0',
    secrets: {
        session: 'h5maker'
    },
    mongo: {
      uri: 'mongodb://120.77.178.209:27017/h5maker',
      user: 'root',
      pass: '3432395@wesdint'

    },
    userRoles: ['guest', 'user', 'admin']
}
module.exports = all