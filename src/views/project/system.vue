<template>
  <div class="app-container">
    <p>
      <el-button
        type="primary"
        @click="openDialog(null)"
      >添加</el-button>

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
        width="95"
      >
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column
        label="图标"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-image class="icon" :src="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
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
        prop="created_at"
        label="管理"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="openDialog(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="del(scope.row.id)"
          >删除</el-button>
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

    <!-- 编辑/新增 -->
    <el-dialog
      title="表单"
      :visible="dialogFrom.show"
      @close="onClose"
    >
      <el-form
        ref="elForm"
        :model="formData"
        size="medium"
        label-width="100px"
      >
        <el-row>
          <el-form-item
            label="名称"
            prop="title"
          >
            <el-input
              v-model="formData.title"
              placeholder="请输入名称"
              :maxlength="20"
              clearable
              :style="{width: '100%'}"
            />
          </el-form-item>
          <el-col :span="10">
            <el-form-item
              label="图标"
              prop="icon"
              required
            >
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :before-upload="beforeIconUpload"
                :on-change="changeIcon"
                action="post"
              >
                <img
                  v-if="formData.icon"
                  :src="formData.icon"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button
          type="primary"
          @click="handelConfirm"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { system } from '@/api/project'

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
      limit: 10,
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
    console.log(this.url)
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
      system.getList(this.page, this.limit).then(response => {
        that.list = []
        response.data.forEach(row => {
          console.log(row)
          row.icon = that.url + row.icon
          that.list.push(row)
        })
        this.count = response.count
        this.listLoading = false
      }).catch((err) => { console.log(err.message) })
    },
    onClose() {
      this.dialogFrom.show = false
    },
    close() {
      this.dialogFrom.show = false
    },
    // 打开对话框
    openDialog(obj) {
      this.formData.id = 0
      this.formData.title = ''
      this.formData.icon = ''
      if (obj === null) {
        this.dialogFrom.module = 'add'
      } else {
        this.dialogFrom.module = 'save'
        this.formData.id = obj.id
        this.formData.icon = obj.icon
        this.formData.title = obj.title
      }
      this.dialogFrom.show = true
    },
    // 提交修改
    handelConfirm() {
      const that = this
      this.$refs['elForm'].validate(valid => {
        if (!valid) return

        // 提交
        const data = new FormData()
        data.append('title', this.formData.title)
        if (this.formData.id === 0) {
          // add
        data.append('icon', this.formData.fileIcon)
          system.add(data).then(response => {
            that.$message.success(response.msg || '操作成功')
            that.close()
            that.fetchData()
          }).catch(err => {
            that.$message.error(err.message || 'error')
          })
        } else {
          // modify
          if (this.formData.fileIcon) {
            data.append('icon', this.formData.fileIcon)
          }
          data.append('id', that.formData.id)
          system.save(data).then(response => {
            that.$message.success(response.msg || '操作成功')
            that.close()
            that.fetchData()
          }).catch(err => {
            that.$message.error(err.message || 'error')
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

      this.formData.fileIcon = file
      return false // don't auto upload
    },
    // 图片被改变
    changeIcon(file) {
      // 读图片预览
      const that = this
      var reader = new FileReader()
      reader.onload = (e) => {
        that.formData.icon = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },
    // 删除
    del(id) {
      const that = this
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        system.delete(id).then(response => {
          that.$message.success(response.msg)
          that.fetchData()
        }).catch(err => {
          that.$message.error(err.message || 'error')
        })
      }).catch(() => {})
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
