<template>
  <div>
    <PicPicker class="ele"
               @uploaded="uploadImage" :themeId="themeId"></PicPicker>
    <div class="ele"
         :style="{ backgroundImage: 'url(' + http + element.filePath + ')' }"
         @click="selectedImg(element)"
         v-for="element in picList"></div>
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
    }
  },
  methods: {
    uploadImage (data) {
      this.$store.dispatch('savePic', {
        'filePath': data['filePath'],
        'themeId': this.themeId,
        'width': data['width'],
        'height': data['height']
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
