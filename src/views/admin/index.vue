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

      <el-table-column
        label="头像"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-image class="icon" :src="scope.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column label="真实姓名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>

      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex==0">女</span>
          <span v-else-if="scope.row.sex==1">男</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>

      <el-table-column label="封号状态">
        <template slot-scope="scope">
          <span v-if="scope.row.is_use==0">已封号</span>
          <span v-else-if="scope.row.is_use==1">正常</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>

      <el-table-column label="封号理由">
        <template slot-scope="scope">
          <span v-if="scope.row.is_use==0">{{ scope.row.error_content }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实名状态">
        <template slot-scope="scope">
          <span v-if="scope.row.real_status==0">待实名</span>
          <span v-else-if="scope.row.real_status==1">已实名</span>
          <span v-else-if="scope.row.real_status==2">实名失败</span>
          <span v-else-if="scope.row.real_status==3">审核中</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="注册时间"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="修改时间"
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
import { user_use, user_ban, user_list } from '@/api/user'
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
    user_list(1, 10).then(res => {
      console.log(res)
    }).catch(() => {})

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
      user_list(this.page, this.limit, this.keyword).then(response => {
        that.list = []
        response.data.forEach(row => {
          console.log(row)
          row.avatar = that.url + row.avatar
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
    },
    // 封号/解封
    user_ban(user) {
      const that = this
      if (user.is_use === 0) {
        // 解除封号
        user_use(user.id).then(response => {
          that.$message.success(response.msg || '操作成功')
          that.fetchData()
        }).catch(err => {
          that.$message.error(err.message || 'error')
        })
      } else {
        // 封号
        that.$prompt('请输入封号理由:', '封号', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S{1,}$/,
          inputErrorMessage: '理由不能为空'
        }).then(({ value }) => {
          user_ban(user.id, value).then(response => {
            that.$message.success(response.msg || '操作成功')
            that.fetchData()
          }).catch(err => {
            that.$message.error(err.message || 'error')
          })
        }).catch(() => {})
      }
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
