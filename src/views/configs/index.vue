<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane
        v-for="(item, index) in configList"
        :label="item.name"
        :name="item.group"
        :key="index"
      >
      <el-form label-width="160px">
        <el-form-item v-for="(row, n) in item.item" :key="n" :label="row.title">
          <el-input v-if="row.type==='number'" v-model="row.value"/>

        </el-form-item>
      </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getAllConfig, updateAll } from '@/api/configs'
export default {
  data() {
    return {
      configList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      getAllConfig()
        .then(({ code, data, msg, count }) => {
          if (code === 0) {
            this.configList = data
          } else {
            this.$message.error(msg)
          }
        })
        .catch(() => {})
    },
    // 提交更改
    submitUpdate() {}
  }
}
</script>

<style lang="stylus"></style>
