<template>
  <div class="app-container">
    <p>
      <el-input
        v-model="listQuery.keyword"
        maxlength="16"
        style="width:300px;margin-right:15px"
        placeholder="请输入关键字进行搜索"
        @keyup.enter.native="search()"
      />
      <el-button type="primary" @click="search()">搜索</el-button>

      <el-select v-model="listQuery.type" style="width: 150px" class="filter-item" @change="handleFilter">
        <el-option label="全部-分类" value="all" />
        <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
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
          <span>{{ (listQuery.page - 1) * listQuery.page + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="所属分类" align="center">
        <template slot-scope="scope">
          {{ scope.row.category.title }}
        </template>
      </el-table-column>
      <el-table-column label="产品展示图" width="200" align="center">
        <template slot-scope="scope">
          <el-image class="icon" :src="scope.row.image" />
        </template>
      </el-table-column>

      <el-table-column label="产品价格">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>

      </el-table-column>

      <el-table-column label="最高可抵用积分" width="120">
        <template slot-scope="scope">
          {{ scope.row.jifen }}
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

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog
      :visible.sync="centerDialogVisible"
      center
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="产品标题:" label-width="130px">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="分类：" label-width="130px">
          <el-select v-model="form.category_id" style="width: 150px">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述:" label-width="130px">
          <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>
        <el-form-item label="产品展示图:" label-width="130px">
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
        <el-form-item label="产品轮播图:" label-width="130px">
          <el-upload
            action="post"
            list-type="picture-card"
            :file-list="form.silderimgList"
            :on-preview="handlePictureCardPreview"
            :on-change="imgPreview"
            :before-upload="selectImg"
            :on-remove="handleRemove"
            :auto-upload="false"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="form.silder_image" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="产品价格:" label-width="130px" prop="price">
          <el-input v-model="form.price" maxlength="10" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="原价:" label-width="130px" prop="original_price">
          <el-input v-model="form.original_price" maxlength="10" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="最高可抵用积分:" label-width="130px">
          <el-input v-model="form.jifen" />
        </el-form-item>
        <el-form-item label="商品详情:" label-width="130px">
          <editor-bar v-model="form.content" :is-clear="isClear" />
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
    goods_add,
    goods_list,
    goods_del,
    goods_edit,
      goods_upload_image,
      goods_del_image
  } from '@/api/product'
  import { category } from '@/api/category'
  import EditorBar from '@/components/wangEnduit'
  import Pagination from '@/components/Pagination'
  export default {
    components: { EditorBar, Pagination },
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
        categoryList: [],
        isClear: false,
        detail: '',
        total: 0,
        dialogVisible: false,
        url: process.env.VUE_APP_BASE_API,
        listQuery: {
          page: 1,
          limit: 10,
          type: 'all',
          keyword: ''
        },
        list: [],
        count: 0,
        listLoading: true,
        centerDialogVisible: false,
        formData: {
          title: undefined,
          icon: null,
          id: 0,
          // 欲上传文件对象
          fileIcon: null,
          silder_image: []
        },
        silderimgList: [],
        rules: {
          title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          price: [
            { required: true, type: 'string', trigger: 'blur', message: '金额不能为空' },
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
          ],
          original_price: [
            { required: true, type: 'string', trigger: 'blur', message: '金额不能为空' },
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
          ]
        },
        current: '否', // 当前选中 是否推送 0-否  1-是
        // 表单
       form: {
         title: '',
         image: '',
         imageFile: '', // 新图片文件
         price: '',
         point: '',
         content: ''
       }
      }
    },
    created() {
      this.fetchData()
      this.getCategoryList()
    },
    methods: {
      /**
       * 添加产品
       */
      create() {
        this.form = {
         title: '',
         image: '',
         imageFile: '', // 新图片文件
         price: '',
         point: '',
         content: ''
        }
        this.centerDialogVisible = true
      },
      handleFilter() {
        this.listQuery.page = 1
        this.fetchData()
      },
      getCategoryList() {
        category.getlist(1, 999, '', 'goods').then(res => {
          this.categoryList = res.data
        }).catch(e => {
          console.log(e)
        })
      },
      handleRemove(file) {
        if (this.form.id) {
          goods_del_image(this.form.id, file.url).then(res => {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1200
            })
          })
        }
      },
      // 点击放大图片
      handlePictureCardPreview(file) {
        this.form.silder_image = file.url
        this.dialogVisible = true
      },
      // 图片上传事件
      imgPreview(file, fileList) {
        // const that = this
        this.imgStatus = true
        const fileName = file.name
        const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
        if (regex.test(fileName.toLowerCase())) {
          this.form.silder_image = file.url
        } else {
          this.$message.error('请选择图片文件')
        }
        this.silderimgList = []
        for (let i = 0; i < fileList.length; i++) {
          let obj = {}
          obj = fileList[i].raw
          this.silderimgList.push(obj)
        }
        this.form.name = fileList[0].raw
        console.log('图片上传事件')

        if (this.form.id) {
          const data = new FormData()
          data.append('id', this.form.id)
          data.append('images', file.raw)
          goods_upload_image(data).then(res => {
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 1200
            })
          }).catch(error => {
            console.log(error)
          })
        }
      },
      /**
       * 编辑产品
       */
      edit(obj) {
        const that = this
        this.form = obj
        console.log(this.form)
        this.form.silderimgList = []
        if (obj.images !== '') {
          var img = (obj.images).split(';')
          img.forEach(function(row, index) {
            row = that.url + row
            that.form.silderimgList.push({ url: row })
          })
        }
        this.centerDialogVisible = true
      },
      // 拉取数据
      fetchData() {
        const that = this
        // if (page) {
        //   this.listQuery.page = page
        //   if (page <= 1) {
        //     that.listQuery.page = 1
        //   }
        // }
        this.listLoading = true
        goods_list(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type).then(response => {
          that.list = []
          response.data.forEach(row => {
            row.image = that.url + row.image
            that.list.push(row)
          })
          this.total = response.count
          this.listLoading = false
        }).catch((err) => {
          console.log(err.message)
        })
      },
      submit() {
        const data = this.form
        const form = new FormData()
        form.append('title', this.form.title)
        if (this.form.category_id === '') {
          return this.$message.warning('分类为空')
        }
        form.append('category_id', this.form.category_id)
        form.append('desc', this.form.desc)
        form.append('price', this.form.price)
        form.append('point', this.form.point)
        form.append('content', this.form.content)
        form.append('jifen', this.form.jifen)
        if (data.imageFile) {
          form.append('image', data.imageFile)
        }
        if (!this.form.title) {
          this.$message.error('请输入产品标题')
          return
        }
        if (!this.form.image) {
          this.$message.error('请选择产品展示图')
          return
        }
        if (!this.form.price) {
          this.$message.error('请输入产品价格')
          return
        }
        if (!this.form.jifen) {
          this.$message.error('请填写最高可抵用积分')
          return
        }
        if (!this.form.content) {
          this.$message.error('请输入产品详情')
          return
        }
        if (this.form.id) {
          // update
          form.append('id', this.form.id)
          goods_edit(form).then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.fetchData(true)
              this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
          }).catch(() => { })
        } else {
          for (var i = 0; i < this.silderimgList.length; i++) {
            // 使用for循环添加图片
            if (i >= 9) { continue } // 图片数目不能大于9
            else {
              if (this.silderimgList[i].size <= 5242880) { // 上传图片不能超过5M
                form.append('images[]', this.silderimgList[i])
                /* 注意，这里的双引号里的变量名称后面必须要加上[]*/
              }
            }
          }
          // create
          goods_add(form).then(({ code, msg }) => {
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
        goods_del(obj.id).then(({ code, msg }) => {
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
        if (this.listQuery.keyword) {
          this.fetchData()
        } else {
          this.$message.warning('请输入关键词')
        }
      },
      // 查询全部
      all() {
        this.listQuery.keyword = ''
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
