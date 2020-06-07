<template>
  <div class="app-container">
    <p>
      <el-input v-model="keyword" maxlength="16" style="width:300px;margin-right:15px" placeholder="请输入关键字进行搜索" @keyup.enter.native="search()" />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
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
        label="序号"
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
          <span v-if="scope.row.sex==1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>

      <el-table-column label="实名状态">
        <template slot-scope="scope">
          <span v-if="scope.row.audit==0">待实名</span>
          <span v-else-if="scope.row.audit==3">已实名</span>
          <span v-else-if="scope.row.audit==2">实名失败</span>
          <span v-else-if="scope.row.audit==1">审核中</span>
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
        label="管理"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="admin_del(scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click="adminUpdateForm = true,UpdateForm.admin_id = scope.row.id">编辑</el-button>
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

    <!--  添加管理员的弹出-->
    <el-dialog title="添加管理员" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" placeholder="输入手机号查询用户" maxlength="11" autocomplete="off" @input="phone_to_admin" />
        </el-form-item>
        <el-form-item label="用户" :label-width="formLabelWidth">
          <el-select v-model="form.admin_id" placeholder="请选择用户">
            <div v-for="(item,index) in adminList" :key="index">
              <el-option :label="item.nickname" :value="item.id" />
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择角色">
            <div v-for="(item,index) in roleList" :key="index">
              <el-option :label="item.title" :value="item.id" />
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="admin_add">确 定</el-button>
      </div>
    </el-dialog>
    <!--    修改管理员弹出-->
    <el-dialog title="修改管理员" :visible.sync="adminUpdateForm">
      <el-form :model="UpdateForm">
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="UpdateForm.role" placeholder="请选择角色">
            <div v-for="(item,index) in roleList" :key="index">
              <el-option :label="item.title" :value="item.id" />
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adminUpdateForm = false">取 消</el-button>
        <el-button type="primary" @click="admin_update">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { admin_list, role, phoneUser, admin_add, admin_used, admin_role_update } from '@/api/admin'
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
      dialogFormVisible: false, // 添加管理员表单显示影藏
      // 添加管理员表单
      form: {
        phone: '',
        admin_id: '',
        role: ''
      },
      formLabelWidth: '120px', // 表单宽度
      roleList: [], // 角色列表
      adminList: [], // 手机号查出来的管理员列表
      adminUpdateForm: false, // 修改管理员表单显示影藏
      UpdateForm: {
        role: '',
        admin_id: 0
      }
    }
  },
  created() {
    this.fetchData(1)
    this.role_list()
  },
  methods: {
    // 获取管理员列表
    fetchData(page) {
      const that = this
      if (page) {
        this.page = page
        if (page <= 1) { that.page = 1 }
      }
      this.listLoading = true
      admin_list(this.page, this.limit, this.keyword).then(response => {
        that.list = []
        response.data.forEach(row => {
          row.avatar = that.url + row.avatar
          that.list.push(row)
        })
        this.count = response.count
        this.listLoading = false
      }).catch((err) => { console.log(err.message) })
    },
    // 获取角色列表
    role_list() {
      role('all').then(response => {
        this.roleList = response.data
      })
    },
    // 手机号查询用户
    phone_to_admin() {
      var phone = this.form.phone
      this.form.phone = phone.replace(/\D/g, '')
      phoneUser(this.form.phone).then(data => {
        this.adminList = data.data
      })
    },
    // 搜索
    search() {
      if (this.keyword) {
        this.fetchData()
      } else {
        this.fetchData()
      }
    },
    // 执行管理员添加
    admin_add() {
      if (!this.form.admin_id) {
        this.$message.error('请选择用户')
        return false
      }
      if (!this.form.role) {
        this.$message.error('请选择角色')
        return false
      }
      admin_add(this.form.admin_id, this.form.role).then(data => {
        if (data.code === 0) {
          this.$message.success('添加成功')
          this.fetchData(1)
          this.formLabelWidth = false
          this.title = ''
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 删除管理员
    admin_del(data) {
      admin_used(data.id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.fetchData(1)
          this.title = ''
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改管理员
    admin_update() {
      if (!this.UpdateForm.admin_id) {
        this.$message.error('信息错误')
        return false
      }
      if (!this.UpdateForm.role) {
        this.$message.error('请选择角色')
        return false
      }
      admin_role_update(this.UpdateForm.admin_id, this.UpdateForm.role).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功')
          this.fetchData(1)
        } else {
          this.$message.error(res.msg)
        }
      })
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
