<template>
  <div class="container">
    <div class="login-main">
      <div class="login-title">
        h5页面生成器
      </div>
      <div class="content">
        <el-form :model="loginForm" ref="loginForm" :rules="loginRule">
          <div class="error-info" v-if="loginResult">
            <div><i class="el-icon-warning"></i><span>{{loginResult}}</span></div>
          </div>
          <el-form-item prop="loginId">
            <el-input class="login-id" type="text" v-model="loginForm.loginId" placeholder="帐号(邮箱或者手机号)"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="password" type="password" v-model="loginForm.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:30%" :plain="true" type="success" @click.native.prevent="register">注册</el-button>
            <el-button style="width:65%;float:right" type="primary" class="login-btn" @click.native.prevent="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loginForm: {
          loginId: '',
          password: ''
        },
        loginRule: {
          loginId: [
            {required: true, message: '请输入邮箱或手机号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      // 初始化错误提示
      this.$store.commit('SET_ERROR_INFO', '')
    },
    computed: {
      loginResult () {
        return this.$store.state.user.loginResult
      }
    },
    methods: {
      login (ev) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('login', {loginId: this.loginForm.loginId, password: this.loginForm.password})
          } else {
            return false
          }
        })
      },
      register () {
        window.location.href = '#register'
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background-image: url('../../assets/login-bg.jpg');
    background-size: auto;
    min-height: calc(100vh);
  }

  .error-info {
    text-align: left;
    background: #ffeeed;
    padding: 7px 9px 7px;
    margin: 0 0 10px;
    border-radius: 6px;
    line-height: 1.5;
    color: #666;
    font-size: 12px;
    i {
      color: #f60;
    }
    span {
      padding-left: 10px;
    }
  }

  .login-main {
    width: 450px;
    margin: 0 auto;
    background-color: #fff;
    position: relative;
    top: 100px;
  }

  .login-title {
    margin: 0;
    padding: 30px 20px 26px;
    text-align: center;
    font-size: 18px;
  }

  .content {
    padding: 0 25px 10px;
  }

  .form-item {
    line-height: 1.5;
    margin-bottom: 17px;
  }

  .login-btn {
    width: 100%;
  }
</style>
