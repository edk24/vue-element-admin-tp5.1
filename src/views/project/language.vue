<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />
      <el-table-column label="语言" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.type == 1">后端</span>
          <span v-if="row.type == 2">前端</span>
          <span v-if="row.type == 0">前后都行</span>
          <!--          <span v-if="(typeof row.type) == Number">{{ row.type }}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
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
      <el-table-column label="操作" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <p>-->
    <!--      <el-pagination-->
    <!--        background-->
    <!--        layout="prev, pager, next"-->
    <!--        :total="count"-->
    <!--      />-->
    <!--    </p>-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="开发语言" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="temp.note" />
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
  import { system } from '@/api/project'
  import Pagination from '@/components/Pagination'
  const calendarTypeOptions = [
    { key: 1, display_name: '后端' },
    { key: 2, display_name: '前端' },
    { key: 0, display_name: '前后都行' }
  ]

  export default {
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        list: null,
        count: 0,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          create_time: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        calendarTypeOptions,
        textMap: {
          update: 'Edit',
          create: 'Create'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = false
        system.language_list(this.listQuery.page, this.listQuery.limit).then(response => {
          this.list = response.data
          this.count = response.count
          this.total = response.count
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
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
        this.type_judge(row.type)
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            system.language_edit(tempData).then(response => {
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
      handleDelete(row, index) {
        const h = this.$createElement
        this.$msgbox({
          title: '提示框',
          message: h('p', null, [
            h('span', null, '是否确认删除？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              var id = { id: row.id }
              system.language_del(id).then(response => {
                this.list.splice(index, 1)
                this.$notify({
                  title: 'Success',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
              })
              done()
            } else {
              done()
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            system.language_add(this.temp).then(() => {
              this.temp.create_time = new Date(this.temp.timestamp)
              this.list.push(this.temp)
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
      type_judge(type) {
        this.temp.type = type
      }
    }
  }

</script>

