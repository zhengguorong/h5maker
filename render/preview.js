var Pages = require('../api/pages/pages.model')
var pageController = require('../controller/pages.controller')

const render = (req, res) => {
    const id = req.params.id
    if (id) {
        pageController.findById(id)
        .then(function (entity) {
            res.render('template', entity);
        })
        .catch ((err) => {
            res.render('error',{message: '找不到数据', error: err})
        })
    }else {
        res.render('error',{message: '请加入查询ID', error: {}})
    }

}
module.exports = render