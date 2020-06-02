<template>
  <div class="app-container">
    <p>
      <el-button type="primary" @click="create()">添加轮播图</el-button>
    </p>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="80"/>
      <el-table-column prop="title" label="名称" width="180"/>
      <el-table-column label="图片" width="250">
        <template slot-scope="scope">
          <el-image class="image" width="200" :src="scope.row.image">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="is_sub" label="轮播图信息">
        <template slot-scope="scope">
          <span>{{scope.row.explain}}</span>
          <!--  <span v-if="scope.row.is_sub===1">是</span>
          <span v-else>否</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="is_sub" label="轮播图分类">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
          <!-- <span v-if="scope.row.type===0">首页</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="is_show"
        label="是否展示"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="show_enable(scope.row)"
          />
        </template>
      </el-table-column> -->

      <el-table-column prop="to_type" label="跳转链接">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="create_time" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理">
        <template slot-scope="scope">
          <div>
            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除这个轮播图吗?" @onConfirm="del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="centerDialogVisible" width="600px" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="图片">

          <el-upload :show-file-list="false" :multiple="false" action="post" :before-upload="selectImg"
                     :on-change="changeImage">
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>

        </el-form-item>

        <el-form-item label="详细介绍">
          <el-input v-model="form.explain" placeholder="请输入轮播图信息"/>
        </el-form-item>

        <el-form-item label="分类">

          <el-select v-model="current" placeholder="请选择分类">
            <el-option v-for="(item,index) in typeArr" :key="index" :label="item" :value="index"/>

          </el-select>
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-input v-model="form.url" placeholder="请输入跳转链接"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    advertisement_add,
    advertisement_list,
    banner_enable,
    advertisement_edit,
    advertisement_del,
    advertisement_type
  } from '@/api/advertisement'
  import {
    imgsrc
  } from '@/utils/index'

  export default {
    data() {
      return {
        list: [], // 列表
        page: 1,
        limit: 25,
        count: 0,
        centerDialogVisible: false,
        typeArr: [], //位置/类型数组,
        form: {
          title: '',
          image: null,
          imageFile: null, // 新图片文件
          url: '',
          type: 0,
          id: null,
        },
        current: ''
      }
    },
    // init
    created() {
      this.fetchData();
      this.getBannerType();
    },
    methods: {
      /**
       * 抓取数据
       */
      fetchData(clear = false) {
        if (clear) {
          this.page = 1
          this.list = []
        }
        advertisement_list(this.page, this.limit).then(({
                                                          code,
                                                          msg,
                                                          data,
                                                          count
                                                        }) => {
          if (code === 0) {
            data.forEach(row => {
              row.image = imgsrc(row.image)
              this.list.push(row)
            })
            this.count = count
            this.page++
          } else {
            this.$message.error(msg || '查询失败')
          }
        }).catch(() => {
        })
      },
      /*
       * 获取轮播图位置
       */
      getBannerType() {
        advertisement_type().then(res => {
          if (res.code === 0) {
            this.typeArr = res.data
            this.current = this.typeArr[0]
          }
        })
      },
      /**
       * 展示开关
       */
      show_enable(obj) {
        banner_enable(obj.id, obj.is_show).then(({
                                                   code,
                                                   msg
                                                 }) => {
          if (code === 0) {
            this.$message.success('修改成功')
          } else {
            this.$message.error(msg || '修改失败')
            return false
          }
        }).catch(() => {
        })
      },
      /**
       * 删除轮播
       */
      del(obj) {
        advertisement_del(obj.id).then(({
                                          code,
                                          msg
                                        }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '删除失败')
          }
        }).catch(() => {
        })
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
        // 读图片预览
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.form.image = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },

      /**
       * 添加轮播图
       */
      create() {
        this.form = {
          title: '',
          image: null,
          imageFile: null, // 新图片文件
          url: '',
          type: 0,
          id: null
        }
        this.centerDialogVisible = true
      },
      /**
       * 编辑轮播图
       */
      edit(obj) {
        this.form = obj
        this.centerDialogVisible = true
      },
      /**
       * 提交表单
       */
      submit() {
        const data = this.form
        const form = new FormData()
        form.append('title', this.form.title)
        form.append('explain', this.form.explain)
        form.append('type', this.current)
        form.append('url', this.form.url)
        if (data.imageFile) {
          form.append('file', data.imageFile)
        }
        if (!this.form.title) {
          this.$message.error('请输入名称')
          return;
        }
        if (!this.form.explain) {
          this.$message.error('请输入轮播图信息')
          return;
        }
        if (!this.current) {
          this.$message.error('请输入轮播图分类')
          return;
        }
        if (!this.form.url) {
          this.$message.error('请输入跳转链接')
          return;
        }
        if (this.form.id) {
          // update
          form.append('id', this.form.id)
          advertisement_edit(form).then(({
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

          }).catch(() => {
          })
        } else {
          // create
          if (!this.form.imageFile) {
            this.$message.error(' 请选择图片 ')
            return
          }
          advertisement_add(form).then(({
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
          }).catch(() => {
          })
        }
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
