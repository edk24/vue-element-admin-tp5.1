<template>
  <div class="app-container">
    <p>
      <el-button type="primary" @click="create()">添加轮播图</el-button>
      <template>
        <el-select v-model="type" placeholder="请选择" @change="type_change">
          <el-option
            v-for="item in BannerType"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </template>
    </p>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="title" label="名称" width="180" />
      <el-table-column label="图片" width="250">
        <template slot-scope="scope">
          <el-image class="image" width="200" :src="scope.row.image" style="width:100px; height:100px" fit="cover">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="is_sub" label="轮播图分类">
        <template slot-scope="scope">
          <span v-if="scope.row.type===0">首页</span>
          <span v-if="scope.row.type===1">关于我们</span>
          <span v-if="scope.row.type===2">产品中心</span>
          <span v-if="scope.row.type===3">新闻动态</span>
          <span v-if="scope.row.type===4">工程案例</span>
          <span v-if="scope.row.type===5">招商联盟</span>
          <span v-if="scope.row.type===6">服务支持</span>
          <span v-if="scope.row.type===7">联系我们</span>
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
            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除这个轮播图吗?" @onConfirm="data_del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="centerDialogVisible" width="600px" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="图片:">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
          >
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

        </el-form-item>
        <el-form-item label="分类:">
          <el-select v-model="form.type" placeholder="请选择分类">
            <el-option v-for="(item,index) in BannerType" :key="index" :label="item.title" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="排序:">
          <el-input v-model="form.sort" @input="form.sort=form.sort.replace(/\D/g,'')" />
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
  import { banner_list, banner_add, banner_update, banner_delete } from '@/api/web'
  export default {
    data() {
      return {
        list: [], // 列表
        page: 1,
        limit: 25,
        count: 0,
        centerDialogVisible: false,
        typeArr: [], // 位置/类型数组,
        form: {
          title: '',
          image: null,
          imageFile: null, // 新图片文件
          url: '',
          type: -1,
          id: null,
          sort: 5
        },
        // 轮播位置
        BannerType: [
          {
            value: -1,
            title: '全部'
          },
          {
            value: 0,
            title: '首页'
          },
          {
            value: 1,
            title: '关于我们'
          }, {
            value: 2,
            title: '产品中心'
          }, {
            value: 3,
            title: '新闻动态'
          }, {
            value: 4,
            title: '工程案例'
          }, {
            value: 5,
            title: '招商联盟'
          }, {
            value: 6,
            title: '服务支持'
          }, {
            value: 7,
            title: '联系我们'
          }
        ],
        current: '',
        type: ''
      }
    },
    // init
    created() {
      this.get_list()
    },
    methods: {
      // 获取轮播列表
      get_list(page) {
        if (page) {
          if (page <= 1) {
            page = 1
          }
          this.page = page
        }
        banner_list(this.page, this.limit,).then(res => {
          this.list = res.data
        })
      },
      // 选择轮播位置
      type_change() {
        this.page = 1
        banner_list(this.page, this.limit, this.type).then(res => {
          this.list = res.data
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
        console.log(JSON.stringify(data))
        const form = new FormData()
        if (data.imageFile) {
          form.append('image', data.imageFile)
        }
        if (!data.title) {
          this.$message.error('请输入名称')
          return
        }
        form.append('title', data.title)
        form.append('type', data.type)
        if (!data.sort) {
          data.sort = 5
        }
        form.append('sort', data.sort)
        if (this.form.id) {
          form.append('id', data.id)
          // update
          form.append('id', this.form.id)
          banner_update(form).then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.get_list()
              this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
          })
        } else {
          // create
          if (!this.form.imageFile) {
            this.$message.error(' 请选择图片 ')
            return
          }
          banner_add(form).then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('操作成功')
              this.get_list(1)
              this.centerDialogVisible = false
            } else {
              this.$message.error(msg || '操作失败')
            }
          })
        }
      },
      // 删除轮播
      data_del(data) {
        banner_delete(data.id).then(res => {
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
