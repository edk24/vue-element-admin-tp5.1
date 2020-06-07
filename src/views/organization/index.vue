<template>
  <div class="app-container">
    <p>
      <el-input
        v-model="keyword"
        maxlength="16"
        style="width:300px;margin-right:15px"
        placeholder="请输入关键字进行搜索"
        @keyup.enter.native="search()"
      />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
    </p>
    <p>
      <!-- <el-button type="primary" @click="create()">添加合伙人</el-button> -->
    </p>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{ (page - 1) * limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
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

      <el-table-column label="详细地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>

      <el-table-column label="联系人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.contact }}
        </template>
      </el-table-column>

      <el-table-column label="联系人电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column label="对推广员返点">
        <template slot-scope="scope">
          {{ scope.row.rebate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
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

    <el-dialog :visible.sync="centerDialogVisible" width="600px" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="机构名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <!-- <el-form-item label="省">
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
        </el-form-item> -->
        <el-form-item label="联系人">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="form.phone" type="tel" maxlength="11" />
        </el-form-item>
        <el-form-item label="对推广员返点">
          <el-input v-model="form.rebate" />
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
        :current-page.sync="page"
        :page-size="limit"
        layout="total, prev, pager, next"
        :total="count"
        @current-change="fetchData"
      />
    </p>

  </div>
</template>

<script>
  import {
    exchange_add,
    train_list,
    train_del,
    train_edit
  } from '@/api/organization'
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
        current: '否', // 当前选中 是否推送 0-否  1-是
        // 表单
        form: {
          name: '',
          province: '',
          city: '',
          area: '',
          address: '',
          contact: '',
          phone: '',
          rebate: ''
        }
      }
    },
    created() {
      this.fetchData(1)
    },
    methods: {
      /**
       * 添加产品
       */
      create() {
        this.form = {
          name: '',
          // province: '',
          // city: '',
          // area: '',
          // address: '',
          contact: '',
          phone: '',
          rebate: ''
        }
        this.centerDialogVisible = true
      },
      /**
       * 编辑产品
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
        train_list(this.page, this.limit, this.keyword).then(response => {
          that.list = []
          response.data.forEach(row => {
            that.list.push(row)
          })
          this.count = response.count
          this.listLoading = false
        }).catch((err) => {
          console.log(err.message)
        })
      },
      submit() {
        // const form = new FormData()
        // form.append('name', JSON.stringify(this.form.name))
        // form.append('province', this.form.province)
        // form.append('city', this.form.city)
        // form.append('area', this.form.area)
        // form.append('address', this.form.address)
        // form.append('contact', JSON.stringify(this.form.contact))
        // form.append('phone', JSON.stringify(this.form.phone))
        // form.append('rebate', JSON.stringify(this.form.rebate))
        var form = {
          name: this.form.name,
          contact: this.form.contact,
          phone: this.form.phone,
          rebate: this.form.rebate
        }
        if (!this.form.name) {
          this.$message.error('请输入机构名称')
          return
        }
        console.log(form)
        // if(!this.form.province){
        //   this.$message.error('请输入省')
        //   return
        // }
        // if(!this.form.city){
        //   this.$message.error('请输入市')
        //   return
        // }
        // if(!this.form.area){
        //   this.$message.error('请输入区')
        //   return
        // }
        // if(!this.form.address){
        //   this.$message.error('请输入详细地址')
        //   return
        // }
        if (!this.form.contact) {
          this.$message.error('请输入联系人')
          return
        }
        if (!this.form.phone) {
          this.$message.error('请输入联系人电话')
          return
        }
        if (!this.form.rebate) {
          this.$message.error('请输入对推广人员返点')
          return
        }
        if (this.form.id) {
          // update
         // form.append('id', this.form.id)
          train_edit(this.form.id, form).then(({
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
          }).catch(() => {})
        } else {
          // create
          exchange_add(this.form).then(({
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
          }).catch(() => {})
        }
      },
      /**
       * 删除产品
       */
      del(obj) {
        train_del(obj.id).then(({
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
          this.fetchData()
        } else {
          this.$message.warning('请输入关键词')
        }
      },
      // 查询全部
      all() {
        this.keyword = ''
        this.fetchData()
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
