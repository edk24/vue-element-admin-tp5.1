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

      </p>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      style="width: 100%;margin-bottom: 20px;"
      border
      :data="list"
    >
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="title" width="200" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="type" align="center" width="200" style="height: 150px;">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="note" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="250">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="update_time" align="center" width="250" >
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="选择用户">
          <el-select
            v-model="temp.user_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号检索"
            :remote-method="userSearch"
            :loading="loading"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { user_search } from '@/api/user'
  import { manager } from '@/api/manager'
  export default {
    components: { Pagination },
    data() {
      return {
        // 用户搜索
        userList: [],
        loading: false,

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
          name: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        temp: {
          id: undefined,
          name: '',
          user_id: undefined
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
      }
    },
    mounted() {
    },
    created() {
      this.getList()
    },
    methods: {
      search() {
        this.getList()
      },
      // 用户搜索
      userSearch(query) {
        if (query !== '') {
          this.loading = true
          user_search(query, 5)
              .then(({ code, count, data, msg }) => {
                if (code === 0) {
                  this.userList = data
                } else {
                  this.userSearch = []
                  this.$message.warning(msg)
                }
                this.loading = false
              })
              .catch(err => {
                this.loading = false
              })
        } else {
          this.userSearch = []
          this.loading = false
        }
      },
      getList() {
        this.listLoading = false
        manager.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword).then(({ code, msg, data, count }) => {
          if (code === 0) {
            console.log(data)
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
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          user_id: undefined
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
        this.userList.push({ id: row.user_id, nickname: row.nickname })
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
            data.append('name', tempData.name)
            data.append('user_id', tempData.user_id)
            if (tempData.user_id === undefined) {
              return this.$message.error('必须选择分类')
            }
            manager.edit(data).then(response => {
              // const index = this.list.findIndex(v => v.id === this.temp.id)
              // this.list.splice(index, 1, tempData)
              this.getList()
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
            data.append('name', tempData.name)
            data.append('user_id', tempData.user_id)
            if (tempData.user_id === undefined) {
              return this.$message.error('必须选择分类')
            }
            manager.add(data).then(() => {
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
        category.del(row.id).then(({ code, msg }) => {
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

