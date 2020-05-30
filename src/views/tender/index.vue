<template>
  <div class="app-container">
    <p>
      <el-input v-model="keyword" maxlength="16" style="width:300px;margin-right:15px" placeholder="请输入关键字进行搜索" @keyup.enter.native="search()" />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
    </p>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="ID"
        width="64"
      >
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column label="项目类型">
        <template slot-scope="scope">
          {{ scope.row.realname }}
        </template>
      </el-table-column>

      <el-table-column label="编程语言">
        <template slot-scope="scope">
          <div>
            <p>前端语言: {{ scope.row.show_lang }}</p>
            <p>后端语言: {{ scope.row.admin_lang }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格区间">
        <template slot-scope="scope">
          ¥{{ scope.row.min_price }} ~ ¥{{ scope.row.max_price }}
        </template>
      </el-table-column>

      <el-table-column label="是否可议价">
        <template slot-scope="scope">
          <span v-if="scope.row.price_change==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>

      <el-table-column label="应用平台">
        <template slot-scope="scope">
          {{ scope.row.terminal }}
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.is_bidding==1">竞标中</span>
          <span v-else-if="scope.row.is_bidding==0">已结束</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="create_time"
        label="发布时间"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="update_time"
        label="最后修改"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="管理"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-popconfirm
            title="确定要封禁吗?"
            @onConfirm="user_ban(scope.row)"
          >
            <el-button
              v-if="scope.row.is_use===1"
              slot="reference"
              type="danger"
              size="small"
            >封禁</el-button>
          </el-popconfirm>
          <!-- <el-button>封禁</el-button> -->
          <el-button
            v-if="scope.row.is_use===0"
            type="primary"
            size="small"
            @click="user_ban(scope.row)"
          >解禁</el-button>
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
import { getList, getListWaitAudit, audit, publish } from '@/api/tender'
export default {
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      list: [],
      count: 0,
      page: 1,
      limit: 25,
      keyword: '',
      listLoading: true,
      formData: {
        title: undefined,
        icon: null,
        id: 0,
        // 欲上传文件对象
        fileIcon: null
      },

      rules: {
        title: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }]
      },
      // 表单
      dialogFrom: {
        show: false,
        module: 'add' // add=添加  save=修改
      }
    }
  },
  created() {
    this.fetchData(1)
  },
  methods: {
    // 拉取数据
    fetchData(page) {
      const that = this
      if (page) {
        this.page = page
        if (page <= 1) { that.page = 1 }
      }

      this.listLoading = true
      getList(this.page, this.limit, 0).then(response => {
        that.list = []
        response.data.forEach(row => {
          // row.icon = that.url + row.icon
          that.list.push(row)
        })
        this.count = response.count
        this.listLoading = false
      }).catch((err) => { console.log(err.message) })
    },
    // 搜索
    search() {
      if (this.keyword) {
        this.fetchData()
      } else {
        this.$message.warning('请输入关键词')
      }
    },
    // 查询全部
    all() {
      this.keyword = ''
      this.fetchData()
    }

  }
}
</script>

<style>
.el-upload__tip {
  line-height: 1.2;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.icon {
  width: 50px;
  height: 50px;
  border-radius: 3px;
}
</style>
