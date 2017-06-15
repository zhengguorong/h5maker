<template>
  <div class="container">
    <HeaderEdit :goback="save" />
    <div class="main">
        <div class="tool-bar">
          <div><i class="el-icon-circle-check"></i>单选</div>
          <div><i class="el-icon-circle-check"></i>多选</div>
          <div><i class="el-icon-edit"></i>单项填空</div>
        </div>
        <div class="editor">
          <div class="title">问卷标题</div>
          <p class="description">欢迎参加我们的在线课程，请填写下面的题目，方便我们为您服务！欢迎参加我们的在线课程，请填写下面的题目，方便我们为您服务！欢迎参加我们的在线课程，请填写下面的题目，方便我们为您服务！欢迎参加我们的在线课程，请填写下面的题目，方便我们为您服务！</p>
          <div class="form">
            <TextInput/>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import HeaderEdit from '../../components/HeaderEdit'
import TextInput from './textInput'
export default {
  data () {
    return {}
  },
  methods: {
    save () {
      this.$router.replace('formList')
    }
  },
  components: {
    HeaderEdit, TextInput
  }
}
</script>

<style lang="less" scoped>
  .container {
    height: 100%
  }
  .main {
    width: 1024px;
    margin: 10px auto;
    background: #fff;
    .tool-bar {
      height: 45px;
      background: #2B71C2;
      div {
        float: left;
        font-size: 14px;
        line-height: 45px;
        padding-right: 20px;
        cursor: pointer;
        color: #fff;
        i {
          padding: 0 10px;
        }
      }
      div:hover {
        background: #fff;
        color: #2B71C2;
        border: 1px solid #2B71C2;
      }
    }
    .editor {
      padding:20px 50px;
      .title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      }
      .description {
        font-size: 16px;
        padding:18px 0 22px 0;
        border-bottom: 1px dashed #979797;
        line-height: 1.5;
      }
    }
  }
</style>
