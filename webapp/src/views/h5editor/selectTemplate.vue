<template>
  <div class="wrap">
    <div class="content">
        <div class="title">选取模板</div>
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
 .wrap {
   position: fixed;
   top: 0;
   right: 0;
   bottom: 0;
   left: 0;
   background: rgba(74, 74, 74, 0.5);
   z-index: 1001;
   overflow-y: scroll;  justify-content: center;
   align-items: center;
   display: flex;
   .content {
     position: relative;
     width: 798px;
     height: 658px;
     background: #fff;
     border: 1px solid #d6d6d6;
     box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
     border-radius: 5px;
     padding: 20px;
     .title {
       text-align: center;
     }
   }
   .close {
     position: absolute;
     color: #fff;
     right: -30px;
     top:0px;
     cursor: pointer;
   }
 }
</style>

<script>
  /**
   * Created by wesdint on 2018/3/16.
   */
  export default {
    data () {
      return {

      }
    },
    props: {

    },
    methods: {
      close () {
        this.$emit('closeSelectTemplate')
      }
    }
  }
</script>
