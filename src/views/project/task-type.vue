<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
      </el-table-column>
      <el-table-column label="项目标题" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <el-image class="icon" :src="row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="上级" prop="type_pid" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.TypePid.length == 0">顶级</span>
          <span v-else>{{row.TypePid[0].title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开发终端" prop="task_terminal" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-for="item in row.task_terminal" :key="item.id">{{item.title}}<br/></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="update_time" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="项目标题" width="100px;" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="post"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeIconUpload"
            :on-change="changeIcon">
            <img v-if="temp.icon" :src="temp.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择上级" prop="pid">
          <el-select v-model="temp.pid" class="filter-item" placeholder="Please select">
            <el-option label="顶级" value="0" />
            <el-option v-for="item in this.list" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发终端" width="500" >
          <el-transfer v-model="value" style="line-height: 0px;" :titles="['终端列表', '拥有终端']" :data="terminal_list"></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { system } from '@/api/project'
  import Pagination from '@/components/Pagination'
  export default {
    components: { Pagination },
    data() {
      return {
        // 图片前缀
        url: process.env.VUE_APP_BASE_API,
        // 终端列表
        terminal_list: [],
        // 原始终端
        task_terminal: [],
        value: [],
        imageUrl: '',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        temp: {
          fileIcon: null
        },
        textMap: {
          update: 'Edit',
          create: 'Create'
        }
      }
    },
    created() {
      this.getTerList()
      this.getList()
    },
    methods: {
      // 请求开发终端
      getTerList() {
        system.getList().then(({ code, msg, data }) => {
          const dd = []
          for (let i = 0; i < data.length; i++) {
            dd.push({
              key: i,
              label: data[i].title
            })
          }
          this.terminal_list = dd
          this.task_terminal = data
        })
      },
      // 请求初始化列表
      getList() {
        const that = this
        that.listLoading = false
        // 请求项目类型
        system.Task_type_list(this.listQuery.page, this.listQuery.limit).then(({ code, msg, data, count }) => {

          that.list = []
          data.forEach(row => {
            row.icon = that.url + row.icon
            if (row.pid === 0) {
              row.pid = '顶级'
            }
            that.list.push(row)
            console.log(row.type_pid)
          })

          that.total = count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch(error => {
          console.log(error)
        })
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      },
      resetTemp() {
        this.value = []
        this.temp = {
          id: undefined,
          title: '',
          pid: null,
          icon: null
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 创建
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            const tempData = Object.assign({}, this.temp)
            var ter = this.terlist()
            const data = new FormData()
            data.append('pid', tempData.pid)
            data.append('title', tempData.title)
            data.append('icon', this.temp.fileIcon)
            data.append('terminal', ter)
            system.Task_type_add(data).then(response => {
              this.$message.success(response.msg || '操作成功')
              this.dialogFormVisible = false
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.fileIcon = null
        this.dialogStatus = 'update'
        var ter = this.terminal_list
        var task_terminal = row.task_terminal
        // 循环判断拥有的权限
        const res = []
        for (let i = 0; i < ter.length; i++) {
          for (let t = 0; t < task_terminal.length; t++) {
            if (ter[i].label === task_terminal[t].title) {
              res.push(ter[i].key)
            }
          }
        }
        this.value = res
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 修改
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          // const that = this
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            var ter = this.terlist()
            const data = new FormData()
            data.append('id', tempData.id)
            data.append('pid', tempData.pid)
            data.append('title', tempData.title)
            if (this.temp.fileIcon != null) {
              data.append('icon', this.temp.fileIcon)
            }
            data.append('terminal', ter)
            system.Task_type_edit(data).then(response => {
              this.$message.success(response.msg || '操作成功')
              this.dialogFormVisible = false
              this.getList()
            }).catch(error => {
              console.log(error)
            })
          }
        })
      },
      // 上传前
      beforeIconUpload(file) {
        // 验证
        const isRightSize = file.size / 1024 < 500
        if (!isRightSize) {
          this.$message.error('文件大小超过 500KB')
        }
        const isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
        }

        this.temp.fileIcon = file
        return false // don't auto upload
      },
      terlist() {
        var ter = this.terminal_list
        var valueres = this.value
        var task_terminal = this.task_terminal
        // 遍历选择的终端
        const res = []
        for (let i = 0; i < ter.length; i++) {
          for (let t = 0; t < valueres.length; t++) {
            if (ter[i].key === valueres[t]) {
              res.push(task_terminal[i].id)
            }
          }
        }
        return res
      },
      handleDelete(row, index) {
        const h = this.$createElement
        this.$msgbox({
          title: '提示框',
          message: h('p', null, [
            h('span', null, '是否确认删除？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              var id = { id: row.id }
              system.Task_type_del(id).then(response => {
                this.list.splice(index, 1)
                this.$notify({
                  title: 'Success',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
              })
              done()
            } else {
              done()
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      changeIcon(file) {
        // 读图片预览
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.temp.icon = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    }
  }

</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
</style>

