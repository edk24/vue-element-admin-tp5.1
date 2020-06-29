<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--        添加-->
<!--      </el-button>-->

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
      <el-tabs v-model="listQuery.status" @tab-click="handleFilter">
        <el-tab-pane  v-for="item in status" :key="item.key" :label="item.name" :value="item.key"></el-tab-pane>
      </el-tabs>
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
      <el-table-column label="机构名称" prop="title" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="分类" prop="title" align="center" width="200" :class-name="getSortClass('id')">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.category.title }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="推广子公司名称" prop="title" width="200" align="center" :class-name="getSortClass('id')">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.company.title }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="联系人" prop="type" align="center" width="150" style="height: 150px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" prop="note" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList1" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="机构名称">
          <el-input v-model="temp.name" :readonly="readonly" />
        </el-form-item>
<!--        <el-form-item label="推广公司名称">-->
<!--          <el-input v-model="temp.company.title" readonly />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="分类">-->
<!--          <el-select v-model="temp.category_id" style="width: 140px" class="filter-item" @change="handleFilter">-->
<!--            <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id" :disabled="disabled"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="营业执照">
          <el-image
            style="width: 300px; height: 200px"
            :src="temp.license"
            :preview-src-list="licenseList"
          />
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-cascader
            v-model="selectedOptions"
            size="large"
            :options="options"
            placeholder="请选择机构所在地区"
            style="width: 300px;"
            :props="optionProps"
            :disabled="disabled"
            @change="handleChange"
          />
        </el-form-item>
<!--        <el-form-item label="省">-->
<!--          <el-input v-model="temp.province" :readonly="readonly" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="市">-->
<!--          <el-input v-model="temp.city" :readonly="readonly" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="区">-->
<!--          <el-input v-model="temp.area" :readonly="readonly" />-->
<!--        </el-form-item>-->
        <el-form-item label="详细地址">
          <el-input v-model="temp.address" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="temp.contact" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="temp.phone" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="对推广人员返点">
          <el-input v-model="temp.rebate" :readonly="readonly" />
        </el-form-item>
        <el-form-item v-if="listQuery.status === '0'" label="审核">
          <el-radio v-model="radio" label="1">审核过关</el-radio>
          <el-radio v-model="radio" label="2">审核失败</el-radio>
        </el-form-item>
        <el-form-item v-if="radio === '2' || listQuery.status ==='2'" label="拒绝理由" prop="reason">
          <el-input v-model="temp.reason" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="listQuery.status != '2'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { organization } from '@/api/organization'
  import Pagination from '@/components/Pagination'
  import { category } from '@/api/category'
  import {
    regionData,
  } from 'element-china-area-data'

  const status = [
    { key: '0', name: '待审核' },
    { key: '1', name: '审核过关' },
    { key: '2', name: '审核失败' }
  ]
  export default {
    // components: { Pagination, quillEditor, Tinymce, EditorBar },
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
        disabled: true,
        categoryList: [],
        readonly: true,
        licenseList: [],
        radio: '1',
        status,
        isClear: false,
        detail: '',
        imgsrc: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          status: '1',
          keyword: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          title: [{ required: true, message: '不能为空', trigger: 'change' }],
          reason: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        temp: {
          id: undefined,
          company: [],
          reason: ''
        },
        textMap: {
          update: '查看详情',
          create: '查看且修改'
        }
      }
    },
    mounted() {
    },
    created() {
      this.getCategoryList()
      this.getList1()
    },
    methods: {
      change(val) {
        console.log(val)
      },
      search() {
        this.getList1()
      },
      getCategoryList() {
        category.getlist(1, 999, '', 'train').then(res => {
          this.categoryList = res.data
        }).catch(e => {
          console.log(e)
        })
      },
      // 获取省市区地址级联
      handleChange(value) {
        this.temp.province = value[0]
        this.temp.city = value[1]
        this.temp.area = value[2]
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList1()
      },
      getList1() {
        this.listLoading = false
        this.list = []
        organization.train_list(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.status).then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              row.license = this.imgsrc + row.license
              this.list.push(row)
            })
            this.total = count
            console.log(data)
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
        this.licenseList.push(row.license)
        if (this.listQuery.status === '1') {
          this.readonly = false
          this.dialogStatus = 'create'
          this.disabled = false
        }
        if (this.listQuery.status === '0') {
          this.dialogStatus = 'update'
        }
        // if (this.listQuery.status === '1') {
        //
        // }
        var str = row.province + ',' + row.city + ',' + row.area
        this.selectedOptions = str.split(',')
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
            organization.status(tempData.id, this.radio, tempData.reason).then(response => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1)
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
            data.append('name', tempData.name)
            data.append('category_id', tempData.category_id)
            data.append('province', tempData.province)
            data.append('city', tempData.city)
            data.append('area', tempData.area)
            data.append('address', tempData.address)
            data.append('contact', tempData.contact)
            data.append('phone', tempData.phone)
            data.append('rebate', tempData.rebate)
            organization.edit(data).then(() => {
              this.getList1()
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
        organization.del(row.id).then(({ code, msg }) => {
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
  .el-tabs__item{
    font-size: 16px;
  }
  .el-tabs__item.is-active{
    font-size: 18px;
  }
</style>

