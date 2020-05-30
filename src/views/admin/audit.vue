<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
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
          {{ scope.row.realname }}
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
        prop="created_at"
        label="管理"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="show_audit(scope.row)"
          >审核</el-button>
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

    <!-- 资料审核 弹框 -->
    <el-dialog
      title="资料审核"
      :visible.sync="audit_dialogVisible"
      width="600px"
      center
    >

      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="真实姓名">
          {{ cur_audit_info.realname }}
        </el-form-item>
        <el-form-item label="身份证号">
          {{ cur_audit_info.id_number }}
        </el-form-item>
        <el-form-item label="手机号">
          {{ cur_audit_info.phone }}
        </el-form-item>
      </el-form>
      <div class="demo-image__placeholder">
        <div class="block">
          <span class="demonstration">身份证正面</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.card_image.face"
            :preview-src-list="[cur_audit_info.card_image.face]"
          />
        </div>
        <div class="block">
          <span class="demonstration">身份证背面</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.card_image.back"
            :preview-src-list="[cur_audit_info.card_image.back]"
          />
        </div>
        <div class="block">
          <span class="demonstration">手持身份证</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.head_image"
            :preview-src-list="[cur_audit_info.head_image]"
          />
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="audit(cur_audit_info, 2)">拒绝</el-button>
        <el-button type="primary" @click="audit(cur_audit_info, 1)">通过</el-button>
      </span>
    </el-dialog>
    <!-- END 资料审核弹框 -->

  </div>
</template>

<script>
import { user_do_audit, user_audit_list } from '@/api/user'

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
      cur_audit_info: {
        card_image: { face: '', back: '' },
        head_image: '',
        id_number: '',
        phone: '',
        id: 0,
        realname: ''
      }, // 当前审核数据
      audit_dialogVisible: false, // 审核弹框显示状态

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
      user_audit_list(this.page, this.limit).then(response => {
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
    // 打开审核弹框
    show_audit(user) {
      this.cur_audit_info = user
      this.audit_dialogVisible = true
    },
    // 审核
    audit(user, status) {
      const that = this
      this.audit_dialogVisible = false
      if (status === 1) {
        // 通过
        user_do_audit(user.id, status, '').then(response => {
          that.$message.success(response.msg || '操作成功')
          that.fetchData()
        }).catch(err => {
          that.$message.error(err.message || 'error')
        })
      } else if (status === 2) {
        // 拒绝
        that.$prompt('请输入拒绝理由:', '审核', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S+$/,
          inputErrorMessage: '理由不能为空'
        }).then(({ value }) => {
          user_do_audit(user.id, status, value).then(response => {
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

.demo-image .block,
.demo-image__error .block,
.demo-image__placeholder .block {
  padding: 30px 0;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image .block:last-child,
.demo-image__error .block:last-child,
.demo-image__placeholder .block:last-child {
  border-right: none;
}
.demo-image .demonstration,
.demo-image__error .demonstration,
.demo-image__placeholder .demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__error .block,
.demo-image__placeholder .block {
  width: 49%;
}
.demo-image__error .el-image,
.demo-image__placeholder .el-image {
  width: 300px;
  height: 200px;
}
.demo-image__error .image-slot,
.demo-image__placeholder .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}
.demo-image__placeholder .dot {
  animation: dot 2s steps(3, start) infinite;
  overflow: hidden;
}
</style>
