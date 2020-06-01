<template>
  <div class="app-container">
    <p>
      <el-input v-model="keyword" maxlength="16" style="width:300px;margin-right:15px" placeholder="请输入关键字进行搜索"
        @keyup.enter.native="search()" />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
    </p>
    <p>
      <el-button type="primary" @click="create()">添加股东</el-button>
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
      <el-table-column label="股东类型">
        <template slot-scope="scope">
          <span v-if="scope.row.company == 0">总公司股东</span>
          <span v-if="scope.row.company == 1">子公司股东</span>
        </template>
      </el-table-column>
      <el-table-column label="股东姓名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
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
            <el-button size="small" type="primary" @click="edit(scope.row,scope.$index)">编辑</el-button>
            <el-popconfirm title="确定删除这行信息吗?" @onConfirm="del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="centerDialogVisible" width="600px" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="股东类型">
          <el-select v-model="current" placeholder="股东类型">
            <el-option label="总公司股东" :value="0" />
            <el-option label="子公司股东" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="股东姓名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input type="tel" maxlength="11" v-model="form.phone" />
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

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>

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

  </div>
</template>

<script>
  import {
    shareholder_add,
    shareholder_list,
    shareholder_del,
    shareholder_edit
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
        current: '总公司股东', //当前股东类型
        // 表单
        form: {
          company: '',
          username: '',
          phone: '',
          province: '',
          city: '',
          area: '',
          address: ''
        }
      }
    },
    created() {
      this.fetchData(1)
    },
    methods: {
      /**
       * 添加股东
       */
      create() {
        this.form = {
          company: '',
          username: '',
          phone: '',
          province: '',
          city: '',
          area: '',
          address: ''
        };
        this.centerDialogVisible = true
      },
      /**
       * 编辑股东
       */
      edit(obj,index) {
        this.current = this.list[index].company == 0 ? '总公司股东' : '子公司股东';
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
        console.log(this.keyword);
        shareholder_list(this.page, this.limit, this.keyword).then(response => {
          console.log(123);
          console.log(response)
          that.list = []
          response.data.forEach(row => {
            row.license = that.url + row.license
            console.log(row);
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
        form.append('company', this.current)
        form.append('username', this.form.username)
        form.append('phone', this.form.phone)
        form.append('province', this.form.province)
        form.append('city', this.form.city)
        form.append('area', this.form.area)
        form.append('address', this.form.address)
        if (!this.form.username) {
          this.$message.error('请输入股东姓名');
          return;
        }
        if (!this.form.phone) {
          this.$message.error('请输入手机号');
          return;
        }
        if (!this.form.province) {
          this.$message.error('请输入省');
          return;
        }
        if (!this.form.city) {
          this.$message.error('请输入市');
          return;
        }
        if (!this.form.area) {
          this.$message.error('请输入区');
          return;
        }
        if (!this.form.address) {
          this.$message.error('请输入详细地址');
          return;
        }
        if (this.form.id) {
          // update
          form.append('id', this.form.id)
          shareholder_edit(form).then(({
            code,
            msg
          }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.fetchData(true)
              this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
            this.current = "总公司股东"
          }).catch(() => {})
        } else {
          // create
          shareholder_add(form).then(({
            code,
            msg
          }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.fetchData(true)
              this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
            this.current = "总公司股东"
          }).catch(() => {})
        }
      },
      /**
       * 删除股东
       */
      del(obj) {
        shareholder_del(obj.id).then(({
          code,
          msg
        }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '删除失败')
          }
        }).catch(() => {})
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
