<template>
<div>
  <HeaderBar />
  <div class="container">
    <div class="pay"><img src="../../assets/images/pay.jpeg" alt=""><div class="suppest">支持作者</div></div>
    <p>作者github地址：https://github.com/zhengguorong</p>
    <p>项目源码：https://github.com/zhengguorong/h5maker</p>
    <p>声明：项目开源免费，可自行下载源码部署使用，也可以通过网站在线生成，但是因为网站资源有限，可能访问速度会比较慢，如果你需要帮助或者应用到企业内部，可联系我微信（18664694721）进行有偿指导。</p>
  </div>
</div>
</template>

<script>
import HeaderBar from '../../components/HeaderBar'
export default {
  data () {
    return {

    }
  },
  components: {
    HeaderBar
  }
}
</script>

<style lang="less" scoped>
  .container {
    width: 700px;
    margin: 0 auto;
    padding-top:20px;
    .pay {
      margin: 0 auto;
      width: 300px;
      margin-bottom: 20px;
      .suppest {
        width: 100%;
        text-align: center;
      }
      img {
        width: 100%;
      }
    }
    p {
      line-height: 2;
    }
  }
</style>

