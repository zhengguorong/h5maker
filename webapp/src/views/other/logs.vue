<template>
<div>
  <HeaderBar />
  <div class="container">
    <ol>
      <p>版本：v1.1.0</p>
      <li>加入图片单页功能</li>
      <p>版本：v1.0.0</p>
      <li>修复编辑器元素等比缩放功能</li>
      <li>修复单页应用高度适应问题</li>
      <li>修复图片上传刷新后消失问题</li>
      <p>版本：v0.9.0</p>
      <li>加入问卷功能</li>
    </ol>
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
    text-align: left;
    p {
      line-height: 2;
    }
    li {
      padding: 5px;
      list-style-type: square;
      font-size: 13px;
    }
  }
</style>

