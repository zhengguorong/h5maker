<template>
  <div class="container">
    <div class="question">
      <div class="title"><span class="must">*</span>1. 你的兴趣是什么</div>
      <div class="result">
        <el-input placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="split"></div>
    <div class="action-bar">
       <el-button icon="check" :plain="true" size="small" type="warning">完成</el-button>
       <!--<el-button icon="edit" :plain="true" size="small" type="info">编辑</el-button>-->
       <el-button icon="document" :plain="true" size="small" type="info">复制</el-button>
       <el-button icon="delete" :plain="true" size="small" type="info">删除</el-button>
       <el-button icon="arrow-up" :plain="true" size="small" type="info">上移</el-button>
       <el-button icon="arrow-down" :plain="true" size="small" type="info">下移</el-button>
       <el-button icon="d-arrow-left" :plain="true" size="small" type="info">最前</el-button>
       <el-button icon="d-arrow-right" :plain="true" size="small" type="info">最后</el-button>
    </div>
    <div class="editor-panel">
      <div class="row">
        <div class="item">
          <span class="title">问题标题</span>
          <el-input class="input"></el-input>
        </div>
        <div class="item">
          <el-checkbox>填写提示</el-checkbox>
          <el-input class="input"></el-input>
        </div>
        <div class="item">
          <el-checkbox>必填项</el-checkbox>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="title">答案类型</span>
            <el-select class="input" v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </div>
        <div class="item">
          <span class="title">最小字数</span>
          <el-input-number></el-input-number>
        </div>
        <div class="item">
          <span class="title">最多字数</span>
          <el-input-number></el-input-number>
        </div>
      </div>
      <el-button style="width:100%" type="primary">完成编辑</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [
        {value: '手机', label: '手机'}
      ],
      value: ''
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    padding: 10px;
  }
  .container:hover,.container.active {
    border: 2px solid #2B71C2;
  }
  .question {
    .title {
      font-size: 15px;
      .must {
        color: red;
        font-weight: bold;
        padding-right: 5px;
      }
    }
    .result {
      width: 200px;
      margin: 15px 25px;
    }
  }
  .split {
    border-bottom: 1px solid #EFEFEF;
  }
  .action-bar {
    text-align: right;
    line-height: 45px;
  }
  .editor-panel {
    padding: 15px;
    background: #F0F2FF;
    border-radius: 8px;
    overflow: hidden;
    .row {
      overflow: hidden;
      margin-bottom:20px;
      .item {
        float: left;
        margin-right: 50px;
        line-height: 36px;
      }
      .title {
        font-size: 14px;
        color: #475669;
      }
      .input {
        width: 195px;
        padding-left: 15px;
      }
      .el-input-number {
        vertical-align: middle;
        width: 150px;
        padding-left: 15px;
      }
    }
  }
</style>
