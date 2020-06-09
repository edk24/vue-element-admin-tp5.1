<template>
  <div class="app-container">
    <editor-bar v-model="content" style="width: auto" :is-clear="isClear" @change="change" />
  </div>
</template>

<script>
  import EditorBar from '@/components/wangEnduit'
    export default {
      components: { EditorBar },
        data() {
          return {
            isClear: false,
            detail: '',
            data: {},
            page: 1,
            limit: 10,
            count: 0,
            content: ''
          }
        },
      created() {

      },
      methods: {
        change() {
          console.log(12)
        }
      }
    }
</script>

<style scoped>

</style>
