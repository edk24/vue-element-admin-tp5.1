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

        <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" @change="handleFilter">
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
      <el-table-column label="用户名字" prop="title" width="200" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.bank_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" prop="type" align="center" width="200" style="height: 150px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.bank_deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户支行" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.bank_branch }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行预留手机号" prop="note" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.bank_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="note" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.status === 0">待审核</span>
          <span v-if="row.status === 1">审核通过</span>
          <span v-if="row.status === 2">审核失败</span>
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
            查看
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="用户名字">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="temp.bank_code" />
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="temp.bank_deposit" />
        </el-form-item>
        <el-form-item label="开户支行">
          <el-input v-model="temp.bank_branch" />
        </el-form-item>
        <el-form-item label="银行预留手机号">
          <el-input v-model="temp.bank_phone" />
        </el-form-item>
        <el-form-item v-if="listQuery.status === 'all'" label="状态">
          <span v-if="temp.status === 0">待审核</span>
          <span v-if="temp.status === 1">审核通过</span>
          <span v-if="temp.status === 2">审核失败</span>
        </el-form-item>
        <el-form-item v-if="listQuery.status === '0'" label="审核">
          <el-radio v-model="radio" label="1">通过</el-radio>
          <el-radio v-model="radio" label="2">失败</el-radio>
        </el-form-item>
        <el-form-item v-if="this.radio != '1' || listQuery.status === '2' || temp.status === 2" label="驳回理由" prop="reason">
          <el-input
            v-model="temp.reason"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5}"
            placeholder="请输入内容"
            style="font-size: 16px"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="listQuery.status === '0'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { category } from '@/api/category'
  import { bank_list, bank_status, bank_del } from '@/api/user'
  import Pagination from '@/components/Pagination'
  import quillConfig from '@/utils/quill-config.js'
  const type = [
    { key: 'all', name: '全部' },
    { key: '0', name: '待审核' },
    { key: '1', name: '审核通过' },
    { key: '2', name: '审核失败' }
  ]
  export default {
    components: { Pagination },
    data() {
      return {
        radio: '1',
        pidList: [],
        isClear: false,
        detail: '',
        quillOption: quillConfig,
        type,
        imgsrc: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          status: 'all',
          keyword: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          reason: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        temp: {
          imageFile: '',
          id: undefined,
          title: '',
          type: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        typelist: {}
      }
    },
    mounted() {
    },
    created() {
      this.getList()
    },
    methods: {
      change(val) {
        console.log(val)
      },
      search() {
        // if (this.listQuery.keyword) {
        this.getList()
        // } else {
        //   this.$message.warning('请输入关键词')
        // }
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      typeChange() {
        this.temp.pid = 0
        this.getPidList()
      },
      getPidList() {
        console.log(this.temp)
        category.getlist(1, 9999, '', this.temp.type).then(res => {
          this.pidList = res.data
        }).catch(error => {
          console.log(error)
        })
      },
      getList() {
        this.listLoading = false
        this.list = []
        bank_list(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.status).then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.list = data
          } else {
            this.$message.error(msg || '查询失败')
          }
        })
      },
      getTypeList() {
        category.type().then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.typelist = data
          } else {
            this.$message.error(msg || '查询失败')
          }
        }).catch(error => {
          console.log(error)
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
          pid: 0,
          type: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.getPidList()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.getPidList()
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
            data.append('status', this.radio)
            if (this.radio === '2') {
              data.append('reason', tempData.reason)
            }
            bank_status(data).then(response => {
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
            data.append('id', tempData.id)
            data.append('title', tempData.title)
            data.append('desc', tempData.desc)
            data.append('type', tempData.type)
            data.append('pid', tempData.pid)
            if (tempData.type === '') {
              return this.$message.error('必须选择分类')
            }
            if (this.temp.imageFile != null) {
              data.append('image', this.temp.imageFile)
            }
            category.add(data).then(() => {
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
        bank_del(row.id).then(({ code, msg }) => {
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

        this.temp.imageFile = file
        return false // don't auto upload
      },
      // 图片被改变
      changeImage(file) {
        // 读图片预览
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.temp.image = e.target.result
        }
        reader.readAsDataURL(file.raw)
      }
    }
  }

</script>
<style type="text/css">
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

