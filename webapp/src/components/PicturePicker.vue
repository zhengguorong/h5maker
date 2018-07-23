<template>
  <label class="lable"><input class="input" type="file" @change="fileChange"></label>
</template>

<style scoped>
.lable {
  display: block;
  cursor: pointer;
  width: 3em;
  height: 3em;
  background: url("../assets/addpic_large.png") no-repeat;
  background-size: cover;
}

.input {
  display: none;
}
</style>

<script>
import * as http from '../util/http'
export default {
  props: {
    themeId: {
      type: String
    },
    fileType: {
      type: String,
      default: 'image'
    }
  },
  methods: {
    fileChange (event) {
      let file = event.target.files[0]
      if (file) {
        const formData = new window.FormData()
        formData.append('image', file)
        formData.append('themeId', this.themeId)
        formData.append('fileType', this.fileType)
        if (this.fileType === 'video') {
          http.post('/api/upload', formData).then(res => {
            this.$emit('uploaded', {
              filePath: res.filePath
            })
          })
        } else {
          var fr = new window.FileReader()
          fr.readAsDataURL(file)
          fr.onload = (e) => {
            var img = new window.Image()
            img.src = fr.result
            img.onload = () => {
              formData.append('width', img.width)
              formData.append('height', img.height)
              http.post('/api/upload', formData).then(res => {
                this.$emit('uploaded', {
                  filePath: res.filePath,
                  width: img.width,
                  height: img.height
                })
              })
            }
          }
        }
      }
    }
  }
}
</script>
