<template>
  <div :class="[type!=='see'?'canvas':'']"  @click="cleanSelected">
    <template v-for="element in elements">
      <div v-if="element.type==='bg'"  class="bg-layer" style="background-color: rgb(250, 250, 250);">
        <div style="left: -499px; top: 0px; width: 100%; height: 100%; opacity: 1; ">
          <img :src="http + element.imgSrc" alt="" style="width: 100%;height: 100%;">
        </div>
      </div>
      <div @click.stop="selectedElement(element)">
        <PicElement :fileType="element.type" v-if="element.type==='pic' || element.type==='video'" :class="[element.playing?'animated ' + element.animatedName:'',element.loop?'infinite':'']" :element="element"
                    :style="{transform:'rotate('+element.transform+'deg)','z-index':element.zindex,opacity:element.opacity/100,width:element.width+'px',height:element.height+'px',top:element.top+'px',left:element.left + 'px','animation-duration':element.duration + 's','-webkit-animation-duration':element.duration + 's','animation-delay':element.delay + 's','-webkit-animation-delay':element.delay + 's'}"
                    :showOperate="editorElement == element">
        </PicElement>
        <FontElement class="element" v-if="element.type === 'text'" :element="element" :style="elementPosition(element)"></FontElement>
        <ShapesElement v-if="element.type==='icon'" :iconKey="element.iconKey" :element="element" :style="{fill:'#fff',transform:'rotate('+element.transform+'deg)','z-index':element.zindex,opacity:element.opacity/100,width:element.width+'px',height:element.height+'px',top:element.top+'px',left:element.left + 'px','animation-duration':element.duration + 's','-webkit-animation-duration':element.duration + 's','animation-delay':element.delay + 's','-webkit-animation-delay':element.delay + 's'}" :class="[element.playing?'animated ' + element.animatedName:'']" :showOperate="editorElement == element"></ShapesElement>
      </div>
    </template>
  </div>
</template>

<script>
  import PicElement from './Element/PicElement'
  import FontElement from './Element/FontElement'
  import ShapesElement from './Element/ShapesElement'
  import 'animate.css'
  import appConst from '../util/appConst'
  export default {
    data () {
      return {
        http: appConst.BACKEND_DOMAIN
      }
    },
    computed: {
      elementPosition () {
        return (ele) => {
          return {
            zIndex: ele['zindex'],
            top: ele['top'] + 'px',
            left: ele['left'] + 'px'
          }
        }
      }
    },
    props: {
      elements: {
        type: Array
      },
      editorElement: {
        type: Object
      },
      type: ''
    },
    methods: {
      selectedElement (element) {
        this.$store.dispatch('setEditorElement', element)
      },
      cleanSelected () {
        console.log('chean')
        this.$store.dispatch('setEditorElement', null)
      }
    },
    components: {
      PicElement, FontElement, ShapesElement
    }
  }

</script>

<style lang="less" scoped>
  div{
    -webkit-animation-fill-mode:none
  }
  .canvas {
    background-color: #fff;
    margin: 0 auto;
    position: relative;
  }
  .bg-layer{
    position:relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }
  .element {
    position: absolute;
  }
</style>
