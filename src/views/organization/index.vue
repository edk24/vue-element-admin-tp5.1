<template>
  <div class="app-container">
    <div class="filter-container" />

    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
      <el-form-item label="机构名称" style="width: 30%;">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="推广公司">
        <el-select v-model="temp.type" placeholder="所属分类" @change="typeChange()">
          <el-option v-for="item in type" :key="item.key" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="营业执照">
        <el-upload
          :show-file-list="false"
          :multiple="false"
          action="post"
          :before-upload="selectImg"
          :on-change="changeImage"
          :props="optionProps"
          style="width: 200px; height: 200px"
        >
          <img v-if="temp.image" style="width: 200px; height: 200px" :src="temp.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="省/市/区">
        <el-cascader
          v-model="selectedOptions"
          size="large"
          :options="options"
          placeholder="请选择机构所在地区"
          style="width: 350px;"
          :props="optionProps"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="temp.address" />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="temp.contact" />
      </el-form-item>
      <el-form-item label="联系人电话">
        <el-input v-model="temp.phone" />
      </el-form-item>
      <el-form-item label="对推广员返点">
        <el-input v-model="temp.rebate" />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-input v-model="temp.status" />
      </el-form-item>
      <el-form-item label="拒绝理由">
        <el-input v-model="temp.reason" />
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="temp.title" />
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="temp.title" />
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
  </div>
</template>

<script>
  import EditorBar from '@/components/wangEnduit'
  import { category } from '@/api/category'
  import Pagination from '@/components/Pagination'
  import quillConfig from '@/utils/quill-config.js'
  import {
    provinceAndCityData,
    regionData,
    provinceAndCityDataPlus,
    regionDataPlus,
    CodeToText,
    TextToCode
  } from 'element-china-area-data'
  const type = [
    { key: 'forum', name: '论坛' },
    { key: 'goods', name: '商品分类' },
    { key: 'learn', name: '学生课程' },
    { key: 'train', name: '培训机构' }
  ]
  export default {
    components: { Pagination },
    data() {
      return {
        optionProps: {
          value: 'label',
          label: 'label',
          children: 'children'
        },
        options: regionData,
        selectedOptions: [],
        isClear: false,
        detail: '',
        type,
        quillOption: quillConfig,
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
        this.getList()
      },
      // 获取省市区地址级联
      handleChange(e) {
        console.log(e)
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
            data.append('title', tempData.title)
            data.append('desc', tempData.desc)
            data.append('type', tempData.type)
            data.append('pid', tempData.pid)
            if (this.temp.imageFile != null) {
              data.append('image', this.temp.imageFile)
            }
            category.edit(data).then(response => {
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

