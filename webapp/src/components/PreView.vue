<template>
  <div class="wrap">
    <div class="content">
      <div class="preview-area">
        <iframe :src="releaseUrl"
                frameborder="0"></iframe>
      </div>
      <div class="setting">
        <div class="info">
          <div class="label">设置作品信息</div>
          <el-input class="input"
                    v-model="title"
                    @blur="saveTitle"
                    placeholder="请输入标题"></el-input>
          <el-input class="input"
                    v-model="description"
                    @blur="saveDescription"
                    placeholder="请输入描述"
                    type="textarea"></el-input>
        </div>
        <div class="qrcode">
          <div class="label">手机扫码分享给好友</div>
          <div class="code"><canvas id="canvas"></canvas></div>
          <div class="link"><a target="_blank" :href="releaseUrl">{{releaseUrl}}</a></div>
          <div class="edit" @click="edit"><el-button style="width:180px" type="primary" icon="edit">编   辑</el-button></div>
        </div>
      </div>
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(74, 74, 74, 0.5);
  z-index: 1001;
  overflow-y: scroll;
  justify-content: center;
  align-items: center;
  display: flex;
  .content {
    position: relative;
    width: 798px;
    height: 658px;
    background: #fff;
    border: 1px solid #d6d6d6;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 20px;
    .preview-area {
      width: 340px;
      height: 530px;
      border: 1px solid #d6d6d6;
      float: left;
      iframe {
        width: 100%;
        height: 100%;
      }
    }
    .setting {
      color: #4a4a4a;
      font-size: 14px;
      float: right;
      width: 380px;
      .info {
        .input {
          margin-top: 10px;
        }
      }
      .qrcode {
        margin-top: 10px;
      }
      .code {
        text-align: center;
      }
      .link {
        width:100%;
        overflow: scroll;
      }
      .edit {
        text-align: center;
        margin-top:20px;
      }
    }
  }
  .close {
    position: absolute;
    color: #fff;
    right: -30px;
    top:0px;
    cursor: pointer;
  }
}
</style>

<script>
import QRCode from 'qrcode'
import appConst from '../util/appConst'
import tools from '../util/tools'
export default {
  props: {
    itemId: {
      type: String
    }
  },
  data () {
    return {
      releaseUrl: appConst.BACKEND_DOMAIN + '/pages/' + this.itemId + '.html',
      title: this.$store.state.editor.editorTheme.title || '',
      description: this.$store.state.editor.editorTheme.description || ''
    }
  },
  methods: {
    edit () {
      var canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, this.releaseUrl, (err) => {
        console.log(err)
      })
      let openUrl = 'http://' + window.location.host + '/#/h5editor?itemId=' + this.itemId
      window.open(openUrl)
    },
    close () {
      this.$emit('hideView')
    },
    saveTitle () {
      if (this.title === this.$store.state.editor.editorTheme.title) return
      this.save()
    },
    saveDescription () {
      if (this.description === this.$store.state.editor.editorTheme.description) return
      this.save()
    },
    save () {
      this.$store.commit('UPDATE_THEME_DES', {title: this.title, description: this.description})
      this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  },
  mounted () {
    var canvas = document.getElementById('canvas')
    QRCode.toCanvas(canvas, this.releaseUrl, (err) => {
      console.log(err)
    })
  }
}
</script>
