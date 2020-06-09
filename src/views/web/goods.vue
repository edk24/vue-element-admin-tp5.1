<template>
  <div class="app-container">
    <!--    按钮-->
    <div>
      <el-button type="primary">添加</el-button>
    </div>
    <div class="app-container">
      <el-table :data="data" stripe style="width: 100%;">
        <el-table-column type="index" width="80" />
      </el-table>
    </div>
<!--    添加、修改弹出-->
    <div>

    </div>
  </div>
</template>

<script>
    export default {
        data() {
          return {
            data: {},
            page: 1,
            limit: 10,
            count: 0
          }
        },
      created() {

      },
      methods: {
          // 获取数据
        get_list(page) {
          if (page) {
            if (page <= 1) {
              page = 1
            }
            this.page = page
          }
        }
      }
    }
</script>

<style scoped>

</style>
