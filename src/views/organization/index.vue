<template>
  <div class="app-container" v-if="this.user.type === 2">
    <div class="filter-container" />
    <el-form ref="dataForm" v-model="list" :rules="rules" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:150px;">
      <el-form-item label="机构名称" style="width: 30%;">
        <span>{{ list.name }}</span>
      </el-form-item>
      <el-form-item label="推广公司">
        <span>{{ company.title }}</span>
      </el-form-item>
      <el-form-item label="营业执照">
        <el-image
          style="width: 300px; height: 200px"
          :src="list.license"
          :preview-src-list="licenseList"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="list.desc"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="请输入内容"
          style="width: 50%;"
        />
      </el-form-item>
      <el-form-item label="分类">
        <span>{{ category.title }}</span>
      </el-form-item>
      <el-form-item label="展示图">
        <el-upload
          :show-file-list="false"
          :multiple="false"
          action="post"
          :before-upload="selectImg"
          :on-change="changeImage"
        >
          <img
            v-if="list.image"
            :src="list.image"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        </el-upload>
      </el-form-item>
      <el-form-item label="轮播图">
        <el-upload
          action="post"
          list-type="picture-card"
          :file-list="silderimgList"
          :on-preview="handlePictureCardPreview"
          :on-change="imgPreview"
          :before-upload="selectImg"
          :on-remove="handleRemove"
          :auto-upload="false"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="list.silder_image" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="省/市/区">
        <el-cascader
          v-model="selectedOptions"
          size="large"
          :options="options"
          placeholder="请选择机构所在地区"
          style="width: 300px;"
          :props="optionProps"
          disabled
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="详细地址">
        <span>{{ list.address }}</span>
      </el-form-item>
      <el-form-item label="联系人">
        <span>{{ list.contact }}</span>
      </el-form-item>
      <el-form-item label="联系人电话">
        <span>{{ list.phone }}</span>
      </el-form-item>
      <el-form-item label="对推广员返点">
        <span>{{ list.rebate }}</span>
      </el-form-item>
      <el-form-item label="详情">
        <editor-bar v-model="list.content" :is-clear="isClear" style="width: 800px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left: 254px;">
      <!--          <el-button @click="dialogFormVisible = false">-->
      <!--            取消-->
      <!--          </el-button>-->
      <el-button type="primary" @click="updateData()">
        确认修改
      </el-button>
    </div>
  </div>
</template>

<script>
  import { organization } from '@/api/organization'
  import { getInfo } from '@/api/user'
  import {
    provinceAndCityData,
    regionData,
    provinceAndCityDataPlus,
    regionDataPlus,
    CodeToText,
    TextToCode
  } from 'element-china-area-data'
  import { mapGetters } from 'vuex'
  import EditorBar from '@/components/wangEnduit'
  const type = [
    { key: 'forum', name: '论坛' },
    { key: 'goods', name: '商品分类' },
    { key: 'learn', name: '学生课程' },
    { key: 'train', name: '培训机构' }
  ]

  export default {
    components: { EditorBar },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'id'
      ])
    },
    data() {
      return {
        category: [],
        imgStatus: false,
        dialogImageUrl: '',
        dialogVisible: false,
        isClear: false,
        detail: '',
        silderimgList: [],
        licenseList: [],
        user: {},
        company: '',
        optionProps: {
          value: 'label',
          label: 'label',
          children: 'children'
        },
        options: regionData,
        // selectedOptions: ['贵州省', '贵阳市', '南明区'],
        selectedOptions: [],
        imgsrc: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: [],
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
      this.getAdminInfo()
      // console.log('11' + this.user.id)
    },
    methods: {
      handleRemove(file) {
        if (this.list.id) {
          organization.del_image(this.list.id, file.url).then(res => {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1200
            })
          })
        }
      },
      // 点击放大图片
      handlePictureCardPreview(file) {
        this.list.silder_image = file.url
        this.dialogVisible = true
      },
      // 图片上传事件
      imgPreview(file) {
        // const that = this
        this.imgStatus = true
        const fileName = file.name
        const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
        if (regex.test(fileName.toLowerCase())) {
          this.list.silder_image = file.url
        } else {
          this.$message.error('请选择图片文件')
        }
        if (this.silderimgList.length >= 8) {
          return this.$message.warning('轮播图超过8张，无效上传')
        }
        if (this.list.id) {
          const data = new FormData()
          data.append('id', this.list.id)
          data.append('images', file.raw)
          organization.upload_image(data).then(res => {
            var img = this.imgsrc + res.data
            this.silderimgList.push({ url: img })
            console.log(this.silderimgList)
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 1200
            })
          }).catch(error => {
            console.log(error)
          })
        }
      },
      change(val) {
        console.log(val)
      },
      getAdminInfo() {
        getInfo().then(res => {
          this.user = res.data
          this.getList()
          console.log(this.user.type)
        }).catch(e => {
          console.log(e)
        })
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
      getList() {
        console.log('这是测试' + '2')
        const that = this
        this.listLoading = false
        organization.train_info(this.user.id).then(({ code, msg, data, count }) => {
          this.list.silder_image = []
          if (code === 0) {
            data.license = this.imgsrc + data.license
            this.licenseList.push(data.license)
            data.image = this.imgsrc + data.image
            var str = data.province + ',' + data.city + ',' + data.area
            this.selectedOptions = str.split(',')
            if (data.images !== '') {
              var img = data.images.split(';')
              img.forEach(function(row) {
                row = that.imgsrc + row
                that.silderimgList.push({ url: row })
              })
            }
            this.category = data.category
            this.company = data.company

            this.list = data
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
        const tempData = Object.assign({}, this.list)
        const data = new FormData()
        data.append('id', tempData.id)
        data.append('desc', tempData.desc)
        data.append('content', tempData.content)
        if (this.list.imageFile != null) {
          data.append('image', this.list.imageFile)
        }
        organization.edit(data).then(response => {
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

        this.list.imageFile = file
        return false // don't auto upload
      },
      // 图片被改变
      changeImage(file) {
        // 读图片预览
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.list.image = e.target.result
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
  .el-input.is-disabled .el-input__inner{
    color: #000;
  }
  .editor{
    margin: 0;
  }
</style>

