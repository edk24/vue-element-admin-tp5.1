<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="FormShow = true">添加分类</el-button>
    </div>
    <!--    数据列表-->
    <el-table :data="data" stripe style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="title" label="标题" align="center" />
      <el-table-column label="图片" width="250">
        <template slot-scope="scope">
          <el-image class="image" width="200" :src="scope.row.image" style="width:100px; height:100px" fit="cover">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <el-popconfirm title="确定删除这条数据?" @onConfirm="data_del(scope.row)">
            <el-button type="danger">删除</el-button>
          </el-popconfirm>
          <el-button type="primary" @click="show_update(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    分页-->
    <div class="app-container">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="count"
        :page-size="limit"
        @current-change="page_change">
      </el-pagination>
    </div>
    <!--    修改或添加数据弹窗-->
    <el-dialog :visible.sync="FormShow" width="600px" center>
      <el-form ref="form" :model="DataForm" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="DataForm.title" />
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
        <el-form-item label="排序:">
          <el-input v-model="DataForm.sort" @input="DataForm.sort=DataForm.sort.replace(/\D/g,'')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="FormShow = false">取消</el-button>
        <el-button type="primary" @click="data_submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { category_add, category_delete, category_list, category_update } from '@/api/web'
    export default {
        data() {
          return {
            data: [],
            page: 1,
            limit: 10,
            count: 0,
            FormShow: false,
            DataForm: {
              title: '',
              image: '',
              sort: 5,
              imageFile: {}
            },
            data_res: {},
            http: process.env.VUE_APP_BASE_API
          }
        },
      created() {
        this.get_list()
      },
      methods: {
          // 获取数据列表
        get_list(page) {
          if (page) {
            if (page <= 1) {
              page = 1
            }
            this.page = page
          }
          category_list(this.page, this.limit).then(res => {
              res.data.forEach(data => {
                data.image = this.http + data.image
              })
            this.data = res.data
            this.count = res.count
          })
        },
        // 数据提交
        data_submit() {
          var data = new FormData()
          if (!this.DataForm.title) {
            this.$message.error('请输入标题')
            return
          }
          if (!this.DataForm.sort) {
            this.DataForm.sort = 5
          }
          data.append('title', this.DataForm.title)
          if (this.DataForm.imageFile) {
            data.append('image', this.DataForm.imageFile)
          }
          data.append('sort', this.DataForm.sort)
          if (this.DataForm.id) {
            data.append('id', this.DataForm.id)
            this.data_res = category_update(data)
          } else {
            if (!this.DataForm.imageFile) {
              this.$message.error('请上传图片')
              return
            }
            this.data_res = category_add(data)
          }
          this.data_res.then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.get_list()
              this.FormShow = false
              this.DataForm = {}
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        // 数据修改弹出处理
        show_update(data) {
          this.DataForm = data
          this.FormShow = true
        },
        // 页面改变
        page_change(data) {
          this.page = data
          this.get_list()
        },
        // 数据删除
        data_del(data) {
          category_delete(data.id).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.get_list()
            } else {
              this.$message.error(res.msg)
            }
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
        }
      }
    }
</script>

<style>

</style>
