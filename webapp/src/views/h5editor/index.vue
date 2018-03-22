<template>
  <div class="editor">
    <HeaderEdit :goback="dialogSave" @saveSuccess="showPreView=true" :perViewAction="save" @template_status="template_status" :isTemplate="editorTheme.isTemplate"/>
    <section class="section">
      <Overview class="overview" />
      <Page class="canvas" :elements="editorPage.elements" :editorElement="element" :selectedElement="selectedElement" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
      <div class="control-panel">
        <div class="funcs">
          <el-tooltip  effect="dark" content="编辑标题" placement="left">
            <button class="func el-icon-document" @click="togglePanel(-1)" :class="{ active: panelState === -1 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="添加背景" placement="left">
            <button class="func" @click="togglePanel(0)" :class="{ active: panelState === 0 }" >
              <i class="iconfont" style="font-size: 18px;">&#xe622;</i>
            </button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="新建文本" placement="left">
            <button class="func el-icon-edit" @click="togglePanel(1)" :class="{ active: panelState === 1 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="新建素材" placement="left">
            <button class="func el-icon-picture" @click="togglePanel(2)" :class="{ active: panelState === 2 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="添加音乐" placement="left">
            <button class="func" @click="togglePanel(3)" :class="{ active: panelState === 3 }" >
              <i class="iconfont">&#xe63e;</i>
            </button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="播放动画" placement="left">
            <button class="func el-icon-caret-right" @click="playAnimate"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="保存" placement="left">
            <button class="func el-icon-upload" @click="save"></button>
          </el-tooltip>
        </div>
        <div class="wrapper custom-scrollbar">
          <!-- 设置标题和描述 -1 -->
          <div class="panel panel-bg" v-show="panelState === -1">
            <div class="info">
              <div class="label">设置作品标题</div>
              <el-input class="input"
                        :value="editorTheme.title"
                        @change="saveTitle"
                        placeholder="请输入标题"></el-input>
              <div class="label" style="margin-top:10px">设置作品描述</div>
              <el-input class="input"
                        :value="editorTheme.description"
                        @change="saveDescription"
                        placeholder="请输入描述"
                        type="textarea"></el-input>
            </div>
          </div>
          <!-- 设置背景 0 -->
          <div class="panel panel-bg" v-show="panelState === 0">
            <BgPanel :themeId="themeId" :editorPage="editorPage" :elements="editorPage.elements"/>
          </div>
          <!-- 添加文字 1 -->
          <div class="panel panel-text" v-show="panelState === 1">
            <!--<div class="btn" @click="addTextElement('title')" style="font-size: 32px; font-weight: bold;">插入标题</div>-->
            <div class="btn" @click="addTextElement('plain')">插入文本</div>
          </div>
          <!-- 添加元素 2 -->
          <div class="panel panel-element clearfix" v-show="panelState === 2">
            <ImgPanel :themeId="themeId" :selectedImg="addPicElement" type="elementImg"/>
          </div>
          <!-- 添加背景音乐 3 -->
          <div class="panel panel-music" v-show="panelState === 3">
            <MusicPanel ref="musicPanel"/>
          </div>
          <!-- 图层编辑面板 -->
          <EditPanel :element="element" :panelState="panelState" v-show="panelState > 10"/>
        </div>
      </div>
    </section>
    <PreView :itemId="itemId" @hideView="showPreView=false" :showSetting="false" v-if="showPreView"/>
  </div>
</template>

<script>
  import tools from '../../util/tools'
  import Overview from './overview'
  import Page from '../../components/Page'
  import PicPicker from '../../components/PicturePicker'
  import PreView from '../../components/PreView'
  import HeaderEdit from '../../components/HeaderEdit'
  import EditPanel from '../../components/EditPanel'
  import SvgPanel from '../../components/SvgPanel'
  import ImgPanel from '../../components/ImgPanel'
  import MusicPanel from '../../components/MusicPanel'
  import BgPanel from '../../components/BgPanel'
  import appConst from '../../util/appConst'
  import * as types from '../../vuex/editor/mutation-type'

  export default {
    data () {
      return {
        itemId: null,
        panelState: -1,
        canvasWidth: 320,
        canvasHeight: 504,
        dialogSaveBeforeBack: false,
        picBase64: '',
        http: appConst.BACKEND_DOMAIN,
        releaseUrl: '',
        showPreView: false,
        isLoadingPreview: false,
        cacheThemeUnSave: null // 用来缓存改动了未保存的初始状态，判断离开页面时提示用户是否保存
      }
    },
    watch: {
      element () {
        let ele = this.$store.state.editor.editorElement
        let type = ele ? ele.type : 'null'
        switch (type) {
          case 'text':
            this.panelState = 11
            break
          case 'icon':
          case 'pic':
            this.panelState = 12
            break
          case 'bgColor':
          case 'bg':
            this.panelState = 0
            break
        }
      }
    },
    computed: {
      themeId () {
        return this.$store.state.editor.editorTheme._id
      },
      editorPage () {
        return this.$store.state.editor.editorPage
      },
      element () {
        let ele = this.$store.state.editor.editorElement
        return ele || {}
      },
      editorTheme () {
        return this.$store.state.editor.editorTheme
      }
    },
    methods: {
      template_status (val) {
        this.$store.commit(types.SET_AS_TEMPLATE, val)
      },
      saveTitle (v) {
        this.$store.commit('UPDATE_THEME_TITLE', v)
      },
      saveDescription (v) {
        this.$store.commit('UPDATE_THEME_DES', v)
      },
      dialogSave () {
       // return Promise.resolve().then(() => this.save()).then(() => this.$router.replace('themeList')) // 取消返回自动保存逻辑
        if (this.cacheThemeUnSave === JSON.stringify(this.$store.state.editor.editorTheme)) {
          return Promise.resolve().then(this.$router.replace('themeList'))
        } else {
          this.$confirm('要保存您的更改吗？', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '放弃',
            type: 'warning'
          }).then(() => {
            this.save()
            this.$router.replace('themeList')
          }).catch(() => {
            this.$router.replace('themeList')
          })
        }
      },
      getPicList (_id) {
        this.$store.dispatch('getPicListByThemeId', _id)
      },
      addPicElement (ele) {
        // if (ele) {
        let obj = {}
        obj.type = 'pic'
        obj.top = 0
        obj.left = 0
        obj.width = ele.width
        obj.height = ele.height
        obj.imgSrc = ele.filePath
        obj.loop = ele.loop
        this.$store.dispatch('addElement', obj)
        // } else {
        //   this.$store.dispatch('addElement', this.element)
        // }
        this.element.type = 'pic'
      },
      cleanEle () {
        this.$store.dispatch('cleanEle', this.element)
      },
      addTextElement (type) {
        let param = {}
        param['type'] = 'text'
        param['text'] = '请输入文本'
        param['width'] = this.canvasWidth
        param['lineHeight'] = 1.5
        switch (type) {
          case 'plain':
            break
          case 'title':
            param['fontSize'] = 32
            param['fontWeight'] = 'bold'
            param['textAlign'] = 'center'
            break
          default:
        }
        this.$store.dispatch('addElement', param)
      },
      playAnimate () {
        this.$store.dispatch('playAnimate')
      },
      save () {
        this.$refs.musicPanel.saveMusic()
        return this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          this.cacheThemeUnSave = JSON.stringify(this.$store.state.editor.editorTheme)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      },
      deploy () {
        this.isLoadingPreview = true
        this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          setTimeout(() => {
            this.showPreView = true
            this.isLoadingPreview = false
          }, 1000)
        })
      },
      selectedElement (element) {
        this.$store.dispatch('setEditorElement', element)
      },
      deleteListener (event) {
        if (event.keyCode === 46 && event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA') {
          this.deleteElement()
        }
      },
      deleteElement () {
        if (this.panelState === 11) this.panelState = 1
        if (this.panelState === 12) this.panelState = 2
        this.$store.dispatch('deleteSelectedElement')
      },
      togglePanel (code) {
        this.panelState = code
      }
    },
    components: {
      Overview, Page, PicPicker, appConst, PreView, HeaderEdit, EditPanel, SvgPanel, ImgPanel, MusicPanel, BgPanel
    },
    mounted () {
      this.itemId = this.$route.query.itemId
      if (this.itemId) {
        if (!this.pages) {
          this.$store.dispatch('getPageByThemeId', this.itemId).then(() => {
            this.cacheThemeUnSave = JSON.stringify(this.$store.state.editor.editorTheme)
          })
        }
        this.getPicList(this.itemId)
      } else {
        this.$store.dispatch('createTheme')
        this.$store.dispatch('addPage')
        this.$store.dispatch('cleanPicList')
      }
      this.$store.dispatch('cleanBgList')
      document.addEventListener('keyup', this.deleteListener)
      window.onbeforeunload = () => false
    },
    destroyed () {
      document.removeEventListener('keyup', this.deleteListener)
      window.onbeforeunload = null
    }
  }

</script>

<style lang="less" scoped>
  .editor {
    background-color: #eaedef;
    position: relative;
    height: 100%;
    overflow: hidden;
    user-select: none;
  }

  .section {
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow: hidden;
  }

  .overview {
    position: absolute;
    left: 0;
    width: 160px;
    height: 100%;
    z-index: 10;
  }

  .canvas {
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-75%, -50%);
    border: 2px solid #373f42;
    box-shadow: 0px 2px 30px 5px rgba(0,0,0,0.2);
    box-sizing: content-box;
  }

  .control-panel {
    position: absolute;
    width: 300px;
    height: 100%;
    right: 0;
    top: 0;
    border-left: 1px solid #d6d6d6;
    background-color: #ececec;
    z-index: 10;
    .funcs {
      position: absolute;
      left: -50px;
      top: 0;
      width: 50px;
      .func {
        color: #b2bcba;
        background: #fff;
        cursor: pointer;
        margin-top: 20px;
        display: block;
        width: 50px;
        height: 50px;
        border: 1px solid #d6d6d6;
        border-radius: 3px 0px 0px 3px;
        &:hover {
           color: #000;
         }
        &.active {
           border-right: 1px solid #ececec;
           background-color: #ececec;
           color: #000;
        }
      }
    }
    .wrapper {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
    }
    .panel {
      position: absolute;
      left: 0;
      top: 0;
      min-height: 100%;
      width: 100%;
      padding: 10px;
      z-index: 2;
      background-color: #ececec;
    }
    .panel-bg {
      clear:both;
    }
    .panel-text {
      .btn {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border: 2px solid transparent;
        &:hover {
           cursor: pointer;
           border-color: #04b9c4;
        }
      }
    }
  }
  .info {
    .label {
      margin-bottom: 3px;
    }
    .input {
      margin-top: 10px;
    }
  }
</style>
