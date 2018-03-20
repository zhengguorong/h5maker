<template>
  <div class="bm-img" ref="bmImg">
    <img class="origin-img" ref="naturalImg" :src="src" @load="loaded" @error="loadError" style="display:none">
    <div v-if="!ready" class="bm-img-loading"></div>
    <transition name="fade">
      <img v-if="ready && success" :src="src"/>
    </transition>
    <div v-if="ready && !success" class="bm-img-fail"></div>
  </div>
</template>
<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }

  .bm-img {
    font-size:0;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    &-loading {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url('../assets/images/default.png')
    }
    &-real {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
    &-fail {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url('../assets/images/default.png')
    }
  }
</style>
<script>
  import Vue from 'vue'
  export default {
    name: 'bm-img',
    data () {
      return {
        ready: false,
        success: false,
        naturalWidth: 0,
        naturalHeight: 0
      }
    },
    props: {
      src: {
        type: String
      }
    },
    methods: {
      loaded () {
        // 获取图片的原始宽高
        Vue.nextTick(() => {
          this.ready = true
          this.success = true
        })
      },
      loadError () {
        Vue.nextTick(() => {
          this.ready = true
          this.success = false
        })
      }
    }
  }
</script>
