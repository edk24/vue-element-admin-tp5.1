<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="small" @click="createRole()">添加角色</el-button>
    </el-row>

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
          <el-tree
            :data="menus"
            node-key="id"
            :props="{children:'child', label:'title'}"
            :default-checked-keys="formData.permissions"
            show-checkbox
            ref="tree"
          />
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
import { role_getlist, role_add, role_update, role_del, role_info } from '@/api/role'
import { get_permission_list } from '@/api/permission'
import { get_menu_tree } from '@/api/menu'

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
      all_permissions: [],
      menus: [],
      defaultProps: {
          children: 'child',
          label: 'label'
        }
    }
  },
  created() {
    this.get_all_permissions()
    this.fetchData()
  },
  methods: {
    // 查询所有权限
     get_all_permissions() {
      get_menu_tree().then(({ code, data, msg }) => {
        if (code === 0) {
          this.menus = data
        } else {
 this.$message.warning('查询菜单列表失败')
        }
      }).catch(() => {})
    },

    // 抓取数据
    fetchData() {
      role_getlist(1, 999).then(({ code, msg, data }) => {
        if (code === 0) {
          this.roleList = []
          data.forEach(row => {
            row.permissions = JSON.parse(row.permissions)
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
      const data = {
        title: this.formData.title,
        note: this.formData.note,
        permissions: JSON.stringify(this.$refs.tree.getCheckedKeys()),
        id: this.formData.id
      }

      if (this.formData.id === 0) {
        // add
        if (!this.formData.title) {
          this.$message.error('请输入角色名称')
          return
        }
        if (!this.formData.note) {
          this.$message.error('请输入角色备注')
          return
        }
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
