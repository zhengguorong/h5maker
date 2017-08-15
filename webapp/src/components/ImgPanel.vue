<template>
  <div>
    <PicPicker class="ele" @uploaded="uploadImage"></PicPicker>
    <div class="ele" v-if="type==='elementImg'" :style="{ backgroundImage: 'url(' + http + element.filePath + ')' }" @click="selectedImg(element)" v-for="element in picList"></div>
    <div class="ele" v-if="type==='bg'" :style="{ backgroundImage: 'url(' + http + element.filePath + ')' }" @click="selectedImg(element)" v-for="element in bgList"></div>
  </div>
</template>

<script>
import appConst from '../util/appConst'
import PicPicker from './PicturePicker'
export default {
  props: {
    selectedImg: {
      type: Function
    },
    type: {
      type: String,
      default: 'elementImg'
    },
    themeId: {
      type: String
    }
  },
  data () {
    return {
      http: appConst.BACKEND_DOMAIN
    }
  },
  computed: {
    picList () {
      return this.$store.state.editor.picList
    },
    bgList () {
      return this.$store.state.editor.bgList
    }
  },
  methods: {
    uploadImage (data) {
      this.$store.dispatch('savePic', {
        'imgData': data['base64'],
        'themeId': this.themeId,
        'width': data['width'],
        'height': data['height'],
        'type': this.type
      }).catch(err => {
        if (err.response.status === 413) {
          this.$message.error('请选择小于2M的文件')
        }
      })
    }
  },
  components: {
    PicPicker
  }
}
</script>

<style lang="less" scoped>
.ele {
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
</style>
