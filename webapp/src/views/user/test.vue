<template>

</template>
<script>
export default {
  mounted () {
    this.$store.dispatch('login', {loginId: 'admin', password: 'admin'})
  }
}
</script>
