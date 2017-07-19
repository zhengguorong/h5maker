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
//  import lrz from 'lrz'
  import loadImge from 'blueimp-load-image'
  export default {
    methods: {
      fileChange (event) {
        let file = event.target.files[0]
        if (file.type.indexOf('image') === -1) return
        if (file) {
          loadImge(file, (canvas) => {
            let base64 = canvas.toDataURL()
            let img = document.createElement('img')
            img.onload = () => {
              this.$emit('uploaded', {
                'base64': base64,
                'width': img.width,
                'height': img.height
              })
            }
            img.src = base64
          }, {
            canvas: true,
            orientation: true
          })
//          lrz(file, {quality: 0.5}).then(result => {
//            if (result.fileLen > 2 * 1024 * 1024) {
//              this.$message.error('请选择小于2M的文件')
//              return
//            }
//            // let reader = new window.FileReader()
//            // reader.onload = (ev) => {
//            let img = document.createElement('img')
//            // let base64 = ''
//            // if (file.type.indexOf('png') > -1) {
//           //   base64 = result.base64.replace(/image\/jpeg/, 'image/png')
//           // }
//            let base64 = result.base64
//            img.onload = () => {
//              this.$emit('uploaded', {
//                'base64': base64,
//                'width': img.width,
//                'height': img.height
//              })
//            }
//            img.src = base64
//            // }
//            // reader.readAsDataURL(file)
//          })
        }
      }
    }
  }
</script>
