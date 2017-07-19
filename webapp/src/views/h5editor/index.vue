<template>
  <div class="editor">
    <HeaderEdit :goback="dialogSave" @saveSuccess="showPreView=true" :perViewAction="save"/>
    <section class="section">
      <Overview class="overview" />
      <Page class="canvas" :elements="editorPage.elements" :editorElement="element" :selectedElement="selectedElement" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
      <div class="control-panel">
        <div class="funcs">
          <el-tooltip  effect="dark" content="新建文本" placement="left">
            <button class="func el-icon-edit" @click="togglePanel(1)" :class="{ active: panelState === 1 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="新建素材" placement="left">
            <button class="func el-icon-picture" @click="togglePanel(2)" :class="{ active: panelState === 2 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="添加背景音乐" placement="left">
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
          <!-- 设置背景 0 -->
        <div class="panel panel-bg">
          <div class="clearfix"
              v-if="panelTabState !== 1">
            <el-button class="btn"
                      type="success"
                      @click="panelTabState = 1">更换背景</el-button>
            <el-button class="btn"
                      type="danger"
                      @click="cleanBG">移除背景</el-button>
          </div>
          <div class="clearfix"
              v-if="panelTabState === 1">
            <ImgPanel  :selectedImg="addBG"/>
          </div>
        </div>
          <!-- 添加文字 1 -->
          <div class="panel panel-text" v-show="panelState === 1">
            <div class="btn" @click="addTextElement('title')" style="font-size: 32px; font-weight: bold;">插入标题</div>
            <div class="btn" @click="addTextElement('plain')">插入文本</div>
          </div>
          <!-- 添加元素 2 -->
          <div class="panel panel-element clearfix" v-show="panelState === 2">
            <ImgPanel :selectedImg="addPicElement"/>
          </div>
          <!-- 添加背景音乐 3 -->
          <div class="panel panel-music" v-show="panelState === 3">
            <div class="panel-music-bg-music" :class="{active: editorTheme.musicLink}" @click="playMusic(editorTheme, -1)">
              <div class="left">
                <audio :src="editorTheme.musicLink" id="audio" loop="true"></audio>
                <i class="iconfont" v-if="musicPlaying">&#xe61b;</i>
                <i class="iconfont" v-else>&#xe74b;</i>
                <span v-if="!editorTheme.musicLink">未选择音乐</span>
                <span v-if="editorTheme.musicName">{{editorTheme.musicName}}</span>
              </div>
              <div class="right">
                <span class="play" v-if="editorTheme.musicName && this.musicPlaying"><i class="iconfont">&#xe695;</i>暂停</span>
                <span class="play" v-else><i class="iconfont">&#xe674;</i>播放</span>
                <span @click.stop="clearMusic(editorTheme, -1)"><i class="iconfont">&#xe62f;</i>清除</span>
              </div>
            </div>
            <ul class="panel-music-content">
              <li v-for="(list,index) in musicList" class="music-list" @click.stop="playMusic(list, index)" :class="{active: editorTheme.musicName===list.name}">
                <div class="left">
                  <i class="iconfont" v-if="list.isPlaying">&#xe61b;</i>
                  <i class="iconfont" v-else>&#xe74b;</i>
                  <span class="music-name">{{list.name}}</span>
                </div>
                <div class="right">
                  <span class="play" v-if="editorTheme.musicName===list.name && list.isPlaying"><i class="iconfont">&#xe695;</i>暂停</span>
                  <span class="play" v-else><i class="iconfont">&#xe674;</i>播放</span>
                  <span @click.stop="clearMusic(list, index)"><i class="iconfont">&#xe62f;</i>清除</span>
                </div>
              </li>
            </ul>
            <div class="panel-music-upload">
              <input type="file" name="inputFile" @change="fileUpload"/>
              <el-button type="primary" icon="upload2">上传音乐</el-button>
            </div>
          </div>
          <!-- 图层编辑面板 -->
          <EditPanel :element="element" :panelState="panelState" v-show="panelState > 10"/>
        </div>
      </div>
    </section>
    <PreView :itemId="itemId" @hideView="showPreView=false" v-if="showPreView"/>
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
  import appConst from '../../util/appConst'
  import api from '../../api/editor'

  export default {
    data () {
      return {
        itemId: null,
        panelState: 0,
        canvasWidth: 320,
        canvasHeight: 504,
        dialogSaveBeforeBack: false,
        panelTabState: 0,
        picBase64: '',
        http: appConst.BACKEND_DOMAIN,
        releaseUrl: '',
        showPreView: false,
        isLoadingPreview: false
      }
    },
    watch: {
      element () {
        let ele = this.$store.state.editor.editorElement
        let type = ele ? ele.type : 'null'
        this.panelTabState = 0
        switch (type) {
          case 'text':
            this.panelState = 11
            break
          case 'icon':
          case 'pic':
            this.panelState = 12
            break
          default:
            this.panelState = 0
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
      },
      musicList () {
        return this.$store.state.editor.musicList
      },
      musicPlaying () {
        return this.$store.state.editor.musicPlaying
      }
    },
    methods: {
      fileUpload (event) { // 上传音乐
        let upload = true
        let file = event.target.files[0]
        if (!/^audio/.test(file.type)) {
          this.$message('请上传正确的音乐格式！')
          return
        }
        this.musicList.map(music => {
          if (file.name === music.name) {
            this.$message('不能上传同样的音乐')
            upload = false
            return
          }
        })
        if (upload) {
          let form = new window.FormData()
          form.append('inputFile', file)
          form.append('themeId', this.themeId)
          api.uploadPic(form).then((res) => {
            this.$store.commit('PUSH_MUSIC_LIST', {name: res.fileName, link: res.filePath})
          })
        }
      },
      playMusic (list, index) { // 播放音乐
        let audio = document.getElementById('audio')
        if (index > -1) { // 列表
          if (list.name === this.editorTheme.musicName) {
            this.toggleMusic(audio, index)
          } else {
            this.$store.commit('UPDATE_THEME_MUSIC', {musicName: list.name, musicLink: appConst.BACKEND_DOMAIN + list.link})
            this.$store.commit('UPDATE_MUSIC_LIST_PLAYING', {index: index, isPlaying: true})
            this.$store.commit('UPDATE_MUSIC_PLAYING', true)
            this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
              audio.play()
            })
          }
        } else { // 音乐栏
          if (list.musicName) {
            if (this.musicList.length > 0) {
              this.musicList.map((item, itemIndex) => {
                if (list.musicName === item.name) {
                  this.toggleMusic(audio, itemIndex)
                  return
                }
              })
            } else {
              if (audio.paused) { // 播放
                audio.play()
                this.$store.commit('UPDATE_MUSIC_PLAYING', true)
              } else { // 暂停
                audio.pause()
                this.$store.commit('UPDATE_MUSIC_PLAYING', false)
              }
            }
          }
        }
      },
      toggleMusic (audio, itemIndex) {
        if (audio.paused) { // 播放
          audio.play()
          this.$store.commit('UPDATE_MUSIC_LIST_PLAYING', {index: itemIndex, isPlaying: true})
          this.$store.commit('UPDATE_MUSIC_PLAYING', true)
        } else { // 暂停
          audio.pause()
          this.$store.commit('UPDATE_MUSIC_LIST_PLAYING', {index: itemIndex, isPlaying: false})
          this.$store.commit('UPDATE_MUSIC_PLAYING', false)
        }
      },
      clearMusic (list, index) { // 删除音乐
        let audio = document.getElementById('audio')
        if (list.musicName || list.name === this.editorTheme.musicName) {
          audio.pause()
          this.$store.commit('UPDATE_THEME_MUSIC', {musicName: null, musicLink: null})
          this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme))
        }
        if (index > -1) {
          this.$store.commit('UPDATE_MUSIC_LIST', index)
        }
      },
      dialogSave () {
        return Promise.resolve().then(() => this.save()).then(() => this.$router.replace('themeList'))
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
      addBG (file) {
        this.$store.dispatch('addBGElement', { type: 'bg', imgSrc: file.filePath })
      },
      cleanBG () {
        this.$store.dispatch('cleanBG')
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
        // 暂停音乐
        let audio = document.getElementById('audio')
        if (this.editorTheme.musicName && !audio.paused) {
          if (this.musicList.length > 0) {
            this.musicList.map((item, itemIndex) => {
              if (this.editorTheme.musicName === item.name) {
                this.$store.commit('UPDATE_MUSIC_LIST_PLAYING', {index: itemIndex, isPlaying: false})
                return
              }
            })
          }
          audio.pause()
          this.$store.commit('UPDATE_MUSIC_PLAYING', false)
        }
        return this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
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
        if (event.keyCode === 8 && event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA') {
          this.deleteElement()
        }
      },
      deleteElement () {
        this.$store.dispatch('deleteSelectedElement')
      },
      togglePanel (code) {
        console.log(code)
        this.panelState = code
      }
    },
    components: {
      Overview, Page, PicPicker, appConst, PreView, HeaderEdit, EditPanel, SvgPanel, ImgPanel
    },
    mounted () {
      this.itemId = this.$route.query.itemId
      if (this.itemId) {
        if (!this.pages) {
          this.$store.dispatch('getPageByThemeId', this.itemId)
        }
        this.getPicList(this.itemId)
      } else {
        this.$store.dispatch('createTheme')
        this.$store.dispatch('addPage')
        this.$store.dispatch('cleanPicList')
      }
      this.$store.commit('CLEAN_MUSIC_LIST')
      if (this.editorTheme.musicName) {
        let audio = document.getElementById('audio')
        audio.pause()
        this.$store.commit('UPDATE_MUSIC_PLAYING', false)
      }
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
      .btn {
        float: left;
        width: 48%;
        margin-left: 1%;
        margin-right: 1%;
      }
      .bgs {
        float: left;
        width: 80px;
        height: 80px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        margin: 5px 5px;
        &:hover {
          border: 2px solid #18ccc0;
          cursor: pointer;
        }
      }
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
    .panel-music{
      .play{
        margin-right:10px;
      }
      .iconfont{
        padding-right:10px;
      }
      &-bg-music{
        height:60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom:1px solid #ddd;
        cursor:pointer
       }
      .active{
        color:#20a0ff;
      }
      &-upload{
         position:relative;
         margin-top:10px;
         input[type='file']{
           opacity:0;
           position:absolute;
           top:0;
           left:0;
           width:108px;
           height:36px;
         }
       }
     &-content{
      li{
        height:40px;
        display:flex;
        align-items: center;
        justify-content: space-between;
        cursor:pointer
      }
     }
    }
  }
</style>
