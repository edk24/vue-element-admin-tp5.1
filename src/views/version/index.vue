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
      default-expand-all
      :data="list"
      fit
    >
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" prop="title" width="200" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新内容"
        prop="type"
        align="center"
        width="200"
        style="height: 150px;"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否整包更新" prop="create_time" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.entire === 0">否</span>
          <span v-if="row.entire === 1">是</span>
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
            编辑
          </el-button>
          <el-popconfirm title="确定删除这行信息吗?" @onConfirm="handleDelete(row,$index)">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="padding:0 5px;margin-right:5px;margin-left:50px;"
      >
        <el-form-item label="版本号" prop="version">
          <el-input v-model="temp.version" />
        </el-form-item>
        <el-form-item label="更新内容" prop="note">
          <el-input
            v-model="temp.note"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="是否整包更新">
          <el-radio v-model="temp.entire" :label="0" @change="changeEntire">否</el-radio>
          <el-radio v-model="temp.entire" :label="1" @change="changeEntire">是</el-radio>
        </el-form-item>
        <el-form-item label="上传apk">
          <el-upload
            v-model="temp.apk"
            class="upload-demo"
            name="apk"
            :action="action"
            :on-success="handleVersionSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemoveApk"
            :limit="1"
            multiple
            :on-exceed="handleExceed"
            :file-list="fileListApk"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个apk文件，文件后显示绿色小勾，代表上传成功</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传ios">
          <el-upload
            v-model="temp.ios"
            class="upload-demo"
            name="ios"
            :action="action"
            :on-success="handleVersionSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemoveIos"
            :limit="1"
            multiple
            :on-exceed="handleExceed"
            :file-list="fileListIos"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个ios文件，文件后显示绿色小勾，代表上传成功</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传wgt">
          <el-upload
            v-model="temp.wgt"
            class="upload-demo"
            name="wgt"
            :action="action"
            :on-success="handleVersionSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemoveWgt"
            :limit="1"
            multiple
            :on-exceed="handleExceed"
            :file-list="fileListWgt"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个wgt文件，文件后显示绿色小勾，代表上传成功</div>
          </el-upload>
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
  import { version } from '@/api/version'
  import Pagination from '@/components/Pagination'

  export default {
    components: { Pagination },
    data() {
      return {
        uploadVersion: [],
        fileListApk: [],
        fileListIos: [],
        fileListWgt: [],
        action: process.env.VUE_APP_BASE_API + '/v1/uploads/version',
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
          version: [{ required: true, message: '不能为空', trigger: 'change' }],
          note: [{ required: true, message: '不能为空', trigger: 'change' }]
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
      changeEntire(val){
        console.log(val)
      },
      search() {
        this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 上传成功回调
      handleVersionSuccess(res, file) {
        this.uploadVersion.push(res.data)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      beforeRemoveApk(file, fileList) {
        // delete this.uploadVersion.apk
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      beforeRemoveIos(file, fileList) {
        // const index = this.uploadVersion.indexOf('ios')
        // console.log(index)
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      beforeRemoveWgt(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      getList() {
        this.listLoading = false
        this.list = []
        version.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type).then(({ code, msg, data, count }) => {
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
          type: '',
          entire: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.fileListApk = []
        this.fileListIos = []
        this.fileListWgt = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.fileListApk = []
        this.fileListIos = []
        this.fileListWgt = []
        if (row.apk !== '') {
          this.fileListApk.push({ name: row.version + 'apk', url: row.apk })
        }
        if (row.ios !== '') {
          this.fileListIos.push({ name: row.version + 'ios', url: row.ios })
        }
        if (row.wgt !== '') {
          this.fileListWgt.push({ name: row.version + 'wgt', url: row.wgt })
        }

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
            data.append('version', tempData.version)
            data.append('note', tempData.note)
            data.append('entire', tempData.entire)
            // if (this.uploadVersion.length === 0) {
            //   return this.$message.warning('请至少选择一个上传')
            // }
            this.uploadVersion.forEach(function(row) {
              if (row['apk'] !== undefined) {
                data.append('apk', row['apk'])
              }
              if (row['ios'] !== undefined) {
                data.append('ios', row['ios'])
              }
              if (row['wgt'] !== undefined) {
                data.append('wgt', row['wgt'])
              }
            })
            version.edit(data).then(response => {
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
            data.append('version', tempData.version)
            data.append('note', tempData.note)
            data.append('entire', tempData.entire)
            if (this.uploadVersion.length === 0) {
              return this.$message.warning('请至少选择一个上传')
            }
            this.uploadVersion.forEach(function(row) {
              if (row['apk'] !== undefined) {
                data.append('apk', row['apk'])
              }
              if (row['ios'] !== undefined) {
                data.append('ios', row['ios'])
              }
              if (row['wgt'] !== undefined) {
                data.append('wgt', row['wgt'])
              }
            })
            version.add(data).then(() => {
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
        version.del(row.id).then(({ code, msg }) => {
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

