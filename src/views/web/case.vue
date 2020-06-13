<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div>
      <el-button type="primary" @click="FormShow = true,DataForm = {}">添加</el-button>
    </div>
    <!--  数据列表  -->
    <div class="app-container">
      <el-table :data="data" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column prop="title" label="新闻标题" />
        <el-table-column label="内容" >
          <template slot-scope="scope">
            <el-button size="small" @click="Info=scope.row.content,InfoShow=true">查看</el-button>
          </template>
        </el-table-column>
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
    <!--    添加修改弹出-->
    <div>
      <el-dialog :visible.sync="FormShow">
        <el-form ref="form" :model="DataForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="DataForm.title" />
          </el-form-item>
          <el-form-item label="内容">
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
  import EditorBar from '@/components/wangEnduit'
  import { case_add, case_delete, case_list, case_update } from '@/api/web'
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
              content: ''
            },
            FormShow: false,
            DataRes: {},
            keyword: '',
            Info: '',
            InfoShow: false
          }
        },
      created() {
        this.get_list()
      },
      methods: {
        // 数据提交
        data_submit() {
          const formData = new FormData()
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
            this.DataRes = case_update(formData)
          } else {
            this.DataRes = case_add(formData)
          }
          this.DataRes.then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.get_list()
              this.FormShow = false
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        // 获取数据
        get_list(page) {
          if (page) {
            if (page <= 1) {
              page = 1
            }
          }
          this.page = page
          case_list(this.page, this.limit).then(res => {
            this.data = res.data
            this.keyword = ''
          })
        },
        // 数据修改
        update_data(data) {
          this.DataForm = data
          this.FormShow = true
        },
        // 数据删除
        delete_data(data) {
          case_delete(data.id).then(res => {
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
