<template>
  <div class="app-container">
    <!--    按钮-->
    <div>
      <el-button type="primary" @click="FormShow=true">添加</el-button>
    </div>
    <!--    列表信息-->
    <div>
      <el-table
        :data="data"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80"
        />

        <el-table-column
          prop="title"
          label="新闻标题"
        />
        <el-table-column prop="type_title" label="分类" />
        <el-table-column label="内容" >
          <template slot-scope="scope">
            <el-button size="small" @click="Info=scope.row.content,InfoShow=true">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="update_data(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除这条数据?" @onConfirm="delete_data(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
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
    <!--    添加修改表单-->
    <div>
      <el-dialog :visible.sync="FormShow">
        <el-form ref="form" :model="DataForm" label-width="80px">
          <el-form-item label="搜索分类">
            <el-input v-model="DataForm.keyword" @input="get_type" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="DataForm.type" placeholder="请选择分类" @change="type_change">
              <el-option v-for="(item,index) in TypeList" :key="index" :label="item.title" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="DataForm.title" />
          </el-form-item>
          <el-form-item>
            <editor-bar v-model="DataForm.content" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="FormShow = false">取 消</el-button>
          <el-button type="primary" @click="data_submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--    信息查看-->
    <div>
      <el-dialog :visible.sync="InfoShow">
        <div v-html="Info" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="InfoShow = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { news_add, news_delete, news_list, news_type_all, news_update } from '@/api/web'
  import EditorBar from '@/components/wangEnduit'
  export default {
    components: { EditorBar },
    data() {
      return {
        data: [],
        page: 1,
        limit: 10,
        count: 0,
        DataForm: {
          title: '',
          keyword: '',
          type: '',
          content: ''
        },
        FormShow: false,
        InfoShow: false,
        TypeList: [],
        Info: '',
        DataRes: {}
      }
    },
    created() {
      this.get_list()
      this.get_type()
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
        news_list(this.page, this.limit).then(res => {
          this.data = res.data
          this.count = res.count
        })
      },
      // 获取新闻分类列表
      get_type() {
        news_type_all(this.DataForm.keyword).then(res => {
          this.TypeList = res.data
          this.DataForm.type = ''
        })
      },
      // 分类改变事件
      type_change(data) {
        this.DataForm.keyword = this.TypeList[data].title
      },
      // 数据提交
      data_submit() {
        const formData = new FormData()
        formData.append('type', this.TypeList[this.DataForm.type].id)
        if (!this.DataForm.title) {
          this.$message.error('请输入标题')
          return
        }
        formData.append('title', this.DataForm.title)
        if (!this.DataForm.content) {
          this.$message.error('请输入内容')
          return
        }
        formData.append('content', this.DataForm.content)
        if (this.DataForm.id) {
          formData.append('id', this.DataForm.id)
          this.DataRes = news_update(formData)
        } else {
          this.DataRes = news_add(formData)
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
      // 数据修改
      update_data(data) {
        this.DataForm = data
        this.FormShow = true
        for (let i = 0; i < this.TypeList.length; i++) {
          if (data.type === this.TypeList.id) {
            this.DataForm.type = i
          }
        }
      },
      // 数据删除
      delete_data(data) {
        news_delete(data.id).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.get_list()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 分页改变事件
      page_change(data) {
        this.get_list(data)
      }
    }
  }
</script>
