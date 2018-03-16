<template>
  <header class="header">
    <button class="reset-btn"
            @click="goback"><i class="el-icon-arrow-left"></i>返回作品</button>
    <div class="right-panel">
      <el-button @click="deploy"
                 class="preview"
                 type="info"
                 :loading="loading">预览</el-button>
      <div class="opt"><el-checkbox class="cbt" v-model="isCurTemplate">模板共享</el-checkbox> </div>
    </div>
    <!--<div class="right-panel">作为模板共享</div>-->
  </header>
</template>

<script>
export default {
  props: {
    goback: Function,
    perViewAction: Function,
    isTemplate: Boolean
  },
  data () {
    return {
      loading: false,
      isCurTemplate: false
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
  },
  watch: {
    isCurTemplate (val) {
      this.$emit('template_status', val)
    }
  },
  mounted () {
    this.isCurTemplate = this.isTemplate
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
    display: flex;
    align-items: center;
    padding-right: 15px;
    flex-direction: row-reverse;
  }
  .opt {
    margin-right: 10px;
  }
  .cbt {
    font-size: 16px;
    color: #fff;
  }
}
</style>
