<template>
  <header class="header">
    <button class="reset-btn"
            @click="goback"><i class="el-icon-arrow-left"></i>返回作品</button>
    <div class="right-panel">
      <el-button @click="deploy"
                 class="preview"
                 type="info"
                 :loading="loading">预览</el-button>
    </div>
  </header>
</template>

<script>
import tools from '../util/tools'
export default {
  props: {
    goback: Function
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    deploy () {
      this.loading = true
      this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
        setTimeout(() => {
          this.$emit('saveThemeSuccess')
          this.loading = false
        }, 1000)
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
  .right-panel {
    float: right;
    height: 100%;
    width: 100px;
    display: flex;
    align-items: center;
    padding-right: 15px;
    flex-direction: row-reverse;
  }
}
</style>
