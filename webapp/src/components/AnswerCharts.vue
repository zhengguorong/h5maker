<template>
  <div class="wrap">
    <div class="content">
      <div style="overflow-y: auto;height: 100%">
        <h2>建设中。。。</h2>
      </div>
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  /*::-webkit-scrollbar{width:0px}*/
  .wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(74, 74, 74, 0.5);
    z-index: 1001;
    overflow-y: scroll;
    justify-content: center;
    align-items: center;
    display: flex;
  .content {
    position: relative;
    width: 1050px;
    height: 658px;
    background: #fff;
    border: 1px solid #d6d6d6;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 20px;
  .preview-area {
    width: 340px;
    height: 530px;
    border: 1px solid #d6d6d6;
    float: left;
  iframe {
    width: 100%;
    height: 100%;
  }
  }
  .setting {
    color: #4a4a4a;
    font-size: 14px;
    float: right;
    width: 380px;
  .info {
  .input {
    margin-top: 10px;
  }
  }
  .qrcode {
    margin-top: 20px;
  }
  .code {
  .size {
    float: left;
  .radios {
    width: 80px;
    margin-top: 5px;
    margin-left: 30px;
  label {
    margin-left: 0px;
    margin-top: 10px;
  }
  button {
    margin-top: 15px;
  }
  }
  }
  }
  .link {
    width:100%;
    overflow: scroll;
  .link-title {
    margin: 10px 0;
  }
  .href {
    width: 280px;
    line-height: 36px;
    margin-right: 10px;
    overflow: scroll;
    float: left;
  input {
    border: 0;
    color: blue;
    width: 100%;
  }
  }
  }
  .edit {
    text-align: center;
    margin-top:20px;
  }
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
   * Created by Wesdint on 2017/7/25.
   */
  export default {
    data () {
      return {}
    },
    methods: {
      close () {
        this.$emit('closeView')
      }
    }
  }
</script>
