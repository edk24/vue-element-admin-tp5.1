<template>
  <div class="app-container">
    <p>
      <el-button
        type="primary"
        @click="create()"
      >添加文章</el-button>
    </p>
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="名称"
        width="180"
      />
      <el-table-column
        prop="abstract"
        label="摘要"
        width="180"
      >
      </el-table-column>

      <el-table-column
        prop="content"
        label="内容"
        width="500"
      >
      </el-table-column>

      <el-table-column
        prop="create_time"
        label="创建时间"
      />

      <el-table-column
        prop="update_time"
        label="更新时间"
      />

      <el-table-column label="管理">
        <template slot-scope="scope">
          <div>
            <el-button
              size="small"
              type="primary"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-popconfirm
              title="确定删除这个轮播图吗?"
              @onConfirm="del(scope.row)"
            >
              <el-button
                slot="reference"
                size="small"
                type="danger"
              >删除</el-button>
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
        <el-form-item label="名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.abstract" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" />
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
import { article_add, article_list, article_edit, article_del } from '@/api/article'
import { imgsrc } from '@/utils/index'
export default {
  data() {
    return {
      list: [], // 列表
      page: 1,
      limit: 25,
      count: 0,
      centerDialogVisible: false,
      form: {
        title: '',
        abstract: '',
        content: ''
      }
    }
  },
  // init
  created() {
    this.fetchData()
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

      article_list(this.page, this.limit).then(({ code, msg, data, count }) => {
        if (code === 0) {
          data.forEach(row => {
            // row.image = imgsrc(row.image)
            this.list.push(row)
          })
          this.count = count
          this.page++
        } else {
          this.$message.error(msg || '查询失败')
        }
      }).catch(() => { })
    },

    /**
     * 删除轮播
     */
    del(obj) {
      article_del(obj.id).then(({ code, msg }) => {
        if (code === 0) {
          this.$message.success('操作成功')
          this.fetchData(true)
        } else {
          this.$message.error(msg || '删除失败')
        }
      }).catch(() => { })
    },

    /**
     * 添加轮播图
     */
    create() {
      this.form = { title: '', image: '', sort: 99, to_type: '', to_url: '', pid: 0, id: null }
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
      console.log(this.form.abstract);
      const data = this.form
      const form = new FormData()
      form.append('title', this.form.title)
      form.append('abstract', this.form.abstract)
      form.append('content', this.form.content)

      if (this.form.id) {
        // update
        form.append('id', this.form.id)
        article_edit(form).then(({ code, msg }) => {
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
          this.$message.error('请输入标题');
          return;
        }
        if(!this.form.abstract){
          this.$message.error('请输入摘要');
          return;
        }
        if(!this.form.content){
          this.$message.error('请输入内容');
          return;
        }
        article_add(form).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.fetchData(true)
            this.centerDialogVisible = false
          } else {
            this.$message.error(msg || '操作失败')
          }
        }).catch(() => { })
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
