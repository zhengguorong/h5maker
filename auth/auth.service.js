/**
 * Created by zhengguorong on 16/11/2.
 * 用户权限认证方法
 *
 *  * Q&A
 * 为什么要使用composable-middleware,为了解决什么问题?
 *     他的作用是合并两个中间件,让其不需要在挂在在express实例上,例如expressJwt中间件是在执行后操作req对象,在req对象
 *     上加入user对象,但该中间件未提供回调方法,无法在验证后执行我们的代码,因此需要使用composable插件来完成两个中间件的
 *     合并.
 *     当然,你也可以像官方提供示例一样,router.get('/',jwtvalidate,function(req,res,next){req.user})获取结果,但是
 *     我的路由第三个参数主要执行数据库相关操作,不想引入验证逻辑,所以在第二个参数这里完成权限的认证.
 *
 */
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config = require('../config')
const compose = require('composable-middleware')
const User = require('../api/user/user.model')
const UserController = require('../api/user/user.controller')

const validateJwt = expressJwt({
    secret: config.secrets.session
})

/**
 * 验证用户是否有权限操作
 * @returns {function()}
 */
module.exports.isAuthenticated = () => {
    return compose()
        .use(function (req, res, next) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.query.access_token}`;
            }
            if(req.body && req.body.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.body.access_token}`;
            }
            // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            if (req.query && typeof req.headers.authorization === 'undefined') {
                req.headers.authorization = `Bearer ${req.cookies.token}`;
            }
            //验证是否服务端生成的token
            var token = req.headers.authorization.split('Bearer ')[1]
            UserController.findByToken(token).then((user) => {
                if (user) {
                    //验证token是否过期
                    validateJwt(req, res, next);
                }else{
                    return res.status(401).end();
                }
            })

        })
        // Attach user to request
        .use(function (req, res, next) {
            User.findById(req.user._id).exec()
                .then(user => {
                    if (!user) {
                        return res.status(401).end();
                    }
                    req.user = user;
                    next();
                })
                .catch(err => next(err));
        });
}

module.exports.hasRole = (roleRequired) => {
    if (!roleRequired) {
        throw new Error('必须输入身份名称');
    }

    return compose()
        .use(this.isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                return next();
            } else {
                return res.status(403).send('没有访问权限');
            }
        });
}

/**
 * 返回一个JWT TOKEN
 * @param id 用户ID
 * @param role 用户权限
 * @returns {*} JWT TOKEN
 */
module.exports.signToken = (id, role) => {
    return jwt.sign({_id: id, role}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
    })
}