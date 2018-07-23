<template>
  <div class='wrap' @mousedown="mousedown" @mouseup="mouseup">
    <img v-if="fileType==='pic'" @dragstart="dragstart" style="width:100%;height:100%;" :src="http + element.imgSrc">
    <video v-if="fileType==='video'" @dragstart="dragstart" style="width:100%;height:100%;" :src="http + element.videoSrc"/>
    <Operate v-show="showOperate" @mousedown.native.stop="scaleMousedown" @mouseup.native.stop="scaleMouseup" @mousemove.native.stop="scaleMousemove"
    />
  </div>
</template>

<script>
    import Operate from '../Operate'
    import appConst from '../../util/appConst'
    export default{
      props: {
        element: {
          type: Object,
          require: true
        },
        showOperate: {
          type: Boolean
        },
        fileType: {
          type: String,
          default: 'pic'
        }
      },
      data () {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          currentX: 0,
          currentY: 0,
          flag: false,
          scaleFlag: false,
          direction: '',
          http: appConst.BACKEND_DOMAIN
        }
      },
      methods: {
        // 处理元素拖动
        move () {
          document.querySelector('.editor').onmousemove = (event) => {
            var e = event || window.event
            if (this.flag) {
              let nowX = e.clientX
              let nowY = e.clientY
              let disX = nowX - this.currentX
              let disY = nowY - this.currentY
              this.element.top = parseInt(this.top) + disY
              this.element.left = parseInt(this.left) + disX
            }
          }
        },
        // 处理元素伸缩
        scaleMousemove () {
          document.querySelector('.editor').onmouseup = (event) => {
            this.scaleFlag = false
          }
          document.querySelector('.editor').onmousemove = (event) => {
            var e = event || window.event
            if (this.scaleFlag) {
              let nowX = e.clientX
              let nowY = e.clientY
              let disX = nowX - this.currentX
              let disY = nowY - this.currentY
              switch (this.direction) {
                // 左边
                case 'w':
                  this.element.width = parseInt(this.width) - disX
                  this.element.left = parseInt(this.left) + disX
                  break
                // 右边
                case 'e':
                  this.element.width = parseInt(this.width) + disX
                  break
                // 上边
                case 'n':
                  this.element.height = parseInt(this.height) - disY
                  this.element.top = parseInt(this.top) + disY
                  break
                // 下边
                case 's':
                  this.element.height = parseInt(this.height) + disY
                  break
                // 左上
                case 'nw':
                  this.element.width = parseInt(this.width) - disX
                  this.element.left = parseInt(this.left) + disX
                  this.element.height = parseInt(this.height) - disY
                  this.element.top = parseInt(this.top) + disY
                  break
                // 左下
                case 'sw':
                  this.element.width = parseInt(this.width) - disX
                  this.element.left = parseInt(this.left) + disX
                  this.element.height = parseInt(this.height) + disY
                  break
                // 右上
                case 'ne':
                  this.element.height = parseInt(this.height) - disY
                  this.element.top = parseInt(this.top) + disY
                  this.element.width = parseInt(this.width) + disX
                  break
                // 右下
                case 'se':
                  this.element.height = parseInt(this.height) + disY
                  this.element.width = parseInt(this.width) + disX
                  break
              }
            }
          }
        },
        mousedown (e) {
          this.flag = true
          this.currentX = e.clientX
          this.currentY = e.clientY
          this.top = this.element.top
          this.left = this.element.left
          this.move()
        },
        mouseup (e) {
          this.flag = false
          this.scaleFlag = false
        },
        scaleMousedown (e) {
          this.scaleFlag = true
          this.currentX = e.clientX
          this.currentY = e.clientY
          this.top = this.element.top
          this.left = this.element.left
          this.width = this.element.width
          this.height = this.element.height
          this.direction = e.target.getAttribute('data-direction')
          this.scaleMousemove()
        },
        scaleMouseup (e) {
          this.scaleFlag = false
        },
        dragstart (event) {
          console.log('dragstart')
          event.preventDefault()
        }
      },
      components: {
        Operate
      }
    }
</script>

<style lang='less' scoped>
  .wrap {
    position: absolute;
    cursor: move;
  }

  .wrap img {
    position: absolute;
    user-select: none;
    /*-webkit-user-drag: none;*/
  }
</style>
