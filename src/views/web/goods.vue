<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="FormShow = true">添加</el-button>
    </div>
    <div class="app-container">
      <el-table :data="data" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column prop="title" label="名称" width="180" />
        <el-table-column label="图片" width="250">
          <template slot-scope="scope">
            <el-image class="image" width="200" :src="scope.row.image">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="category_title" label="轮播图分类" />
        <el-table-column prop="introduce" label="简介" />
        <el-table-column prop="scope" label="使用范围" />
        <el-table-column label="其他信息" width="300">
          <template slot-scope="scope">
            <el-button size="mini" round @click="Info = scope.row.overview,InfoShow = true">概述</el-button>
            <el-button size="mini" round @click="Info = scope.row.analysis,InfoShow = true">解析</el-button>
            <el-button size="mini" round @click="Info = scope.row.accessories,InfoShow = true">配件</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理">
          <template slot-scope="scope">
            <div>
              <el-button size="small" type="primary" @click="data_update(scope.row)">编辑</el-button>
              <el-popconfirm title="确定删除这条数据?" @onConfirm="data_del(scope.row)">
                <el-button slot="reference" size="small" type="danger">删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    分页-->
    <div class="app-container">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
        :page-size="limit"
        @current-change="page_change()"
      />
    </div>
    <!--    产品添加、修改弹出-->
    <div>
      <el-dialog  :visible.sync="FormShow" title="添加数据">
        <el-form ref="form" :model="DataForm" label-width="80px">
          <el-form-item label="分类搜索">
            <el-input v-model="DataForm.keyword" placeholder="输入关键字进行搜索" autocomplete="off" @input="get_category" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="DataForm.category" placeholder="请选择分类" @change="category_change">
              <el-option v-for="(item,index) in CategoryList" :key="index" :label="item.title" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="图片:">
            <el-upload
              :show-file-list="false"
              :multiple="false"
              action="post"
              :before-upload="selectImg"
              :on-change="changeImage"
            >
              <img v-if="DataForm.image" :src="DataForm.image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>

          </el-form-item>
          <el-form-item label="产品名称">
            <el-input v-model="DataForm.title" placeholder="请输入产品名称" />
          </el-form-item>
          <el-form-item label="产品简介">
            <el-input v-model="DataForm.introduce" type="textarea" />
          </el-form-item>
          <el-form-item label="使用范围">
            <el-input v-model="DataForm.scope" type="textarea" />
          </el-form-item>
          <el-form-item label="产品概述">
            <editor-bar v-model="DataForm.overview" />
          </el-form-item>
          <el-form-item label="技术解析">
            <editor-bar v-model="DataForm.analysis" />
          </el-form-item>
          <el-form-item label="核心配件">
            <editor-bar v-model="DataForm.accessories" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="FormShow = false">取 消</el-button>
          <el-button type="primary" @click="data_submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--    产品其他信息弹出-->
    <div>
      <el-dialog :visible.sync="InfoShow" width="1000px" center>
        <div v-html="Info" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="InfoShow = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import EditorBar from '@/components/wangEnduit'
  import { category_all, goods_add, goods_delete, goods_list, goods_update } from '@/api/web'
    export default {
      components: { EditorBar },
        data() {
          return {
            data: [],
            page: 1,
            limit: 10,
            count: 0,
            DataForm: {
              keyword: '',
              title: '',
              category: 0,
              introduce: '',
              scope: '',
              overview: '',
              analysis: '',
              accessories: '',
              image: '',
              imageFile: {},
              id: 0
            },
            FormShow: false,
            CategoryList: [],
            // 数据提交返回对象
            DataRes: {},
            http: process.env.VUE_APP_BASE_API,
            InfoShow: false,
            Info: ''
          }
        },
      created() {
        this.get_category()
        this.get_list()
      },
      methods: {
        // 获取分类列表
        get_category() {
          category_all(this.DataForm.keyword).then(res => {
            if (res.data.length < 1) {
              this.CategoryList = []
              this.DataForm.category = ''
              return
            }
            this.CategoryList = res.data
            this.DataForm.category = ''
          })
        },
        // 分类改变事件
        category_change() {
          console.log(this.DataForm.category)
          this.DataForm.keyword = this.CategoryList[this.DataForm.category].title
        },
        // 数据提交
        data_submit() {
          const formData = new FormData()
          if (!this.CategoryList[this.DataForm.category]) {
            this.$message.error('选择产品分类')
            return
          }
          formData.append('category', this.CategoryList[this.DataForm.category].id)
          if (!this.DataForm.title) {
            this.$message.error('请输入产品标题')
            return
          }
          formData.append('title', this.DataForm.title)
          if (!this.DataForm.introduce) {
            this.$message.error('请输入产品简介')
            return
          }
          formData.append('introduce', this.DataForm.introduce)
          if (!this.DataForm.scope) {
            this.$message.error('请输入产品使用范围')
            return
          }
          formData.append('scope', this.DataForm.scope)
          if (!this.DataForm.overview) {
            this.$message.error('请输入产品概述')
            return
          }
          formData.append('overview', this.DataForm.overview)
          if (!this.DataForm.analysis) {
            this.$message.error('请输入技术解析')
            return
          }
          formData.append('analysis', this.DataForm.analysis)
          if (!this.DataForm.accessories) {
            this.$message.error('请输入核心配件')
            return
          }
          formData.append('accessories', this.DataForm.accessories)
          if (this.DataForm.imageFile) {
            formData.append('image', this.DataForm.imageFile)
          }
          if (this.DataForm.id) {
            formData.append('id', this.DataForm.id)
            this.DataRes = goods_update(formData)
          } else {
            if (!this.DataForm.imageFile) {
              this.$message.error('请上传文件')
              return
            }
            this.DataRes = goods_add(formData)
          }
          this.DataRes.then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.FormShow = false
              this.get_list()
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        // 获取数据列表
        get_list(page) {
          if (page) {
            if (page <= 1) {
              page = 1
            }
            this.page = page
          }
          goods_list(this.page, this.limit).then(res => {
            res.data.forEach(data => {
              data.image = this.http + data.image
            })
            this.data = res.data
            this.count = res.count
          })
        },
        /**
         * 事件-选择图片
         */
        selectImg(file) {
          // 验证
          // const isRightSize = file.size / 1024 < 500
          // if (!isRightSize) {
          //   this.$message.error('文件大小超过 500KB')
          // }
          const isAccept = new RegExp('image/*').test(file.type)
          if (!isAccept) {
            this.$message.error('应该选择image/*类型的文件')
          }

          this.DataForm.imageFile = file
          return false // don't auto upload
        },
        // 图片被改变
        changeImage(file) {
          // 读图片预览
          const that = this
          var reader = new FileReader()
          reader.onload = (e) => {
            that.DataForm.image = e.target.result
          }
          reader.readAsDataURL(file.raw)
        },
        // 页码改变
        page_change(data) {
          this.page = data
          this.get_list()
        },
        // 数据修改处理
        data_update(data) {
          this.DataForm = data
          for (let i = 0; i < this.CategoryList.length; i++) {
            if (this.CategoryList[i].id === data.category) {
              this.DataForm.category = i
            }
          }
          this.FormShow = true
          console.log(JSON.stringify(data))
        },
        // 删除数据
        data_del(data) {
          goods_delete(data.id).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.get_list()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
    }
</script>
