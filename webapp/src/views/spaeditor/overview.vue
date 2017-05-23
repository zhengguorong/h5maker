<template>
  <div class="overview">
    <div class="clearfix">
      <!--<span class="panel" :class="{ active: viewState === 0 }" @click="function () { viewState = 0 }">页面</span>-->
      <span class="panel" :class="{ active: viewState === 1 }" @click="function () { viewState = 1 }">图层</span>
    </div>
    <ul class="list custom-scrollbar" style="z-index: 1;">
      <li v-for="page in pages">
        <div class="page" :class="{ active: page === editingPage }" :style="{ width: 131 + 8 + 'px', height: (131 / canvasWidth) * canvasHeight + 34 + 'px' }" @click="setEditingPage(page)">
          <Page class="content" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', transform: 'scale(' + 131 / canvasWidth +')' }" :elements="page.elements" type="see" />
          <div class="icons clearfix">
            <i class="icon el-icon-delete" @click="delPage(page)"></i>
            <i class="icon el-icon-document" @click="copyPage(page)"></i>
          </div>
        </div>
      </li>
    </ul>
    <div class="list custom-scrollbar" style="z-index: 2;" v-show="viewState === 1" :class="{ dragging: dragState === 1 }">
      <ul>
        <li v-for="layer in layersNoBg">
          <div class="layer" :class="{ active: editingLayer === layer}" @click="setEditingLayer($event, layer)" @mousedown="moveLayer">
            <span class="thumb" :style="{ backgroundImage: 'url(' + http + layer.imgSrc + ')' }"></span>{{ layer.type }}
          </div>
        </li>
      </ul>
      <div v-for="layer in layersBg" class="layer" :class="{ active: editingLayer === layer}" @click="setEditingLayer($event, layer)">
        <span class="thumb" :style="{ backgroundImage: 'url(' + http + layer.imgSrc + ')' }"></span>{{ layer.type }}
      </div>
    </div>
    <!--<button class="add el-icon-plus" @click="addPage"></button>-->
  </div>
</template>
<script>
  import Page from './../../components/Page'
  import AppConst from '../../util/appConst'
  export default {
    data () {
      return {
        viewState: 1,
        dragState: 0,
        http: AppConst.BACKEND_DOMAIN
      }
    },
    computed: {
      vxEditor () {
        return this.$store.state['editor']
      },
      canvasWidth () {
        return this.vxEditor['canvasWidth']
      },
      canvasHeight () {
        return this.vxEditor['canvasHeight']
      },
      pages () {
        return this.vxEditor['editorTheme']['pages']
      },
      editingPage () {
        return this.vxEditor['editorPage']
      },
      layers () {
        return this.editingPage['elements']
      },
      layersNoBg () {
        return this.layers && this.layers.filter(v => v['type'] !== 'bg').reverse()
      },
      layersBg () {
        return this.layers && this.layers.filter(v => v['type'] === 'bg')
      },
      editingLayer () {
        return this.vxEditor['editorElement']
      }
    },
    methods: {
      moveLayer (downEvent) {
        let height = 30
        let timer = null
        let layer = downEvent.target
        let li = layer.parentNode
        let parent = li.parentNode
        let liLen = parent.childNodes.length
        let startTop = li.offsetTop
        let startIndex = Math.round(startTop / height)
        let targetIndex = null
        let placeholder = document.createElement('li')
        placeholder.style = 'height: ' + height + 'px; background-color: #d6d6d6'
        let move = (moveEvent) => {
          if (!timer) {
            // 被拖动的层
            let top = moveEvent.clientY - downEvent.clientY + startTop
            layer.setAttribute('data-moving', true)
            layer.style.top = top + 'px'
            this.dragState = 1
            // 占位层
            let nowIndex = Math.round(top / height)
            nowIndex = nowIndex <= 0 ? 0 : nowIndex > liLen - 1 ? liLen - 1 : nowIndex
            if (targetIndex !== nowIndex) {
              (targetIndex || targetIndex === 0) && parent.removeChild(placeholder)
              targetIndex = nowIndex
              parent.insertBefore(placeholder, parent.childNodes[nowIndex + (startIndex >= targetIndex ? 0 : 1)])
            }
            // timer负责减少onmousemove对客户端的负担
            timer = setTimeout(() => {
              timer = null
            }, 20)
          }
        }
        let up = (upEvent) => {
          if (layer.getAttribute('data-moving')) {
            layer.removeAttribute('data-moving')
            layer.style.top = ''
            parent.removeChild(placeholder)
            this.layersNoBg[startIndex]['zindex'] = this.layersNoBg[targetIndex]['zindex'] + (targetIndex > startIndex ? -0.5 : 0.5)
            this.updateLayersSort()
          }
          document.removeEventListener('mousemove', move)
          document.removeEventListener('mouseup', up)
          this.dragState = 0
        }
        if (liLen > 1) {
          document.addEventListener('mousemove', move)
          document.addEventListener('mouseup', up)
        }
      },
      copyPage (page) {
        this.$store.dispatch('copyPage', page)
      },
      delPage (page) {
        this.$store.dispatch('delPage', page)
      },
      addPage () {
        this.$store.dispatch('addPage')
      },
      setEditingPage (page) {
        this.$store.dispatch('setEditorPage', page)
      },
      setEditingLayer (event, layer) {
        this.$store.dispatch('setEditorElement', layer)
      },
      updateLayersSort () {
        this.$store.dispatch('sortElementsByZindex')
      }
    },
    components: { Page }
  }
</script>
<style lang="less" scoped>
  .overview {
    position: relative;
    border-right: 1px solid #d6d6d6;
    background-color: #ececec;
    height: 100%;
    .panel {
      float: left;
      line-height: 40px;
      width: 50%;
      text-align: center;
      background-color: #d6d6d6;
      cursor: pointer;
      &.active {
        background-color: transparent;
      }
    }
    .list {
      background-color: #ececec;
      position: absolute;
      top: 40px;
      bottom: 50px;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .dragging:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10;
    }
    .page {
      position: relative;
      border-color: transparent;
      border-style: solid;
      border-width: 4px 4px 30px;
      margin: 10px;
      &.active {
        border-color: #18ccc0;
        .icons {
          display: block;
        }
      }
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
      }
      .content {
        transform-origin: left top;
        background-color: #fff;
        overflow: hidden;
        position: relative;
      }
      .icons {
        position: absolute;
        bottom: -1.5em;
        right: 0.5em;
        display: none;
        width: 100%;
        color: #fff;
        .icon {
          float: right;
          margin-left: 1em;
          opacity: 0.5;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    .layer {
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #d6d6d6;
      cursor: pointer;
      &[data-moving] {
        background-color: #d6d6d6;
        position: absolute;
        width: 100%;
      }
      &:hover {
        background-color: #d6d6d6;
      }
      &.active {
        background-color: #18ccc0;
        color: #fff;
      }
      .thumb {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 1em;
        background: white center no-repeat;
        background-size: cover;
      }
    }
    .add {
      border: none;
      position: absolute;
      bottom: 0;
      height: 50px;
      line-height: 50px;
      width: 100%;
      left: 0;
      background-color: #373f42;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
</style>
