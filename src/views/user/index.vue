<template>
  <div class="app-container">

    <el-row>
      <el-input v-model="keyword" placeholder="请输入关键词" style="width:260px" />
      <el-button type="primary" @click="fetchData(true)">搜索</el-button>

    </el-row>

    <p />
    <p />
    <!-- <el-tabs v-model="status" @tab-click="fetchData(true)">
    <el-tab-pane label="家长" name="all"></el-tab-pane>
    <el-tab-pane label="学生" name="waitpay"></el-tab-pane>
    <el-tab-pane label="学校" name="waitdelivery"></el-tab-pane>
    <el-tab-pane label="培训机构" name="shipped"></el-tab-pane>
    <el-tab-pane label="合伙人" name="recived"></el-tab-pane>
    <el-tab-pane label="股东" name="recived"></el-tab-pane>
    <el-tab-pane label="未知" name="recived"></el-tab-pane>
  </el-tabs> -->

    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column label="头像" fixed>
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type===0">家长</span>
          <span v-else-if="scope.row.type===1">子公司</span>
          <span v-else-if="scope.row.type===2">培训机构</span>
          <span v-else-if="scope.row.type===3">股东</span>
          <span v-else-if="scope.row.type===4">学生</span>
          <span v-else-if="scope.row.type===5">未知</span>
          <span v-else-if="scope.row.type===6">学校</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="realname" label="真实姓名" />
      <el-table-column prop="money" label="余额" />
      <el-table-column prop="jifen" label="积分" />
      <el-table-column label="实名状态">
        <template slot-scope="scope">
          <span v-if="scope.row.audit!==3">通过</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex===1">男</span>
          <span v-else-if="scope.row.sex===0">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }}
          <p>{{ scope.row.address }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="注册时间" />
      <el-table-column label="管理" width="200">
        <el-button-group>
          <el-button size="mini" type="primary">查看孩子</el-button>
          <el-button size="mini" type="primary">学校信息</el-button>
          <el-button size="mini" type="primary">公司信息</el-button>
          <el-button size="mini" type="primary">机构信息</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </el-button-group>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <p>
      <el-pagination background layout="prev, pager, next" :total="count" :page-size="limit" />
    </p>
  </div>
</template>

<script>
import { user_list } from '@/api/user'
export default {
  data() {
    return {
      userList: [],
      count: 0,
      page: 1,
      limit: 25,
      keyword: '',
      type: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {

    // 抓取数据
    fetchData(clear = false) {
      if (clear) {
        this.userList = []
        this.page = 1
      }

      user_list(this.page, this.limit, this.keyword).then(({ code, msg, data, count }) => {
        if (code === 0) {
          data.forEach(user => {
            this.userList.push(user)
          })
          this.page++
          this.count = count
        } else {
          this.$message.warning(msg)
        }
      })
    },
  

  }
}
</script>
