<template>
  <div class="container" @click.stop="setActive" :class="{active: question.isActive}">
    <div class="question">
      <div class="title">
        <span class="must" v-if="question.isMust">*</span>{{index + 1}}. {{question.title}}</div>
      <div class="result">
        <div class="upload">
          <i class="el-icon-upload2"/>
        </div>
        <div class="tips" v-if="question.tips">
          提示：{{question.tips}}
        </div>
      </div>
    </div>
    <div class="split"></div>
    <div class="action-bar">
      <el-button v-show="question.isActive" @click.stop="save" icon="check" :plain="true" size="small" type="warning">完成</el-button>
      <el-button v-show="!question.isActive" icon="edit" :plain="true" size="small" type="info">编辑</el-button>
      <el-button @click.stop="copyQuestion" icon="document" :plain="true" size="small" type="info">复制</el-button>
      <el-button @click="deleteQuestion" icon="delete" :plain="true" size="small" type="info">删除</el-button>
      <el-button @click.stop="moveUpQuestion" icon="arrow-up" :plain="true" size="small" type="info">上移</el-button>
      <el-button @click.stop="moveDownQuestion" icon="arrow-down" :plain="true" size="small" type="info">下移</el-button>
      <el-button @click.stop="moveTopQuestion" icon="d-arrow-left" :plain="true" size="small" type="info">最前</el-button>
      <el-button @click.stop="moveBottomQuestion" icon="d-arrow-right" :plain="true" size="small" type="info">最后</el-button>
    </div>
    <div class="editor-panel"  v-show="question.isActive">
      <div class="row">
        <div class="item">
          <span class="title">问题标题</span>
          <el-input class="input" v-model="question.title"></el-input>
        </div>
        <div class="item">
          <el-checkbox v-model="question.isTips">填写提示</el-checkbox>
          <el-input :disabled="!question.isTips" class="input" v-model="question.tips"></el-input>
        </div>
        <div class="item">
          <el-checkbox v-model="question.isMust">必填项</el-checkbox>
        </div>
      </div>
      <div class="row">
        <div class="item">
          <span class="title">数量限制</span>
          <el-input-number v-model="question.count"></el-input-number>
        </div>
      </div>
      <el-button @click.stop="save" style="width:100%" type="primary">完成编辑</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['question', 'index'],
  data () {
    return {
    }
  },
  methods: {
    setActive () {
      if (this.question.isActive === true) return
      this.$store.commit('form/activeQuestion', this.index)
    },
    save () {
      this.$store.commit('form/disActiveQuestion', this.index)
      this.$store.commit('form/saveQuestion', { question: this.question, index: this.index })
    },
    copyQuestion () {
      this.$store.commit('form/copyQuestion', this.index)
    },
    moveUpQuestion () {
      this.$store.commit('form/moveUpQuestion', this.index)
    },
    moveDownQuestion () {
      this.$store.commit('form/moveDownQuestion', this.index)
    },
    moveTopQuestion () {
      this.$store.commit('form/moveTopQuestion', this.index)
    },
    moveBottomQuestion () {
      this.$store.commit('form/moveBottomQuestion', this.index)
    },
    deleteQuestion () {
      this.$store.commit('form/deleteQuestion', this.index)
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    padding: 10px;
    margin: 20px 0px;
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
      margin: 15px 25px;
      .upload {
        width: 80px;
        height: 80px;
        border: 1px solid #ccc;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
      }
      .tips {
        font-size: 14px;
        margin-top: 10px;
        color: #999;
      }
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
        width: 195px;
        padding-left: 15px;
      }
    }
  }
</style>
