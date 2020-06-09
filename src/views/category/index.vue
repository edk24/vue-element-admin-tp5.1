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
        <!--      <el-table-column type="index" label="序号" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />-->
        <el-table-column label="分类名称" prop="title" align="center" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类图片" prop="type" align="center" width="150" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <el-image class="image" :src="row.image">
              <div slot="error" class="image-slot">
                暂未上传
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="所属类别" prop="note" align="center" width="250" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span v-if="row.type === 'learn'">学习课程</span>
            <span v-if="row.type === 'forum'">论坛</span>
            <span v-if="row.type === 'goods'">商品分类</span>
          </template>
        </el-table-column>
        <el-table-column label="分类描述" prop="note" align="center" width="250" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.desc }}</span>
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
      </el-table-column></el-table>

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="分类图片">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
            style="width: 200px; height: 200px"
          >
            <img v-if="temp.image" style="width: 200px; height: 200px" :src="temp.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="temp.type" placeholder="所属分类">
            <el-option label="论坛" value="forum" />
            <el-option label="商品分类" value="goods" />
            <el-option label="学生课程" value="learn" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类描述">
          <!--          <tinymce v-model="temp.desc" height="300" />-->
          <!--          <quill-editor ref="QuillEditor" v-model="temp.desc" :options="quillOption" />-->
          <editor-bar v-model="temp.desc" :is-clear="isClear" @change="change" />
          <!--          <el-input-->
          <!--            type="textarea"-->
          <!--            :autosize="{ minRows: 2, maxRows: 5}"-->
          <!--            placeholder="请输入内容"-->
          <!--            style="font-size: 16px"-->
          <!--            v-model="temp.desc">-->
          <!--          </el-input>-->
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
  import EditorBar from '@/components/wangEnduit'
  import { category } from '@/api/category'
  import Pagination from '@/components/Pagination'
  // import Tinymce from '@/components/Tinymce'
  // import { quillEditor } from 'vue-quill-editor'
  import quillConfig from '@/utils/quill-config.js'
  const type = [
    { key: 'all', name: '全部' },
    { key: 'forum', name: '论坛' },
    { key: 'goods', name: '商品分类' },
    { key: 'learn', name: '学生课程' }
  ]
  export default {
    // components: { Pagination, quillEditor, Tinymce, EditorBar },
    components: { Pagination, EditorBar },
    data() {
      return {
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
          type: 'all',
          keyword: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          title: [{ required: true, message: '分类名称不能为空', trigger: 'change' }]
        },
        temp: {
          imageFile: '',
          id: undefined,
          timestamp: new Date(),
          create_time: new Date(),
          title: '',
          type: '',
          type_title: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        typelist: {}
      }
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
      getList() {
        this.listLoading = false
        this.list = []
        category.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type).then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              row.image = this.imgsrc + row.image
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
          imageFile: ''
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
            data.append('id', tempData.id)
            data.append('title', tempData.title)
            data.append('type', tempData.type)
            if (tempData.type === undefined) {
              return this.$message.error('必须选择分类')
            }
            if (this.temp.imageFile != null) {
              data.append('image', this.temp.imageFile)
            }
            category.add(data).then(() => {
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

