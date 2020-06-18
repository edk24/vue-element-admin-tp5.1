<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>

      <p>
        <el-input
          v-model="listQuery.keyword"
          maxlength="16"
          style="width:300px;margin-right:15px"
          placeholder="请输入关键字/标题名称/描述"
          @keyup.enter.native="search()"
        />
        <el-button type="primary" @click="search()">搜索</el-button>

        <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option label="全部" value="all" />
          <el-option v-for="item in type" :key="item.key" :label="item.name" :value="item.key" />
        </el-select>
      </p>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" prop="title" width="200" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.from_user.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.type === 'SUBSCRIBE'">订阅推送</span>
          <span v-if="row.type === 'ONE'">指定用户</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="type" align="center" width="200" style="height: 150px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="update_time" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            查看详情
          </el-button>
          <el-popconfirm title="确定删除这行信息吗?" @onConfirm="handleDelete(row,$index)">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="消息类型">
          <el-select v-model="temp.type" filterable placeholder="请选择"  style="width: 220px;">
            <el-option v-for="item in type" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送对象">
          <el-select
            v-model="temp.to"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号检索"
            :remote-method="userSearch"
            :loading="loading"
            v-if="temp.type === 'ONE'"
            style="width: 200px;"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
<!--            <el-option v-for="item in user_list" :key="item.id" :label="item.nickname" :value="item.id"/>-->
<!--            <el-option v-for="item in channel_list" v-if="temp.type === 'SUBSCRIBE'" :key="item.id" :label="item.title" :value="item.id" />-->
          </el-select>

          <el-select
            v-model="temp.to"
            filterable
            v-if="temp.type === 'SUBSCRIBE'"
            style="width: 200px;"
          >
            <el-option v-for="item in channel_list"  :key="item.id" :label="item.title" :value="item.id" />
          </el-select>

        </el-form-item>

        <el-form-item label="消息内容" prop="content">
          <el-input v-model="temp.content" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { message } from '@/api/message'
  import { user_list } from '@/api/user'
  import { user_search } from '@/api/user'
  const type = [
    { key: 'ONE', name: '指定用户' },
    { key: 'SUBSCRIBE', name: '订阅推送' }
  ]
  export default {
    components: { Pagination },
    data() {
      return {
        // 用户搜索
        userList: [],
        loading: false,
        user_list: [],
        channel_list: [],
        isClear: false,
        detail: '',
        type: type,
        imgsrc: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          type: 'all',
          keyword: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          title: [{ required: true, message: '不能为空', trigger: 'change' }],
          content: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        temp: {
          imageFile: '',
          id: undefined,
          title: '',
          type: '',
          to: '',
          phone: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        typelist: {}
      }
    },
    mounted() {
      this.getToList()
    },
    created() {
      this.getList()
    },
    methods: {
      // 用户搜索
      userSearch(query) {
        if (query !== '') {
          this.loading = true
          user_search(query)
              .then(({ code, count, data, msg }) => {
                if (code === 0) {
                  this.userList = data
                } else {
                  this.userSearch = []
                  this.$message.warning(msg)
                }
                this.loading = false
              }).catch(error => {
                this.loading = false
                console.log(error)
              })
        } else {
          this.userSearch = []
          this.loading = false
        }
      },
      search() {
        this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getToList() {
        user_list(1, 999).then(res => {
          this.user_list = res.data
        }).catch(error => {
          console.log(error)
        })
        message.channel().then(res => {
          this.channel_list = res.data
        }).catch(error => {
          console.log(error)
        })
      },
      getList() {
        this.listLoading = false
        this.list = []
        message.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type).then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              this.list.push(row)
            })
            this.total = count
          } else {
            this.$message.error(msg || '查询失败')
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          title: '',
          desc: '',
          image: '',
          imageFile: '',
          type: '',
          to: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            const data = new FormData()
            data.append('id', tempData.id)
            data.append('title', tempData.title)
            data.append('type', tempData.type)
            data.append('pid', tempData.pid)
            if (this.temp.imageFile != null) {
              data.append('image', this.temp.imageFile)
            }
            category.edit(data).then(response => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, tempData)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }).catch(error => {
              console.log(error)
            })
          }
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            const data = new FormData()
            data.append('title', tempData.title)
            if (tempData.type === '') {
              return this.$message.warning('必须选择消息类型')
            }
            if (tempData.to === '') {
              return this.$message.warning('必须选择推送对象')
            }
            data.append('type', tempData.type)
            data.append('to', tempData.to)
            data.append('content', tempData.content)
            message.add(data).then(() => {
              // this.list.push(this.temp)
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row, index) {
        message.del(row.id).then(({ code, msg }) => {
          if (code === 0) {
            this.list.splice(index, 1)
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message.error(msg || '删除失败')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }

</script>
<style type="text/css">
</style>

