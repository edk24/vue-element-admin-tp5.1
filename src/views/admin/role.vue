<template>
  <div class="app-container">
    <p>
      <el-button type="primary" @click="createRole()">添加角色</el-button>
    </p>

    <el-table
      :data="roleList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="64"
      />
      <el-table-column
        prop="title"
        label="角色名称"
        width="180"
      />
      <el-table-column
        prop="note"
        label="角色备注"
      />
      <el-table-column
        prop="create_time"
        label="创建时间"
      />
      <el-table-column
        prop="update_time"
        label="修改时间"
      />

      <el-table-column
        label="管理"
        fixed="right"
        align="center"
      >

        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="updateRole(scope.row)">修改</el-button>
          <el-popconfirm title="确定要删除吗?" @onConfirm="delRole(scope.row)">
            <el-button slot="reference" type="danger" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单 -->
    <el-dialog title="角色编辑" width="750px" :visible.sync="dialogFormVisible">

      <el-form :model="formData" size="medium" label-width="80px">
        <el-form-item
          label="角色名称"
          prop="title"
        >
          <el-input
            v-model="formData.title"
            placeholder="请输入名称"
            :maxlength="20"
          />
        </el-form-item>

        <el-form-item
          label="角色描述"
          prop="note"
        >
          <el-input
            v-model="formData.note"
            placeholder="请输入角色描述"
            :maxlength="20"
          />
        </el-form-item>

        <el-form-item
          label="角色权限"
          prop="note"
        >
          <el-transfer v-model="formData.permissions" :titles="['权限列表', '拥有权限']" :data="all_permissions" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { role_getlist, role_add, role_update, role_del } from '@/api/role'
import { get_permission_list } from '@/api/permission'

export default {
  data() {
    return {
      roleList: [],
      dialogFormVisible: false,
      formData: {
        id: 0,
        title: '',
        permissions: [],
        note: ''
      },
      // 全部权限
      all_permissions: [{ key: 0, label: 'ww' }]
    }
  },
  created() {
    this.get_all_permissions()
    this.fetchData()
  },
  methods: {
    // 查询所有权限
     get_all_permissions() {
      get_permission_list().then(({ data, code, msg }) => {
        if (code === 0) {
          this.all_permissions = data
        } else {
          this.$message.error('系统错误')
        }
      }).catch(() => {})
    },

    // 抓取数据
    fetchData() {
      role_getlist(1, 999).then(({ code, msg, data }) => {
        if (code === 0) {
          this.roleList = []
          data.forEach(row => {
            if (row.permissions !== '') {
              row.permissions = row.permissions.split(',')
              // to Int
              for (let i = 0; row.permissions.length > i; i++) {
                row.permissions[i] = parseFloat(row.permissions[i])
              }
            } else {
              row.permissions = []
            }
            this.roleList.push(row)
          })
        } else {
          this.$message.warning(msg)
        }
      }).catch(() => {
      })
    },
    // 创建
    createRole() {
      this.formData = { id: 0, title: '', permissions: [], note: '' }
      this.dialogFormVisible = true
    },
    // 修改
    updateRole(obj) {
      this.formData.id = obj.id
      this.formData.title = obj.title
      this.formData.note = obj.note
      this.formData.permissions = obj.permissions
      this.dialogFormVisible = true
      console.log(this.formData)
    },
    // 删除角色
    delRole(obj) {
        role_del(obj.id).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('删除成功')
            this.fetchData()
          } else {
            this.$message.error(msg)
          }
        }).catch(() => {})
    },
    // 提交
    submit() {
      // TODO: 保存会出现增加0的问题
      console.log(this.formData.permissions)
      const data = {
        title: this.formData.title,
        note: this.formData.note,
        permissions: this.formData.permissions.join(','),
        id: this.formData.id
      }

      if (this.formData.id === 0) {
        // add
        role_add(data).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success(msg || '操作成功')
            this.fetchData()
          } else {
            this.$message.error(msg || '操作失败')
          }
        }).catch(() => {})
      } else {
        // save
        data.id = this.formData.id
        role_update(data).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success(msg || '操作成功')
            this.fetchData()
          } else {
            this.$message.error(msg || '操作失败')
          }
        }).catch(() => {})
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss">

</style>
