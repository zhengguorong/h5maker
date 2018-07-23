<template>
  <div>
    <PicPicker class="ele"
               @uploaded="uploadVideo" :themeId="themeId" fileType="video"></PicPicker>
    <video :src="http + element.filePath" class="ele"
         @click="selectedVideo(element)"
         v-for="element in videoList"></video>
  </div>
</template>

<script>
import appConst from '../util/appConst'
import PicPicker from './PicturePicker'
export default {
  props: {
    selectedVideo: {
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
    videoList () {
      return this.$store.state.editor.videoList
    }
  },
  methods: {
    uploadVideo (data) {
      this.$store.dispatch('saveVideo', {
        'filePath': data['filePath'],
        'themeId': this.themeId
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
