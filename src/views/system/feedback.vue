<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="64"
      />
      <el-table-column
        prop="nickname"
        label="用户名"
        width="180"
      />
      <el-table-column
        prop="content"
        label="反馈内容"
      />
      <el-table-column
        prop="create_time"
        label="提交时间"
      />
      <el-table-column
        prop="create_time"
        label="管理"
      >
        <template slot-scope="scope">
          <span>
            <el-button v-if="scope.row.read_status===0" size="small" type="primary" @click="submit_read(scope.row)">标记已读</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <p>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="limit"
        @current-change="fetchData"
      />
    </p>
  </div>
</template>

<script>
import { submit_read, getList } from '@/api/feedback'
export default {
  data() {
    return {
      list: [],
      page: 1,
      limit: 25,
      count: 0
    }
  },
  created() {
    this.fetchData(1)
  },
  methods: {
    fetchData(page = null) {
      if (page) {
        this.page = page
      }
        this.list = []

      getList(this.page, this.limit).then(({ code, msg, data, count }) => {
        this.count = count
        if (code === 0) {
          this.list = data
        } else {
          this.$message.error(msg || '查询失败')
          this.list = []
        }
      }).catch(() => {})
    },
    submit_read(data) {
      submit_read(data.id).then(({ code, msg }) => {
        if (code === 0) {
          this.$message.success('操作成功')
          this.fetchData()
        } else {
          this.$message.error(msg || '操作失败')
        }
      }).catch(() => {
        this.$message.error('系统错误')
      })
    }
  }
}
</script>

