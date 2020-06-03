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
      <el-button
        type="primary"
        @click="create()"
      >添加产品</el-button>
    </p>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{ (page - 1) * limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="商品首图" width="110" align="center">
        <template slot-scope="scope">
          <el-image class="icon" :src="scope.row.image" />
        </template>
      </el-table-column>

      <el-table-column label="兑换所需积分">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>

      </el-table-column>

      <el-table-column label="商品详情">
        <template slot-scope="scope">
          {{ scope.row.note }}
        </template>
      </el-table-column>

      <el-table-column label="是否是默认推送的产品">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_default"
            active-color="#409EFF"
            inactive-color="#dddddd"
            @change="setDefault($event,scope.$index)"
          />
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
        <el-form-item label="商品标题:" label-width="130px">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="商品首图:" label-width="130px">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
          >
            <img
              v-if="form.image"
              :src="form.image"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="兑换所需积分:" label-width="130px">
          <el-input v-model="form.price" />
        </el-form-item>
        <el-form-item label="商品详情:" label-width="130px">
          <el-input v-model="form.note" />
        </el-form-item>
        <el-form-item label="是否是默认推送:" label-width="130px">
          <el-select
            v-model="current"
            placeholder="请选择"
          >
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
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
    exchange_list,
    exchange_del,
    exchange_edit,
    exchange_default
  } from '@/api/product'
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
         title: '',
         image: '',
         imageFile: '', // 新图片文件
         price: '',
         note: '',
         is_default: ''
       }
      }
    },
    created() {
      this.fetchData(1)
    },
    methods: {
      // 设置默认按钮
      setDefault(e, index) {
        // console.log(e)
        // console.log(index)
        // // exchange_default
        // var isDefault = null
        // isDefault = e ? 1 : 0
        exchange_default(this.list[index].id).then(res => {
          if (res.code === 0) {
            this.fetchData(1)
          } else {
            this.$message.error(res.data.mgs)
          }
        })
      },
      /**
       * 添加产品
       */
      create() {
        this.form = { title: '', image: '', imageFile: '', price: '', note: '', is_default: '' }
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
        exchange_list(this.page, this.limit, this.keyword).then(response => {
          that.list = []
          response.data.forEach(row => {
            row.is_default = row.is_default == 1
            row.image = that.url + row.image
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
        form.append('price', this.form.price)
        form.append('note', this.form.note)
        form.append('is_default', this.current)
        if (data.imageFile) {
          form.append('image', data.imageFile)
        }
        if (!this.form.title) {
          this.$message.error('请输入商品标题')
          return
        }
        if (!this.form.image) {
          this.$message.error('请选择商品首图')
          return
        }
        if (!this.form.price) {
          this.$message.error('请输入兑换所需积分')
          return
        }
        if (!this.form.note) {
          this.$message.error('请输入商品详情')
          return
        }
        if (this.form.id) {
          // update
          form.append('id', this.form.id)
          exchange_edit(form).then(({ code, msg }) => {
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
          exchange_add(form).then(({ code, msg }) => {
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

        this.form.imageFile = file
        return false // don't auto upload
      },

      // 图片被改变
      changeImage(file) {
        // 读预览图片
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.form.image = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },
      /**
       * 删除产品
       */
      del(obj) {
        exchange_del(obj.id).then(({ code, msg }) => {
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
