<template>
  <div class="app-container">
    <p>
      <el-button type="primary" @click="openDialogAdd()">添加权限</el-button>
    </p>
    <div class="block">
      <el-tree
        :data="data"
        node-key="id"
        :props="props"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
      />
    </div>

    <el-dialog
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="中文名称" prop="name_cn">
          <el-input v-model="formData.name_cn" />
        </el-form-item>
        <el-form-item label="上级" prop="pid">
          <el-select v-model="formData.pid" placeholder="请选择父级">
            <el-option v-for="item in all_permission" :id="item.key" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { get_permission_tree, get_permission_list, permission_update, permission_del, permission_add } from '@/api/permission'

export default {
  data() {
    return {
      data: [],
      props: {
        label: 'name_cn'
      },
      formData: {
        id: null,
        name: '',
        pid: 2,
        name_cn: ''
      },
       rules: {
          name: [
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          name_cn: [
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
       },
       // el-option
       all_permission: [],
       centerDialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 抓取数据
    fetchData() {
      // get tree
      get_permission_tree().then(({ code, msg, data }) => {
        this.data = data
      })
      // get all
      get_permission_list().then(({ code, msg, data }) => {
        this.all_permission = data
      })
    },
    // 删除节点
    remove(node, data) {
      permission_del(node.key).then(({ code, msg }) => {
        if (code === 0) {
          this.$message.success('删除成功')
          this.fetchData()
        } else {
          this.$message.error(msg || '删除失败')
        }
      }).catch(() => {
        this.$message.error('系统异常')
      })
    },
    // 修改
    openDialogUpdate(node, data) {
      this.centerDialogVisible = true
      Object.assign(this.formData, { name_cn: data.name_cn, name: data.name, id: data.id, pid: data.pid })
    },
    // 打开新增表单
    openDialogAdd() {
      this.centerDialogVisible = true
      Object.assign(this.formData, { name_cn: '', name: '', id: null, pid: null })
    },
    // 提交
    submit() {
      if (this.formData.name_cn === '') {
        this.$message.warning('权限名称不能为空')
        return false
      }
      if (this.formData.name === '') {
        this.$message.warning('权限名称不能为空')
        return false
      }

      this.centerDialogVisible = false
      console.log(this.formData)
      if (this.formData.id === null) {
        // add
        permission_add(this.formData).then(({ msg, code }) => {
          if (code === 0) {
            this.$message.success('添加成功')
            this.fetchData()
          } else {
            this.$message.error(msg || '添加失败')
          }
        }).catch(() => {
          this.$message.error('系统异常')
        })
      } else {
        // update
        permission_update(this.formData).then(({ msg, code }) => {
          if (code === 0) {
            this.$message.success('修改成功')
            this.fetchData()
          } else {
            this.$message.error(msg || '修改失败')
          }
        }).catch(() => {
          this.$message.error('系统异常')
        })
      }
    },
    // 渲染部分内容
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            &nbsp;&nbsp;&nbsp;
            <el-button size='mini' type='text' on-click={ () => this.openDialogUpdate(node, data) }>修改</el-button>
            <el-button size='mini' type='text' on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>)
    }

  }
}
</script>

<style lang="scss">
.block{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding:15px
}
</style>
