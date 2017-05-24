<template>
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
      <PicPicker class="bgs"
                 @uploaded="uploadImage"
                 @style="style"></PicPicker>
      <div class="bgs"
           :style="{ backgroundImage: 'url(' + http + element.filePath + ')' }"
           @click="addBG(element.filePath)"
           v-for="element in picList"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
</style>

<script>
export default {
  props: {
    element: {
      type: Object
    },
    addBG: {
      type: Function
    },
    cleanBG: {
      type: Function
    }
  },
  data () {
    return {
      panelTabState: 0
    }
  }
}
</script>
