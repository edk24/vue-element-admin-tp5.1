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

<!--        <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter">-->
<!--          <el-option label="全部" value="all" />-->
<!--          <el-option v-for="item in type" :key="item.key" :label="item.name" :value="item.key" />-->
<!--        </el-select>-->
      </p>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      style="width: 100%;margin-bottom: 20px;"
      default-expand-all
      :data="list"
      fit
      highlight-current-row
    >
      <el-table-column label="序号" type="index" width="50" align="center">
        <template scope="scope">
          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司" prop="title" width="200" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学校" prop="type" align="center" width="200" style="height: 150px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <el-image class="image" :src="row.image">
            <div slot="error" class="image-slot">
              暂未上传
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.type_title != ''">{{ row.type_title }}</span>
          <span v-if="row.type_title === undefined">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="note" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="水费" prop="note" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费提成" prop="note" align="center" width="200" :class-name="getSortClass('id')">
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
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="公司">
          <el-select v-model="temp.company_id" placeholder="公司" @change="typeChange()">
            <el-option v-for="item in school_list" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户">
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
              :key="item.nickname"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-cascader
            v-model="selectedOptions"
            size="large"
            :options="options"
            placeholder="请选择机构所在地区"
            style="width: 300px;"
            :props="optionProps"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="详细地址">
        </el-form-item>
        <el-form-item label="联系电话">
        </el-form-item>
        <el-form-item label="水费">
        </el-form-item>
        <el-form-item label="缴费提成">
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
  import { school } from '@/api/school'
  import { getList } from '@/api/company'
  import Pagination from '@/components/Pagination'
  import { user_search } from '@/api/user'
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
        // 省市区联动
        optionProps: {
          value: 'label',
          label: 'label',
          children: 'children'
        },
        options: regionData,
        selectedOptions: [],

        // 用户搜索
        userList: [],
        loading: false,

        // 学校列表
        school_list: [],

        isClear: false,
        detail: '',
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
      this.getCompanyList()
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
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 获取省市区地址级联
      handleChange(e) {
        console.log(e)
      },
      getCompanyList(){
        getList(1, 9999, '', -1).then(res => {
          this.school_list = res.data
        }).catch(e => {
          console.log(e)
        })
      },
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
        this.list = []
        school.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword).then(({ code, msg, data, count }) => {
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

