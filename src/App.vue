<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // 是否登录
    if (this.$store.state.user.id) {
      console.log(this.$store.state.user.id, 'wsss')
      // this.$store.commit('chat/wsLogin', this.$store.state.user.id)
    }
  }
}
</script>
