<template>
  <div class="header">
    <div class="container">
      <a href="">
        <div class="logo">
          <img src="../assets/images/logo.jpg"
               alt="">
        </div>
      </a>
      <div class="nav">
        <ul>
          <li :class="{'active': item.active}" v-for="item in navList" @click="select(item)">
            <div>{{item.name}}</div>
          </li>
        </ul>
      </div>
      <div class="logout">
        <div class="username">{{loginId}}</div>
        <el-button @click="logout" class="logout-btn">注销</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      navList: [{
        path: 'themeList',
        name: 'h5作品',
        active: false
      }, {
        path: 'spaList',
        name: '单页作品',
        active: false
      }, {
        path: 'about',
        name: '开源声明',
        active: false
      }
      ],
      loginId: window.localStorage.getItem('loginId')
    }
  },
  methods: {
    select (item) {
      this.$router.push(item.path)
    },
    logout () {
      this.$store.dispatch('logout')
        .then(res => {
          this.$router.push('login')
        })
    }
  },
  mounted () {
    this.navList.forEach((element) => {
      if (element.path === this.$route.name) {
        element.active = true
      } else if (this.$route.name === 'index') {
        this.navList[0].active = true
      }
    })
  }
}
</script>
<style lang="less">
.header {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.header .container {
  margin: 0 auto;
  width: 1024px;
  text-align: center;
}
.logout {
  float: right;
  display: flex;
  align-items: center;
  height: 65px;
  .username {
    margin-right: 10px;
  }
}

.header .logo img {
  float: left;
  height: 50px;
}

.header .nav {
  float: left;
  padding-left: 50px;
}

.header .nav li {
  float: left;
  width: 110px;
  line-height: 52px;
  border-top: solid 5px rgba(0, 0, 0, 0);
  text-align: center;
  list-style: none;
}

.header .nav li.active {
  border-top: solid 5px #0059f1;
}

.header .nav li div {
  height: 60px;
  font-size: 16px;
  color: #000;
  cursor: pointer;
}

.header .nav li.active div {
  color: #0059f1;
}
</style>
