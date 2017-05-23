<template>
  <div class="operate">
    <div class="operate-hor-line"></div>
    <div class="operate-ver-line"></div>
    <div class="scale scale-nw" data-direction="nw"></div>
    <div class="scale scale-ne" data-direction="ne"></div>
    <div class="scale scale-sw" data-direction="sw"></div>
    <div class="scale scale-se" data-direction="se"></div>
    <div class="scale scale-n" data-direction="n"></div>
    <div class="scale scale-e" data-direction="e"></div>
    <div class="scale scale-s" data-direction="s"></div>
    <div class="scale scale-w" data-direction="w"></div>
  </div>
</template>

<style lang="less" scoped>
  .operate {
    width: 100%;
    height: 100%;
  }
  
  .operate-hor-line::before, .operate-hor-line::after, .operate-ver-line::before, .operate-ver-line::after {
    content: '';
    position: absolute;
    border-color: #000;
    border-style: dashed;
    border-width: 0px;
  }

  .operate-hor-line::before {
    left: 0;
    top: 0;
    width: 100%;
    border-top-width: 1px;
  }
  
  .operate-hor-line::after {
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom-width: 1px;
  }

  .operate-ver-line::before {
    left: 0;
    top: 0;
    height: 100%;
    border-left-width: 1px;
  }

  .operate-ver-line::after {
    right: 0;
    top: 0;
    height: 100%;
    border-right-width: 1px;
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
    top: -3px;
    left: -2px;
    cursor: nw-resize;
    border-radius: 50%;
  }
  
  .scale-ne {
    top: -3px;
    right: -2px;
    cursor: ne-resize;
    border-radius: 50%;
  }
  
  .scale-sw {
    bottom: -3px;
    left: -2px;
    cursor: sw-resize;
    border-radius: 50%;
  }
  
  .scale-se {
    bottom: -3px;
    right: -2px;
    cursor: se-resize;
    border-radius: 50%;
  }
  
  .scale-n {
    top: -2px;
    left: 50%;
    margin-left: -5px;
    cursor: n-resize;
  }
  
  .scale-e {
    right: -3px;
    top: 50%;
    margin-top: -5px;
    cursor: e-resize;
  }
  
  .scale-s {
    bottom: -3px;
    left: 50%;
    margin-left: -5px;
    cursor: s-resize;
  }
  
  .scale-w {
    left: -3px;
    top: 50%;
    margin-top: -5px;
    cursor: w-resize;
  }
</style>