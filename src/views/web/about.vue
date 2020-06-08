<template>
  <el-table :data="data" stripe style="width: 100%">
    <el-table-column type="index" label="序号" align="center" width="80" />
    <el-table-column prop="title" label="标题" width="200" />
    <el-table-column prop="value" label="内容" />
    <el-table-column prop="note" label="备注" />
    <el-table-column label="管理" width="200">
      <template slot-scope="scope">
        <div>
          <el-button size="small" type="primary" @click="data_update(scope.row)">编辑</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

</template>
<script>
  import { about } from '@/api/web'
    export default {
      data() {
        return {
          data: [],
          UpdateForm: {
            title: ''
          },
          UpdateFormShow: false
        }
      },
      created() {
        this.get_list()
      },
      methods: {
        // 获取数据列表
        get_list() {
          about().then(res => {
            this.data = res.data
          })
        },
        // 数据修改
        data_update(data) {
          this.UpdateForm = data
          this.UpdateFormShow = true
        }
      }
    }
</script>

<style>

</style>
