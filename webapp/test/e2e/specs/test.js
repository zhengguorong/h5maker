// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  '登录页面测试': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL
    const loginUrl = devServer + '/#/login'

    browser
      .url(loginUrl)
      .waitForElementVisible('#app', 5000, '页面成功初始化')
      .click('.login-btn')
      .waitForElementVisible('.login-id + div', 3000, '用户名提示元素正常出现')
      .waitForElementVisible('.password + div', 3000, '密码提示元素正常出现')
      .assert.containsText('.login-id + div', '请输入邮箱或手机号', '用户名空时提示请输入邮箱或手机号')
      .assert.containsText('.password + div', '请输入密码', '密码为空时提示请输入密码')
      .setValue('.login-id input', 'zgr')
      .setValue('.password input', '123456')
      .click('.login-btn')
      .waitForElementNotPresent('.login-id + div', 3000, '用户名不为空时，提示信息消失')
      .waitForElementNotPresent('.password + div', 3000, '密码不为空时，提示信息消失')
      .end()
  }
}
