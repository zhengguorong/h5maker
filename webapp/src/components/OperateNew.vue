<template>
  <div class="operate">
    <div class="scale scale-nw" @mousedown.stop="mousedown($event, 'nw')"></div>
    <div class="scale scale-ne" @mousedown.stop="mousedown($event, 'ne')"></div>
    <div class="scale scale-sw" @mousedown.stop="mousedown($event, 'sw')"></div>
    <div class="scale scale-se" @mousedown.stop="mousedown($event, 'se')"></div>
    <div class="scale scale-n" @mousedown.stop="mousedown($event, 'n')"></div>
    <div class="scale scale-e" @mousedown.stop="mousedown($event, 'e')"></div>
    <div class="scale scale-s" @mousedown.stop="mousedown($event, 's')"></div>
    <div class="scale scale-w" @mousedown.stop="mousedown($event, 'w')"></div>
  </div>
</template>

<script>
  export default {
    props: ['element'],
    methods: {
      mousedown (downEvent, mark) {
        let startX = downEvent.clientX
        let startY = downEvent.clientY
        let ele = this.element
        let height = ele['height']
        let width = ele['width']
        let top = ele['top']
        let left = ele['left']
        let move = moveEvent => {
          let currX = moveEvent.clientX
          let currY = moveEvent.clientY
          let disY = currY - startY
          let disX = currX - startX
          let hasN = /n/.test(mark)
          let hasS = /s/.test(mark)
          let hasW = /w/.test(mark)
          let hasE = /e/.test(mark)
          let newHeight = +height + (hasN ? -disY : hasS ? disY : 0)
          let newWidth = +width + (hasW ? -disX : hasE ? disX : 0)
          ele['height'] = newHeight > 0 ? newHeight : 0
          ele['width'] = newWidth > 0 ? newWidth : 0
          ele['left'] = +left + (hasW ? disX : 0)
          ele['top'] = +top + (hasN ? disY : 0)
        }
        let up = () => {
          document.removeEventListener('mousemove', move)
          document.removeEventListener('mouseup', up)
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
      }
    }
  }
</script>
<style lang="less" scoped>
  .operate {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px dashed #000;
  }
  
  .scale {
    position: absolute;
    background: #fff;
    border: 1px solid #000;
    width: 7px;
    height: 7px;
    z-index: 1;
  }
  
  .scale-nw {
    top: -3.5px;
    left: -3.5px;
    cursor: nw-resize;
    border-radius: 50%;
  }
  
  .scale-ne {
    top: -3.5px;
    right: -3.5px;
    cursor: ne-resize;
    border-radius: 50%;
  }
  
  .scale-sw {
    bottom: -3.5px;
    left: -3.5px;
    cursor: sw-resize;
    border-radius: 50%;
  }
  
  .scale-se {
    bottom: -3.5px;
    right: -3.5px;
    cursor: se-resize;
    border-radius: 50%;
  }
  
  .scale-n {
    top: -3.5px;
    left: 50%;
    margin-left: -3.5px;
    cursor: n-resize;
  }
  
  .scale-e {
    right: -3px;
    top: 50%;
    margin-top: -3.5px;
    cursor: e-resize;
  }
  
  .scale-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3.5px;
    cursor: s-resize;
  }
  
  .scale-w {
    left: -3.5px;
    top: 50%;
    margin-top: -3.5px;
    cursor: w-resize;
  }
</style>
