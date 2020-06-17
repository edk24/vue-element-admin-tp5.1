<template>
  <div class="app-container">
    <p>
      <el-input v-model="listQuery.keyword" maxlength="16" style="width:300px;margin-right:15px" placeholder="请输入关键字进行搜索" @keyup.enter.native="search()" />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
    </p>
    <p>
      <!-- <el-button type="primary" @click="create()">添加论坛帖子</el-button> -->
    </p>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{(listQuery.page - 1) * listQuery.limit + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="帖子内容">
        <template slot-scope="{row}">
          {{row.content}}
        </template>
      </el-table-column>
      <el-table-column label="类别">
        <template slot-scope="{row}">
          {{row.category.title}}
        </template>
      </el-table-column>

      <el-table-column label="发帖人">
        <template slot-scope="{row}">
          {{ row.nickname }}
        </template>
      </el-table-column>

<!--      <el-table-column label="发帖人性别">-->
<!--        <template slot-scope="{row}">-->
<!--          <span v-if="row.sex == 1">男</span>-->
<!--          <span v-else>女</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="浏览量">
        <template slot-scope="scope">
          {{ scope.row.look_num }}
        </template>
      </el-table-column>

      <el-table-column label="点赞数">
        <template slot-scope="scope">
          {{ scope.row.like_num }}
        </template>
      </el-table-column>

      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
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

      <el-table-column label="操作" fixed="right" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="detail(row)">
            查看详情
          </el-button>
          <el-popconfirm title="帖子下的所有评论都删除，谨慎操作！"  @onConfirm="posts_del(row,$index)">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" width="600" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-width="80px">
        <el-form-item label="发帖人">
          <el-input v-model="temp.nickname" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="发帖时间">
          <el-input v-model="temp.create_time" readonly=""></el-input>
        </el-form-item>
        <el-form-item label="发帖图片">
            <el-image
              v-for="(item,index) in imglist"
              :key="index"
              style="width: 100px; height: 100px;margin: 0 8px"
              :preview-src-list="imglist"
              :src="item"></el-image>
        </el-form-item>
        <el-form-item label="发帖内容">
          <el-input type="textarea" v-model="temp.content" readonly=""></el-input>
        </el-form-item>
        <p>帖子评论</p>
        <el-collapse v-model="comment">
          <el-collapse accordion>
            <el-collapse-item v-for="(item, index) in comment" :key="index">
              <template slot="title" style="position: relative;">
                <span style="width: 55%;line-height: 1.5;">{{ item.content }}</span>
                <span style="position:absolute;right: 160px;">评论者：{{ item.user.nickname }}</span>
                <el-button type="text" style="position:absolute;right: 60px;" @click="comment_del(item.id)">删除</el-button>
              </template>
              <div v-for="(vo, key) in item.children" :key="key" style="padding: 8px 0">
                  <div v-if="vo.target_reply === null" style="border-top: 1px solid rgb(235,238,245);">
                    <span>{{ vo.content }}</span>
                    <span style="position: absolute;right: 160px">回复者：{{ vo.user.nickname }}</span>
                    <el-button type="text" style="position: absolute;right: 60px;line-height: 0px;" @click="comment_del(vo.id)">删除</el-button>
                  </div>
                  <div v-if="vo.target_reply != null" style="border-top: 1px solid rgb(235,238,245);">
                    <span>{{ vo.content }}</span>
                    <span style="position: absolute;right: 160px">回复者：{{ vo.user.nickname }}@{{ vo.target_reply.nickname }}</span>
                    <el-button type="text" style="position: absolute;right: 60px;line-height: 0px;" @click="comment_del(vo.id)">删除</el-button>
                  </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { forum } from '@/api/forum'
  import Pagination from '@/components/Pagination'
  export default {
    components: {
      Pagination
    },
    data() {
      return {
        imgsrc: process.env.VUE_APP_BASE_API,
        total: 0,
        list: [],
        imglist: [],
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          type: 'all',
          keyword: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
        temp: {
          id: undefined,
          title: ''
        },
        comment: [],
        textMap: {
          detail: '帖子详情'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = false
        forum.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword).then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.list = data
            this.total = count
          } else {
            this.$message.error(msg || '查询失败')
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      detail(row) {
        const that = this
        this.imglist = []
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'detail'
        this.dialogFormVisible = true
        var img = (row.images).split(';')
        img.forEach(function(row) {
          row = that.imgsrc + row
          that.imglist.push(row)
        })
        forum.detail(row.id).then(({ code, msg, data, count }) => {
          this.comment = data.comment
          // var res = JSON.stringify(data)
          // console.log()
          data.comment.forEach(function(row) {
            console.log(row.children)
          })
        })
      },
      posts_del(row, index) {
        forum.posts_del(row.id).then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.list.splice(index, 1)
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      comment_del(id) {
        this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          forum.comment_del(id).then(({ code, msg, data, count }) => {
            if (code === 0) {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 搜索
      search() {
          this.getList()
      }
    }
  }
</script>

<style>
</style>
