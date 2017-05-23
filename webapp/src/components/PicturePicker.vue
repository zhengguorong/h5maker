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
  export default {
    methods: {
      fileChange (event) {
        let file = event.target.files[0]
        if (file) {
          let reader = new window.FileReader()
          reader.onload = (ev) => {
            let img = document.createElement('img')
            let base64 = ev.target.result
            img.onload = () => {
              this.$emit('uploaded', {
                'base64': base64,
                'width': img.width,
                'height': img.height
              })
            }
            img.src = base64
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }
</script>
