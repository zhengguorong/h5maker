<template>
  <div class="panel panel-shape clearfix">
    <svg class="shape"
         @click="addIcon('action-redo')">
      <use xlink:href="/static/svg/icon.svg#action-redo"></use>
    </svg>
    <svg class="shape"
         @click="addIcon('circle-fill')"
         fill="#000">
      <use xlink:href="/static/svg/icon.svg#circle-fill"
           fill="#000"></use>
    </svg>
    <svg class="shape"
         @click="addIcon('bmLogo')">
      <use xlink:href="/static/svg/icon.svg#bmLogo"
           fill="#fff"></use>
    </svg>
  </div>
</template>

<style lang="less" scoped>
.panel-shape {
  .shape {
    float: left;
    width: 80px;
    height: 80px;
    margin: 5px;
  }
}
</style>

<script>
export default {
  methods: {
    addIcon (iconKey) {
      let obj = {}
      obj.type = 'icon'
      obj.iconKey = iconKey
      obj.top = 0
      obj.left = 0
      obj.width = 100
      obj.height = 100
      this.$store.dispatch('addElement', obj)
    }
  }
}
</script>
