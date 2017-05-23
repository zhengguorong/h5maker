<template>
  <div class="editor">
    <header class="header">
      <button class="reset-btn" @click="dialogSave(true)"><i class="el-icon-arrow-left"></i>返回作品</button>
      <!--<el-dialog title="即将返回作品列表" v-model="dialogSaveBeforeBack" size="tiny">
        <span>未保存的作品将会失去目前进度，是否继续返回</span>
        <span slot="footer">
          <el-button type="danger" @click="dialogSave(false)">继续返回</el-button>
          <el-button type="primary" @click="dialogSave(true)">保 存</el-button>
        </span>
      </el-dialog>-->
    </header>
    <section class="section">
      <Overview class="overview" />
      <div class="canvas-wrap" id="canvas-wrap">
        <Page :elements="editorPage.elements" :editorElement="element" :selectedElement="selectedElement" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
        <div class="tool-bar" :style="{top: parseInt(canvasHeight) + 35 + 'px'}">在右侧设置界面调整页面高度</div>
      </div>
      <div class="control-panel">
        <div class="funcs">
          <el-tooltip  effect="dark" content="新建文本" placement="left">
            <button class="func el-icon-edit" @click="togglePanel(1)" :class="{ active: panelState === 1 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="新建素材" placement="left">
            <button class="func el-icon-picture" @click="togglePanel(2)":class="{ active: panelState === 2 }"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="设置" placement="left">
            <button class="func el-icon-setting" @click="togglePanel(4)" :class="{ active: panelState === 4 }"></button>
          </el-tooltip>
          <!--<el-tooltip  effect="dark" content="形状元素" placement="left">
            <button class="func el-icon-star-on" @click="togglePanel(3)":class="{ active: panelState === 3 }"></button>
          </el-tooltip>-->
          <!--<el-tooltip  effect="dark" content="播放动画" placement="left">
            <button class="func el-icon-caret-right" @click="playAnimate"></button>
          </el-tooltip>-->
          <el-tooltip  effect="dark" content="保存" placement="left">
            <button class="func el-icon-upload" @click="save"></button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="发布" placement="left"  >
            <button class="func el-icon-message" @click="deployAndShowCode()" :class="{ active: panelState === 5 }"></button>
          </el-tooltip>

        </div>
        <div class="wrapper custom-scrollbar">
          <!-- 设置背景 0 -->
          <div class="panel panel-bg" v-if="panelState === 0">
            <div class="clearfix" v-if="panelTabState !== 1">
              <el-button class="btn" type="success" @click="panelTabState = 1">更换背景</el-button>
              <el-button class="btn" type="danger" @click="cleanBG">移除背景</el-button>
            </div>
            <div class="clearfix" v-if="panelTabState === 1">
              <PicPicker class="bgs" @uploaded="uploadImage" @style="style"></PicPicker>
              <div class="bgs" :style="{ backgroundImage: 'url(' + http + element.filePath + ')' }" @click="addBG(element.filePath)" v-for="element in picList"></div>
            </div>
          </div>
          <!-- 添加文字 1 -->
          <div class="panel panel-text" v-if="panelState === 1">
            <div class="btn" @click="addTextElement('title')" style="font-size: 32px; font-weight: bold;">插入标题</div>
            <div class="btn" @click="addTextElement('plain')">插入文本</div>
          </div>
          <!-- 添加元素 2 -->
          <div class="panel panel-element clearfix" v-if="panelState === 2">
            <PicPicker class="ele" @uploaded="uploadImage"></PicPicker>
            <div class="ele" :style="{ backgroundImage: 'url(' + http + element.filePath + ')' }" @click="addPicElement(element)" v-for="element in picList"></div>
          </div>
          <!-- 添加形状 3 -->
          <div class="panel panel-shape clearfix" v-if="panelState === 3">
            <svg class="shape" @click="addIcon('action-redo')">
              <use xlink:href="/static/svg/icon.svg#action-redo"></use>
            </svg>
            <svg class="shape" @click="addIcon('circle-fill')"  fill="#000">
              <use xlink:href="/static/svg/icon.svg#circle-fill"  fill="#000"></use>
            </svg>
            <svg class="shape" @click="addIcon('bmLogo')">
              <use xlink:href="/static/svg/icon.svg#bmLogo"  fill="#fff"></use>
            </svg>
          </div>
          <!-- 设置信息 -->
          <div class="panel panel-shape clearfix" v-if="panelState === 4">
            <el-form label-width="40px">
              <el-form-item label="标题">
                <el-input v-model="title"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="description"></el-input>
              </el-form-item>
              <el-form-item label="页面长度">
                <el-input type="number" v-model="canvasHeight"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveSetting">确认</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 发布 -->
          <div class="panel panel-shape clearfix" v-if="panelState === 5">
            <div><canvas id="canvas"></canvas></div>
          </div>
          <!-- 图层编辑面板 -->
          <div class="panel panel-edit">
            <div class="panel-tab clearfix">
              <div class="tab" style="width:100%" @click="function () { panelTabState = 0 }">
                <span v-if="panelState === 11">文本</span>
                <span v-if="panelState === 12">元素</span>
              </div>
              <!--<div class="tab" :class="{ active: panelTabState === 1 }" @click="function () { panelTabState = 1 }">动作</div>-->
            </div>
            <el-form label-width="5em">
              <div v-if="panelTabState === 0">
                <!-- 文字编辑界面特有控件 -->
                <template v-if="panelState === 11">
                  <el-form-item label="链接">
                    <el-input v-model="element.href"></el-input>
                  </el-form-item>
                  <el-form-item label="文本内容">
                    <el-input v-model="element.text" type="textarea"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox v-model="element.fontWeight" true-label="bold" false-label="normal">加粗</el-checkbox>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="element.textAlign = 'left'">左对齐</el-button>
                    <el-button size="small" type="primary" @click="element.textAlign = 'center'">居中</el-button>
                    <el-button size="small" type="primary" @click="element.textAlign = 'right'">右对齐</el-button>
                  </el-form-item>
                  <el-form-item label="颜色">
                    <el-input type="color" v-model="element.color"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小">
                    <el-input-number v-model="element.fontSize"></el-input-number>
                  </el-form-item>
                  <el-form-item label="行高">
                    <el-input-number v-model="element.lineHeight"></el-input-number>
                  </el-form-item>
                  <el-form-item label="字体">
                    <el-input v-model="element.fontFamily"></el-input>
                  </el-form-item>
                </template>
                <!-- 通用控件-->
                <el-form-item label="链接">
                  <el-input v-model="element.href"></el-input>
                </el-form-item>
                <el-form-item label="透明度">
                  <el-slider v-model="element.opacity"></el-slider>
                </el-form-item>
                <el-form-item label="旋转">
                  <el-slider v-model="element.transform" :max="359"></el-slider>
                </el-form-item>
                <el-form-item label="高" v-if="panelState !== 11">
                  <el-input v-model="element.height"><template slot="append">px</template></el-input>
                </el-form-item>
                <el-form-item label="宽">
                  <el-input v-model="element.width"><template slot="append">px</template></el-input>
                </el-form-item>
                <el-form-item label="X轴坐标">
                  <el-input v-model="element.left"><template slot="append">px</template></el-input>
                </el-form-item>
                <el-form-item label="Y轴坐标">
                  <el-input v-model="element.top"><template slot="append">px</template></el-input>
                </el-form-item>
              </div>
              <div v-if="panelTabState === 1">
                <el-form-item label="动画库">
                  <el-select placeholder="daneden/animate.css" v-model="element.animatedName" clearable>
                    <el-option v-for="item in animateList" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否循环">
                  <el-checkbox v-model="element.loop"></el-checkbox>
                </el-form-item>
                <el-form-item label="速度">
                  <el-slider v-model="element.duration" :step="0.1" :min="0" :max="10"></el-slider>
                </el-form-item>
                <el-form-item label="延迟">
                  <el-slider v-model="element.delay" :step="0.1" :min="0" :max="10"></el-slider>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import tools from '../../util/tools'
  import Overview from './overview'
  import Page from '../../components/Page'
  import PicPicker from '../../components/PicturePicker'
  import appConst from '../../util/appConst'
  import QRCode from 'qrcode'
  export default {
    data () {
      return {
        panelState: 0,
        panelTabState: 0,
        canvasWidth: 320,
        canvasHeight: this.$store.state.editor.editorTheme.canvasHeight,
        dialogSaveBeforeBack: false,
        animateList: ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY', 'lightSpeedIn', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'hinge', 'rollIn', 'rollOut'],
        picBase64: '',
        http: appConst.BACKEND_DOMAIN,
        flag: false,
        curentY: 0,
        title: this.$store.state.editor.editorTheme.title || '',
        description: this.$store.state.editor.editorTheme.description || ''
      }
    },
    watch: {
      picBase64 () {
      },
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
      picList () {
        return this.$store.state.editor.picList
      }
    },
    methods: {
      mousedown (e) {
        this.flag = true
        this.curentY = e.clientY
      },
      mousemove (e) {
        if (this.flag) {
          let movepx = e.clientY - this.curentY
          this.canvasHeight = this.canvasHeight + movepx
          this.curentY = e.clientY
        }
      },
      mouseup (e) {
        this.curentY = e.clientY
        this.flag = false
        // var canvasWrap = document.getElementById('canvas-wrap')
        // canvasWrap.scrollTop = canvasWrap.scrollHeight
      },
      dialogSave (mark) {
        return Promise.resolve().then(() => mark && this.save()).then(() => this.$router.replace('spaList'))
      },
      getPicList (_id) {
        this.$store.dispatch('getPicListByThemeId', _id)
      },
      uploadImage (data) {
        this.$store.dispatch('savePic', {
          'imgData': data['base64'],
          'themeId': this.themeId,
          'width': data['width'],
          'height': data['height']
        })
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
      addIcon (iconKey) {
        let obj = {}
        obj.type = 'icon'
        obj.iconKey = iconKey
        obj.top = 0
        obj.left = 0
        obj.width = 100
        obj.height = 100
        this.$store.dispatch('addElement', obj)
      },
      addBG (src) {
        this.$store.dispatch('addBGElement', { type: 'bg', imgSrc: src })
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
        return this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      },
      deploy () {
        this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme))
        let _id = this.$store.state.editor.editorTheme._id
        let releaseUrl = appConst.BACKEND_DOMAIN + '/pages/' + _id + '.html'
        window.open(appConst.BACKEND_DOMAIN + '/pages/' + _id + '.html')
        // 生成二维码
        var canvas = document.getElementById('canvas')
        QRCode.toCanvas(canvas, releaseUrl, (err) => {
          console.log(err)
        })
      },
      deployAndShowCode () {
        this.togglePanel(5)
        this.deploy()
      },
      saveSetting () {
        this.$store.commit('UPDATE_THEME_DES', {title: this.title, description: this.description, canvasHeight: this.canvasHeight})
        this.save()
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
      style (obj) {
        this.element.width = obj.width
        this.element.height = obj.height
      },
      togglePanel (code) {
        this.panelState = code
      }
    },
    components: {
      Overview, Page, PicPicker, appConst
    },
    mounted () {
      let itemId = this.$route.query.itemId
      if (itemId) {
        if (!this.pages) {
          this.$store.dispatch('getPageByThemeId', this.$route.query.itemId)
        }
        this.getPicList(this.$route.query.itemId)
      } else {
        this.$store.dispatch('createTheme')
        this.$store.dispatch('addPage')
        this.$store.dispatch('cleanPicList')
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

  .header {
    height: 60px;
    background-color: #373f42;
    color: #fff;
    .reset-btn {
      height: 100%;
      padding: 0 20px;
      cursor: pointer;
    }
    .el-icon-arrow-left {
      margin-right: 20px;
    }
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
    position: absolute !important;
    left: 0;
    width: 160px;
    height: 100%;
    z-index: 10;
  }
  .canvas-wrap {
    position: absolute;
    height: 100%;
    width: 600px;
    left: 160px;
    padding-left: 150px;
    overflow: scroll;
  }
  .canvas {
    position: absolute !important;
    top: 5%;
    border: 2px solid #ccc;
    box-shadow: 0px 2px 30px 5px rgba(0,0,0,0.2);
    box-sizing: content-box;
    margin-bottom: 200px;
  }
  .tool-bar {
    position: absolute;
    width: 250px;
    height: 30px;
    margin: 0 40px;
    line-height: 30px;
    top:538px;
    text-align: center;
    color:#acb5b3;
    font-size: 12px;
    border: 1px solid #ccc;
    background-color: #fff;
    // cursor: ns-resize;
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
    .panel-element {
      .ele {
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
    .panel-shape {
      .shape {
        float: left;
        width: 80px;
        height: 80px;
        margin: 5px;
      }
    }
    .panel-edit {
      z-index: 1;
    }
    .panel-tab {
      line-height: 40px;
      margin: -10px -10px 10px;
      .tab {
        float: left;
        width: 50%;
        text-align: center;
        cursor: pointer;
        background-color: #d6d6d6;
        &.active {
          background-color: transparent;
        }
      }
    }
  }
</style>
