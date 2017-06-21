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
export default {
  props: {
    goback: Function,
    perViewAction: Function
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    deploy () {
      this.loading = true
      this.perViewAction().then(() => {
        setTimeout(() => {
          this.$emit('saveSuccess')
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
