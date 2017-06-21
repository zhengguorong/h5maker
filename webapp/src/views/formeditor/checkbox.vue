<template>
  <div class="container" @click.stop="setActive" :class="{active: question.isActive}">
    <div class="question">
      <div class="title">
        <span class="must" v-if="question.isMust">*</span>{{index + 1}}. {{question.title}}</div>
      <div v-if="question.qsType === 'check'" class="result" v-for="item in question.askList">
        <el-checkbox v-model="item.isDefault" class="item">{{item.title}}</el-checkbox>
        <img v-if="item.imgPath" class="checkBox-img" :src="item.base64 || http + item.imgPath" alt="">
      </div>
      <div v-if="question.qsType === 'radio'" class="result" v-for="item in question.askList">
        <el-radio v-model="item.isDefault" class="item">{{item.title}}</el-radio>
        <img v-if="item.imgPath" class="checkBox-img" :src="item.base64 || http + item.imgPath" alt="">
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
    <div class="editor-panel" v-show="question.isActive">
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
        <el-table style="width: 100%" :data="question.askList">
          <el-table-column label="选项文字" width="280">
            <template scope="scope">
              <input type="text" v-model="scope.row.title">
            </template>
          </el-table-column>
          <el-table-column label="图片" width="180">
            <template scope="scope">
              <div class="upload-img" v-if="scope.row.imgPath">
                <img class="table-img" :src="scope.row.base64 || http + scope.row.imgPath">
                <i @click.stop="clearImg(scope.row)" class="el-icon-circle-cross"></i>
              </div>
              <div class="upload-img" v-if="!scope.row.imgPath">
                <i class="el-icon-upload2">
                  <input class="file-upload" type="file" @change="fileUpload($event, scope.row)" />
                </i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="默认选中" width="100">
            <template scope="scope">
              <el-switch v-model="scope.row.isDefault">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <i @click="addAsk(scope.$index)" class="el-icon-plus"></i>
              <i @click="deleteAsk(scope.$index)" class="el-icon-minus"></i>
              <i @click="moveUp(scope.$index)" class="el-icon-arrow-up"></i>
              <i @click="moveDown(scope.$index)" class="el-icon-arrow-down"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button @click.stop="save" style="width:100%" type="primary">完成编辑</el-button>
    </div>
  </div>
</template>

<script>
import lrz from 'lrz'
import appConst from '../../util/appConst'
export default {
  props: ['question', 'index'],
  data () {
    return {
      http: appConst.BACKEND_DOMAIN
    }
  },
  methods: {
    setActive () {
      if (this.question.isActive === true) return
      this.$store.commit('form/activeQuestion', this.index)
    },
    addAsk (index) {
      this.$store.commit('form/addAsk', { questionIndex: this.index, askIndex: index })
    },
    deleteAsk (index) {
      this.$store.commit('form/deleteAsk', { questionIndex: this.index, askIndex: index })
    },
    save () {
      if (!this.checkRadioDefault()) {
        this.$message.error('单选问题不能多个默认值')
        return
      }
      this.$store.commit('form/disActiveQuestion', this.index)
      this.$store.commit('form/saveQuestion', { question: this.question, index: this.index })
    },
    checkRadioDefault () {
      // 检查单选类型是否多个默认选中
      let defaultLength = 0
      this.question.askList.forEach(item => {
        if (item.isDefault) {
          defaultLength = defaultLength + 1
        }
      })
      if (defaultLength > 1) {
        return false
      } else {
        return true
      }
    },
    moveUp (index) {
      if (index === 0) {
        return
      }
      this.$store.commit('form/moveUpAsk', { questionIndex: this.index, askIndex: index })
    },
    moveDown (index) {
      if (index === this.question.askList.length - 1) {
        return
      }
      this.$store.commit('form/moveDownAsk', { questionIndex: this.index, askIndex: index })
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
    },
    fileUpload (event, item) {
      let file = event.target.files[0]
      if (file) {
        lrz(file, { quality: 0.5 }).then(result => {
          if (result.fileLen > 2 * 1024 * 1024) {
            this.$message.error('请选择小于2M的文件')
            return
          }
          item.base64 = result.base64
          this.$store.dispatch('form/savePic', result.base64).then(res => {
            item.imgPath = res.filePath
          })
        })
      }
    },
    clearImg (item) {
      item.base64 = ''
      item.imgPath = ''
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
  margin: 20px 0px;
}

.container:hover,
.container.active {
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
    .item {
      display: block;
      margin-left: 0;
      margin-top: 10px;
    }
    img {
      width: 150px;
      margin-top:10px;
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
    margin-bottom: 20px;
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
    table {
      .table-img {
        width: 60px;
        max-height: 50px;
      }
      .upload-img {
        display: flex;
        align-items: center;
      }
      i {
        padding: 0 15px;
        cursor: pointer;
      }
      input {
        border: 0;
        width: 250px;
        font-size: 13px;
        color: #1F2D3D;
      }
      .file-upload {
        position: absolute;
        opacity: 0;
        left: -10px;
      }
    }
  }
}
</style>
