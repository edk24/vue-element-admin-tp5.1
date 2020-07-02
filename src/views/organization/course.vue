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

        <el-select v-if="selectTrain" v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option label="全部" value="all" />
          <el-option v-for="item in trainList" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-table-column label="机构" prop="title" width="200" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.train.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" prop="title" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示图片" prop="type" align="center" width="150" style="height: 100px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <el-image class="image" :src="row.image" style="width:100px; height:100px" fit="cover">
            <div slot="error" class="image-slot">
              暂未上传
            </div>
          </el-image>
        </template>
      </el-table-column>
      <!--      <el-table-column label="描述" prop="note" align="center" width="200" :class-name="getSortClass('id')">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.desc }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="金额" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上下架" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <el-switch v-model="row.enable" @change="updateEnable(row)" :active-value="1" :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleMember(row)">
            报名列表
          </el-button>
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
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item v-if="selectTrain" label="选择培训机构">
          <el-select v-model="temp.train_id" filterable placeholder="请选择">
            <el-option
              v-for="item in trainList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="title">
          <el-input v-model="temp.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>
        <el-form-item label="课程展示图片">
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
        <el-form-item label="轮播图:">
          <el-upload
            action="post"
            list-type="picture-card"
            :file-list="temp.silderimgList"
            :on-preview="handlePictureCardPreview"
            :on-change="imgPreview"
            :before-upload="selectImg"
            :on-remove="handleRemove"
            :auto-upload="false"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="temp.silder_image" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="temp.money" maxlength="10" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="上课时间">
          <el-time-select
            v-model="temp.start_time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="下课时间">
          <el-time-select
            v-model="temp.end_time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="报名开始时间">
          <el-date-picker
            v-model="temp.open_time"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="报名结束时间">
          <el-date-picker
            v-model="temp.close_time"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="详情">
          <editor-bar v-model="temp.content" :is-clear="isClear" @change="change" />
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

    <!-- 报名人员 -->
    <el-dialog title="报名人员名单" :visible.sync="dialogMember" width="650">
    <el-table :data="member" height="480">
      <el-table-column prop="date" label="序号" width="50">
        <template slot-scope="{row, $index}">
          {{ $index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="consignee" label="姓名" width="72"></el-table-column>
      <el-table-column prop="phone" label="手机" width="120"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column  label="支付状态">
        <template slot-scope="scope">
          <span style="color:red" v-if="scope.row.paid_status==0">未支付</span>
          <span style="color:green" v-else>已支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="报名时间"></el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>

<script>
  import EditorBar from '@/components/wangEnduit'
  import { formatDate } from '@/utils/time.js'
  import { course } from '@/api/course'
  import { organization } from '@/api/organization'
  import Pagination from '@/components/Pagination'
  import { getInfo } from '@/api/user'
  import { mapGetters } from 'vuex'
  const type = [
    { key: 'all', name: '全部' },
    { key: 'forum', name: '论坛' },
    { key: 'goods', name: '商品分类' },
    { key: 'learn', name: '学生课程' }
  ]

  export default {
    // components: { Pagination, quillEditor, Tinymce, EditorBar },
    components: { Pagination, EditorBar },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'id'
      ])
    },
    data() {
      return {
        train_id: '',
        selectTrain: true,
        user: { id: -1 },
        trainList: [],
        isClear: false,
        detail: '',
        type,
        dialogVisible: false,
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
          title: [{ required: true, message: '分类名称不能为空', trigger: 'change' }],
          open_time: [{ required: true, message: '分类名称不能为空', trigger: 'change' }],
          money: [
            { required: true, type: 'string', trigger: 'blur', message: '金额不能为空' },
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
          ]
        },
        temp: {
          imageFile: '',
          id: undefined,
          title: '',
          type: '',
          silder_image: []
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        silderimgList: [],

        // 报名成员信息
        member:[{paid_status:0}],
        dialogMember:false,
      }
    },
    mounted() {
    },
    created() {
      this.member=[];
      this.getAdminInfo()
      // this.getList()
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
      handleDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      handleRemove(file) {
        if (this.temp.id) {
          const data = new FormData()
          data.append('id', this.temp.id)
          data.append('url', file.url)
          course.del_image(data).then(res => {
            this.$notify({
              title: 'Success',
              message: '删除成功',
              type: 'success',
              duration: 1200
            })
          })
        }
      },
      handleMember(row){
        course.member(row.id, -1).then(({code,msg,data,count})=>{
            this.member = data
        }).catch(()=>{})
        this.dialogMember=true
      }
      ,
      // 点击放大图片
      handlePictureCardPreview(file) {
        this.temp.silder_image = file.url
        this.dialogVisible = true
      },
      // 图片上传事件
      imgPreview(file, fileList) {
        // const that = this
        this.imgStatus = true
        const fileName = file.name
        const regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
        if (regex.test(fileName.toLowerCase())) {
          this.temp.silder_image = file.url
        } else {
          this.$message.error('请选择图片文件')
        }
        console.log('图片上传事件')
        this.silderimgList = []
        for (let i = 0; i < fileList.length; i++) {
          let obj = {}
          obj = fileList[i].raw
          this.silderimgList.push(obj)
        }
        this.temp.name = fileList[0].raw
        // console.log(file, fileList)
        console.log(this.silderimgList)
        console.log('图片上传事件')

        if (this.temp.id) {
          const data = new FormData()
          data.append('id', this.temp.id)
          data.append('images', file.raw)
          course.upload_image(data).then(res => {
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
      typeChange() {

      },
      getAdminInfo() {
        getInfo().then(res => {
          if (res.data.type === 2) {
            this.user = res.data
            this.selectTrain = false
          }
          this.getList()
          this.getTrainList()
        }).catch(e => {
          console.log(e)
        })
      },
      getTrainList() {
        organization.train_list(1, 999, '', 1).then(res => {
          this.trainList = res.data
        })
      },
      // 上下架
      updateEnable(row){
        const fdata=new FormData();
        fdata.append('id', row.id)
        fdata.append('enable', row.enable)

        course.edit(fdata).then(({code,msg})=>{
          if (code===0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(msg)
          }
        }).catch(()=>{})
      },
      getList() {
        this.listLoading = false
        this.list = []
        console.log(this.user.id)
        course.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.type, this.user.id).then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              row.image = this.imgsrc + row.image
              this.train_id = row.train.id
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
          imageFile: '',
          type: '',
          start_time: undefined,
          end_time: undefined,
          open_time: '',
          close_time: '',
          train_id: undefined,
          silder_image: [],
          money: '',
          content: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        if (this.user.type === 2) {
          this.temp.train_id = this.train_id
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        const that = this
        this.temp = Object.assign({}, row) // copy obj
        this.temp.silderimgList = []
        if (this.temp.images !== '') {
          var img = (this.temp.images).split(';')
          img.forEach(function(row, index) {
            row = that.imgsrc + row
            that.temp.silderimgList.push({ url: row })
          })
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
            data.append('title', tempData.title)
            data.append('train_id', tempData.train_id)

            if (tempData.train_id === '') {
              return this.$message.warning('请选择培训机构')
            }
            data.append('desc', tempData.desc)
            data.append('money', tempData.money)
            if (tempData.start_time === undefined) {
              return this.$message.warning('上课时间不能为空')
            }
            if (tempData.end_time === undefined) {
              return this.$message.warning('下课时间不能为空')
            }
            data.append('start_time', tempData.start_time)
            data.append('end_time', tempData.end_time)
            if (tempData.open_time === null) {
              return this.$message.warning('请输入报名时间')
            }
            if (tempData.close_time === null) {
              return this.$message.warning('请输入报名时间')
            }
            data.append('open_time', this.handleDate(tempData.open_time))
            data.append('close_time', this.handleDate(tempData.close_time))
            data.append('content', tempData.content)
            if (this.temp.imageFile != null) {
              data.append('image', this.temp.imageFile)
            }
            course.edit(data).then(response => {
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
            data.append('title', tempData.title)
            if (tempData.train_id === undefined) {
              return this.$message.warning('请选择培训机构')
            }
            data.append('train_id', tempData.train_id)
            data.append('desc', tempData.desc)
            data.append('money', tempData.money)
            if (tempData.start_time === undefined) {
              return this.$message.warning('上课时间不能为空')
            }
            if (tempData.end_time === undefined) {
              return this.$message.warning('下课时间不能为空')
            }
            data.append('start_time', tempData.start_time)
            data.append('end_time', tempData.end_time)
            if (tempData.open_time === null) {
              return this.$message.warning('请输入报名时间')
            }
            if (tempData.close_time === null) {
              return this.$message.warning('请输入报名时间')
            }
            data.append('open_time', this.handleDate(tempData.open_time))
            data.append('close_time', this.handleDate(tempData.close_time))
            data.append('content', tempData.content)
            if (this.temp.imageFile != null) {
              data.append('image', this.temp.imageFile)
            }
            // 上传多图
            for (var i = 0; i < this.silderimgList.length; i++) {
              // 使用for循环添加图片
              if (i >= 9) { continue } // 图片数目不能大于9
              else {
                if (this.silderimgList[i].size <= 5242880) { // 上传图片不能超过5M
                  data.append('images[]', this.silderimgList[i])
                  /* 注意，这里的双引号里的变量名称后面必须要加上[]*/
                }
              }
            }
            course.add(data).then(() => {
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
        course.del(row.id).then(({ code, msg }) => {
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

