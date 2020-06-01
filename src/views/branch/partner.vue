<template>
  <div class="app-container">
    <p>
      <el-input v-model="keyword" maxlength="16" style="width:300px;margin-right:15px" placeholder="请输入关键字进行搜索"
        @keyup.enter.native="search()" />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
    </p>
    <p>
      <el-button
        type="primary"
        @click="create()"
      >添加合伙人</el-button>
    </p>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center">
          <template scope="scope">
              <span>{{(page - 1) * limit + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="企业名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="社会统一代码">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="营业执照" width="110" align="center">
        <template slot-scope="scope">
          <el-image class="icon" :src="scope.row.license" />
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
            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除这行信息吗?" @onConfirm="del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination :total="count" :page.sync="page" :limit.sync="limit" @pagination="fetchData" /> -->
    <p>
      <el-pagination
         background
         @current-change="fetchData"
         :current-page.sync="page"
         :page-size="limit"
         layout="total, prev, pager, next"
         :total="count">
       </el-pagination>
    </p>

    <el-dialog
      :visible.sync="centerDialogVisible"
      width="600px"
      center
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="企业名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="社会统一代码">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="营业执照">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
          >
            <img
              v-if="form.license"
              :src="form.license"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="省">
          <el-input v-model="form.province" />
        </el-form-item>
        <el-form-item label="市">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="区">
          <el-input v-model="form.area" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submit()"
        >确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
  import {
    company_add,
    company_list,
    company_del,
    company_edit
  } from '@/api/branch'
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
        keyword: '',
        listLoading: true,
        centerDialogVisible: false,
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
       form: {
         title: '',
         code: '',
         license: '',
         licenseFile: '',  // 新图片文件
         username: '',
         phone: '',
         province: '',
         city: '',
         area: '',
         address:''
       }
      }
    },
    created() {
      this.fetchData(1)
    },
    methods: {
      /**
       * 添加轮播图
       */
      create() {
        this.form = { title: '', code: '',license: '', username: '',phone: '',province: '',city: '',area: '',address: '' }
        this.centerDialogVisible = true
      },
      /**
       * 编辑轮播图
       */
      edit(obj) {
        this.form = obj
        this.centerDialogVisible = true
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
        console.log(this.page);
        company_list(this.page, this.limit, this.keyword).then(response => {
          that.list = []
          response.data.forEach(row => {
            row.license = that.url + row.license
            that.list.push(row)
          })
          this.count = response.count
          this.listLoading = false
        }).catch((err) => {
          console.log(err.message)
        })
      },
      submit() {
        const data = this.form
        const form = new FormData()
        form.append('title', this.form.title)
        form.append('code', this.form.code)
        form.append('username', this.form.username)
        form.append('phone', this.form.phone)
        form.append('province', this.form.province)
        form.append('city', this.form.city)
        form.append('area', this.form.area)
        form.append('address', this.form.address)
        if (data.licenseFile) {
          form.append('license', data.licenseFile)
        }

        if (this.form.id) {
          // update
          form.append('id', this.form.id)
          company_edit(form).then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.fetchData(true)
              this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
          }).catch(() => { })
        } else {
          // create
          if(!this.form.title){
            this.$message.error('请输入企业名称')
            return
          }
          if(!this.form.code){
            this.$message.error('请输入社会统一代码')
            return
          }
          if(!this.form.license){
            this.$message.error('请选择图片')
            return
          }
          if(!this.form.username){
            this.$message.error('请输入真实姓名')
            return
          }
          if(!this.form.phone){
            this.$message.error('请输入手机号')
            return
          }
          if(!this.form.province){
            this.$message.error('请输入省')
            return
          }
          if(!this.form.city){
            this.$message.error('请输入市')
            return
          }
          if(!this.form.area){
            this.$message.error('请输入区')
            return
          }
          if(!this.form.address){
            this.$message.error('请输入详细地址')
            return
          }
          company_add(form).then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.fetchData(true)
               this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
          }).catch(() => { })
        }
      },
      /**
       * 事件-选择图片
       */
      selectImg(file) {
        // 验证
        const isRightSize = file.size / 1024 < 500
        if (!isRightSize) {
          this.$message.error('文件大小超过 500KB')
        }
        const isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
        }

        this.form.licenseFile = file
        return false // don't auto upload
      },

      // 图片被改变
      changeImage(file) {
        // 读预览图片
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.form.license = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },
      /**
       * 删除合伙人
       */
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
      },
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
