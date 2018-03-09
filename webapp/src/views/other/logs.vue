<template>
<div>
  <HeaderBar />
  <div class="container">
    <ol>
      <p>版本：v1.2.0</p>
      <li>修复相关bug，清理了答卷数据</li>
      <li>优化了答卷图片上传和删除交互</li>
      <li>优化了问卷编辑逻辑</li>
      <li>ps：2018/03/09 16:00 之前的答卷数据已被清除，如需找回，请联系 zengwendong@bluemoon.com.cn</li>
      <li>加入图片单页功能</li>
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

