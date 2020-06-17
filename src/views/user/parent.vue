<template>
  <div class="app-container">
    <p>
      <el-input
        v-model="keyword"
        maxlength="16"
        style="width:300px;margin-right:15px"
        placeholder="请输入关键字进行搜索"
        @keyup.enter.native="search()"
      />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
    </p>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      >
        <template scope="scope">
          <span>{{ (page - 1) * limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家长昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="家长姓名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="家长电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="家长头像" width="110" align="center">
        <template slot-scope="scope">
          <el-image class="icon" :src="scope.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column label="家长性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>

      <el-table-column label="省">
        <template slot-scope="scope">
          {{ scope.row.province }}
        </template>
      </el-table-column>

      <el-table-column label="市">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>

      <el-table-column label="区">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>

      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="管理">
        <template slot-scope="scope">
          <div>
            <el-button size="small" type="primary" @click="edit(scope.row)">查看</el-button>
            <el-popconfirm title="确定删除这行信息吗?" @onConfirm="del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <p>
      <el-pagination
        background
        :current-page.sync="page"
        :page-size="limit"
        layout="total, prev, pager, next"
        :total="count"
        @current-change="fetchData"
      />
    </p>

    <el-dialog
      :visible.sync="centerDialogVisible"
      width="800px"
      center
      @close="intiHandle"
    >
      <el-table v-loading="listLoading" :data="childList" element-loading-text="Loading" fit highlight-current-row>
        <el-table-column
          label="序号"
          type="index"
          width="100"
          align="center"
        >
          <template scope="scope">
            <span>{{ (page - 1) * limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="姓名"
          width="120"
        />
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="class"
          label="班级"
          width="200"
        />

        <el-table-column
          prop="birthday"
          label="生日"
          width="200"
        />
      </el-table>

    </el-dialog>

  </div>
</template>

<script>
  import {
    user_parent,
    user_get_child
  } from '@/api/user'
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
        childList: [],
        count: 0,
        page: 1,
        limit: 10,
        keyword: '',
        listLoading: true,
        centerDialogVisible: false,
        rules: {
          title: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.fetchData(1)
    },
    methods: {
      // 关闭对话窗初始化数据
      intiHandle() {
        this.childList = []
      },
      /**
       * 查看数据
       */
      edit(obj) {
        this.form = obj
        this.centerDialogVisible = true
        this.getChildren(obj.id)
      },
      getChildren(id) {
        user_get_child(id).then(res => {
          if (res.code === 0) {
            this.childList = res.data
          }
        }).catch((err) => {
          console.log(err.message)
        })
      },
      // 拉取数据
      fetchData(page) {
        const that = this
        if (page) {
          this.page = page
          if (page <= 1) {
            that.page = 1
          }
        }
        this.listLoading = true
        user_parent(this.page, this.limit, this.keyword).then(response => {
          that.list = []
          response.data.forEach(row => {
            row.avatar = that.url + row.avatar
            that.list.push(row)
          })
          this.count = response.count
          this.listLoading = false
        }).catch((err) => {
          console.log(err.message)
        })
      },
      // 删除合伙人
      del(obj) {
        company_del(obj.id).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '删除失败')
          }
        }).catch(() => { })
      },
      // 搜索
      search() {
        if (this.keyword) {
          this.fetchData(1)
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
