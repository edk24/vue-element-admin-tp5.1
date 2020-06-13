<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" @click="create()">添加合伙人</el-button>
    </el-row>

    <p>
      <el-row>
        <el-input v-model="keyword" placeholder="请输入关键词" style="width:260px" />
        <el-button type="primary" @click="fetchData(true)">搜索</el-button>
      </el-row>
    </p>

    <el-table :data="list" stripe>
      <el-table-column prop="title" label="企业名称" width="180" />
      <el-table-column prop="code" label="企业统一代码" width="180" />
      <el-table-column prop="username" label="联系人" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="commission" label="产品销售提成(%)" />
      <!-- <el-table-column label="地址">
        <template
          slot-scope="scope"
        >{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }} {{ scope.row.address }}</template>
      </el-table-column> -->
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗?" @onConfirm="del(scope.row)">
            <el-button slot="reference" size="small" type="danger" >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <p>
      <el-pagination background layout="prev, pager, next" :total="count" :page-size="limit" />
    </p>

    <!-- 表单 -->
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form label-width="80px" :model="formLabelAlign">
        <el-form-item label="企业名称">
          <el-input v-model="formLabelAlign.title" />
        </el-form-item>
        <el-form-item label="企业统一代码">
          <el-input v-model="formLabelAlign.code" />
        </el-form-item>
        <el-form-item label="营业执照">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="onBeforeUpload"
            :on-change="changeImage"
          >
            <img v-if="formLabelAlign.license" :src="formLabelAlign.license" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formLabelAlign.id==null" label="绑定用户">
          <el-select
            v-model="formLabelAlign.user_id"
            :disabled="formLabelAlign.id>0"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号检索"
            :remote-method="userSearch"
            :loading="loading"
          >
            <el-option
              v-for="item in userList"
              :key="item.nickname"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="formLabelAlign.username" />
        </el-form-item>
        <el-form-item label="联系手机">
          <el-input v-model="formLabelAlign.phone" />
        </el-form-item>
        <el-form-item label="产品销售提点(%)">
          <el-input v-model="formLabelAlign.commission" />
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
import {
  getList,
  create as company_create,
  del as company_del,
  update as company_update
} from '@/api/company'
import { user_search } from '@/api/user'
export default {
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      list: [],
      page: 1,
      limit: 25,
      count: 0,
      keyword: null,

      // 用户搜索
      userList: [],
      loading: false,

      // 表单
      dialogFormVisible: false,
      formLabelAlign: {
        id: null,
        user_id: 0,
        title: '',
        code: '',
        license: '',
        username: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        commission: '',
        license_obj: ''
      }
    }
  },
  created() {
    this.fetchData(true)
  },
  methods: {
    // 拉取数据
    fetchData(clear = false) {
      if (clear) {
        this.page = 1
        this.list = []
      }
      getList(this.page, this.limit, this.keyword)
        .then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              this.list.push(row)
            })
            this.page++
            this.count = count
          } else {
            this.$message.info(msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改表单
    edit(item) {
      this.formLabelAlign = item
      this.dialogFormVisible = true
    },
    // 创建表单
    create() {
      this.formLabelAlign = { id: null }
      this.dialogFormVisible = true
    },
    // 删除企业
    del(item) {
      company_del(item.id).then(({ code, msg }) => {
        if (code === 0) {
          this.$message.success('删除成功')
        this.fetchData(true)
        } else {
          this.$message.warning(msg || '删除失败')
        }
      }).catch(() => {
        this.$$message.error('系统错误, 请稍候再试')
      })
    },
    // 提交表单
    submit() {
      const formdata = new FormData()
      formdata.append('user_id', this.formLabelAlign.user_id)
      formdata.append('title', this.formLabelAlign.title)
      formdata.append('code', this.formLabelAlign.code)
      formdata.append('username', this.formLabelAlign.username)
      formdata.append('phone', this.formLabelAlign.phone)
      formdata.append('province', this.formLabelAlign.province)
      formdata.append('city', this.formLabelAlign.city)
      formdata.append('area', this.formLabelAlign.area)
      formdata.append('address', this.formLabelAlign.address)
      formdata.append('commission', this.formLabelAlign.commission)
      if (this.formLabelAlign.license_obj) {
        formdata.append('license', this.formLabelAlign.license_obj)
      }

      if (this.formLabelAlign.id === null) {
        // create
        company_create(formdata).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('保存成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '保存失败')
          }
        })
      } else {
        // update

        company_update(this.formLabelAlign.id, formdata).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('保存成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '保存失败')
          }
        })
      }

      this.dialogFormVisible = false
    },
    // 用户搜索
    userSearch(query) {
        if (query !== '') {
          this.loading = true
          user_search(query).then(({ code, count, data, msg }) => {
            if (code === 0) {
              this.userList = data
            } else {
              this.userSearch = []
              this.$message.warning(msg)
            }
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        } else {
          this.userSearch = []
          this.loading = false
        }
      },

    // On上传图片前
    onBeforeUpload(file) {
      // 验证
      const isRightSize = file.size / 1024 < 500
      if (!isRightSize) {
        this.$message.error('文件大小超过 500KB')
      }

      const isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }

      this.formLabelAlign.license_obj = file
      return false // don't auto upload
    },
    // on 图片被选中
    changeImage(file) {
      var reader = new FileReader()
      reader.onload = e => {
        this.formLabelAlign.license = e.target.result
      }
      reader.readAsDataURL(file.raw)
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
</style>
