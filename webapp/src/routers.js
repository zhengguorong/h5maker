/**
 * Created by zhengguorong on 16/11/3.
 */
export default [{
  path: '/',
  name: 'index',
  component: require('./views/h5editor/themeList.vue')
}, {
  path: '/login',
  name: 'login',
  component: require('./views/user/login')
}, {
  path: '/register',
  name: 'register',
  component: require('./views/user/register')
}, {
  path: '/h5editor',
  name: 'h5editor',
  component: require('./views/h5editor/index.vue')
}, {
  path: '/spaeditor',
  name: 'spaeditor',
  component: require('./views/spaeditor/index.vue')
}, {
  path: '/themeList',
  name: 'themeList',
  component: require('./views/h5editor/themeList.vue')
}, {
  path: '/spaList',
  name: 'spaList',
  component: require('./views/spaeditor/themeList.vue')
}, {
  path: '/about',
  name: 'about',
  component: require('./views/user/about.vue')
}, {
  path: '/test',
  name: 'test',
  component: require('./views/user/test.vue')
}]
