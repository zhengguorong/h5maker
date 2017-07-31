<template>
<div>
  <div class="item">
    <label><i class="iconfont">&#xe70e;</i>背景色</label>
    <el-input class="input" type="color" v-model="bgColor"></el-input>
  </div>
  <div class="item clearfix">
    <label><i class="iconfont">&#xe621;</i>背景图</label>
    <el-button class="btn" type="danger" @click="cleanBG" v-if="bgList.length>0">移除背景图</el-button>
  </div>
  <div class="clearfix">
    <ImgPanel :selectedImg="addBG" type="bg"/>
  </div>
</div>
</template>

<style lang="less" scoped>
  .item{
    label {
      display:block;
      text-align: left;
      color:#48576a;
      padding: 18px 12px 12px 4px;
      font-size: 14px;
      float:left;
      i{
        font-size: 16px;
        margin-right:5px;
      }
    }
  }
  .btn {
    float: right;
    width: 36%;
    margin-top:6px;
  }
</style>

<script>
  /**
   * Created by tracy on 2017/7/31.
   */
  import ImgPanel from './ImgPanel'
  export default {
    data () {
      return {
        bgColor: ''
      }
    },
    computed: {
      editorPage () {
        return this.$store.state.editor.editorPage
      },
      bgList () {
        return this.$store.state.editor.bgList
      }
    },
    components: {
      ImgPanel
    },
    methods: {
      cleanBG () {
        this.$store.dispatch('cleanBG')
      },
      addBG (file) {
        this.$store.dispatch('addBGElement', { type: 'bg', imgSrc: file.filePath }).then(() => {
          this.bgColor = ''
        })
      }
    },
    watch: {
      bgColor (val) {
        let watch = true
        this.editorPage.elements.map(item => {
          if (item.type === 'bg' && !val) {
            watch = false
            return
          }
        })
        if (watch) {
          this.$store.dispatch('addBGElement', {type: 'bgColor', bg: val})
        }
      }
    }
  }
</script>
