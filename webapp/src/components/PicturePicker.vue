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
  import appConst from '../util/appConst'
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
          http.post('/api/upload', formData).then(res => {
            let img = document.createElement('img')
            img.onload = () => {
              this.$emit('uploaded', {
                'filePath': res.filePath,
                'width': img.width,
                'height': img.height
              })
            }
            img.src = appConst.BACKEND_DOMAIN + res.filePath
          })
        }
      }
    }
  }
</script>
