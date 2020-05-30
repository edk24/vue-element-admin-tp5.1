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
      <el-table-column label="商品名称" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <el-image :src="row.images"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否上架" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.is_show === 1">是</span>
          <span v-if="row.is_show === 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="update_time" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--   第一层弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" width="40%" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="margin-left:50px;">
<!--        <el-form-item label="选择店铺" width="100px;">-->
<!--          <el-input v-model="temp.title" />-->
<!--        </el-form-item>-->
        <el-form-item label="商品名称" prop="content" width="100px;">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="轮播图片">
          <template v-for="(item, index) in temp.images">
              <i class="el-icon-delete" id="img_i" @click="del_img(index)"></i>
              <img :src="item" :key="index" id="img" style="width: 120px;height: 80px;" />
          </template>
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
  import { goods } from '@/api/goods'
  import Pagination from '@/components/Pagination'

  export default {
    components: { Pagination },
    data() {
      return {
        url: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        img_i_style: {
          position: 'relative',
          'z-index': '999',
          bottom: '65px',
          left: '120px',
          width: '10px',
          color: '#000000'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        temp: {
          content: []
        },
        textMap: {
          update: '编辑案例',
          create: '创建案例'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        const data = new FormData()
        data.append('page', this.listQuery.page)
        data.append('limit', this.listQuery.limit)
        goods.getList(this.listQuery.page, this.listQuery.limit).then(({ code, msg, data, count }) => {
          this.list = []

          data.forEach(row => {
            this.list.images = []
            this.list.push(row)
            var img = row.images.split(';')
            row.images = []
            img.forEach(res => {
              row.images.push(this.url + res)
            })
          })
          console.log(this.list)
          this.total = count
        }).catch(error => {
          console.log(error)
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          title: '',
          content: ''
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
      // 添加
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            const tempData = Object.assign({}, this.temp)
            const data = new FormData()
            if (tempData.title === null) {
              return this.$message.error('标题未填写')
            }
            data.append('title', tempData.title)
            data.append('content', tempData.content)
            pub.notice_add(data).then(response => {
              this.$message.success(response.msg || '操作成功')
              this.dialogFormVisible = false
              this.getList()
            }).catch(error => {
              console.log(error)
            })
          }
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
      // 修改
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            const data = new FormData()
            data.append('id', tempData.id)
            data.append('title', tempData.title)
            data.append('content', tempData.content)
            pub.notice_edit(data).then(response => {
              this.$message.success(response.msg || '操作成功')
              this.dialogFormVisible = false
              this.getList()
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
              var data = { id: row.id }
              pub.notice_del(row.id).then(response => {
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
      del_img(index) {
        this.temp.images.splice(index , 1)
      },
      img_enter(row) {
        this.img_i_style.color = '#111111'
        console.log(1)
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
      }
    }
  }
</script>

<style scoped>
  #img_i{
    position: relative;
    z-index: 999;
    bottom: 65px;
    left: 120px;
    color: #ffffff;
  }
</style>
