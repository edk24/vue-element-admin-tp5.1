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

        <el-select v-model="listQuery.category" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option key="all" label="全部-分类" value="all" />
          <el-option v-for="item in learn_cate" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>

        <el-select v-model="listQuery.category_two" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option key="all" label="全部-年级" value="" />
          <el-option v-for="item in learn_cate_two" :key="item.id" :label="item.title" :value="item.id" />
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
      <!--      <el-table-column type="index" label="序号" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />-->
      <el-table-column label="视频名称" prop="title" width="250" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类" prop="category">
        <template slot-scope="{row}">
          <span>{{ row.cate.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="二级分类" prop="category">
        <template slot-scope="{row}">
          <span>{{ row.cate_two.title }}</span>
        </template>
      </el-table-column>

<!--      <el-table-column label="年级" prop="category">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.grade }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="封面图片" prop="type" align="center" width="200" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <el-image class="image" :src="row.images">
            <div slot="error" class="image-slot">
              暂未上传
            </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column label="发布人" prop="type" align="center" width="160" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" prop="type" align="center" width="160" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.look_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="视频时长" prop="type" align="center" width="180" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.len }}秒</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="type" align="center" width="160" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.status === 0">待转码</span>
          <span v-else-if="row.status === 1">转码中</span>
          <span v-else-if="row.status === 2">转码完成</span>
          <span v-else-if="row.status === 3">转码失败</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="create_time" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="修改时间" prop="update_time" align="center" width="250" :class-name="getSortClass('id')">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.update_time }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" fixed="right" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="play(row)">
            查看视频
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
        <el-form-item label="视频名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="视频分类" prop="category">
          <el-cascader
            v-model="selectedOptions"
            :options="learn_cate"
            :props="optionProps"
            @change="handleCategory"
          />
        </el-form-item>
        <el-form-item label="视频简介" prop="desc">
          <el-input
            v-model="temp.desc"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5}"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="发布人" prop="author">
          <el-input v-model="temp.author" />
        </el-form-item>
<!--        <el-form-item label="年级">-->
<!--          <el-select v-model="temp.grade" style="width: 140px" class="filter-item">-->
<!--            <el-option v-for="item in grade" :key="item.key" :label="item.key" :value="item.key" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="封面图片">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
            style="width: 200px; height: 200px"
          >
            <img v-if="temp.images" style="width: 200px; height: 200px" :src="temp.images" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div>默认截取视频的某一帧为封面，也可以自己上传</div>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            class="upload-demo"
            name="video"
            :action="action"
            :on-success="handleVideoSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个视频文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频详情">
          <editor-bar v-model="temp.content" :is-clear="isClear" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="playDialogFormVisible">
      <div class="whole">
        <video style="display: block;margin: 0 auto;" :src="temp.video_url" controls="controls" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { learn } from '@/api/learn'
  import { category } from '@/api/category'
  import Pagination from '@/components/Pagination'
  import EditorBar from '@/components/wangEnduit'
  const grade = [
    { key: '小学' },
    { key: '初中' },
    { key: '高中' }
  ]
  export default {
    components: { Pagination, EditorBar },
    data() {
      return {
        selectedOptions: [],
        learn_cate_two: [],
        optionProps: {
          value: 'id',
          label: 'title',
          children: 'children'
        },
        videoRes: '',
        grade: grade,
        learn_cate: [],
        fileList: [{ name: '视频已上传', url: '' }],
        action: process.env.VUE_APP_BASE_API + '/v1/uploads/video',
        imgsrc: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: null,
        total: 0,
        isClear: false,
        detail: '',
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          keyword: '',
          type: '4',
          category: 'all',
          grade: 'all',
          category_two: ''
        },
        dialogStatus: '',
        dialogFormVisible: false,
        playDialogFormVisible: false,
        rules: {
          title: [{ required: true, message: '不能为空', trigger: 'change' }],
          desc: [{ required: true, message: '不能为空', trigger: 'change' }],
          author: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        temp: {
          id: undefined,
          title: '',
          desc: '',
          imageFile: '',
          category: '',
          category_two: ''
        },
        textMap: {
          update: '编辑',
          create: '创建',
          play: '播放视频'
        },
        typelist: {}
      }
    },
    created() {
      this.getList()
      this.getCate()
    },
    methods: {
      search() {
        this.getList()
      },
      handleCategory(value) {
        this.temp.category = value[0]
        this.temp.category_two = value[1]
      },
      handleFilter(row, index) {
        this.listQuery.page = 1
        this.getList()
        this.getCateTwo()
      },
      getCate() {
        category.getlist(1, 9999, '', 'learn').then(({ code, msg, data, count }) => {
          this.learn_cate = data
        })
      },
      getCateTwo() {
        category.getlist(1, 9999, '', 'learn', this.listQuery.category).then(({ code, msg, data, count }) => {
          this.learn_cate_two = data
        })
      },
      getList() {
        this.listLoading = false
        this.list = []
        learn.list(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type, this.listQuery.category, this.listQuery.category_two).then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              row.images = this.imgsrc + row.images
              row.video_url = this.imgsrc + row.video_url
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
          images: '',
          imageFile: null,
          category: ''
        }
      },
      play(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'play'
        this.playDialogFormVisible = true
      },
      handleCreate() {
        this.resetTemp()
        this.fileList = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.videoRes = 'init'
        this.temp = Object.assign({}, row) // copy obj
        var str = row.category + ',' + row.category_two
        this.selectedOptions = str.split(',')
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        const that = this
        const loading = this.$loading({
          type: 'text',
          text: '加载中,请稍等...'
        })
        setTimeout(function() {
          loading.close()
          that.$refs['dataForm'].validate((valid) => {
            if (valid) {
              const tempData = Object.assign({}, that.temp)
              const data = new FormData()
              data.append('id', tempData.id)
              data.append('title', tempData.title)
              data.append('category', tempData.category)
              data.append('category_two', tempData.category_two)
              data.append('content', tempData.content)
              // data.append('grade', tempData.grade)
              if (that.videoRes === '') {
                return that.$message.error('没有上传视频')
              }
              if (that.videoRes !== 'init') {
                data.append('video', that.videoRes.url)
                data.append('video_url', that.videoRes.video_url)
                data.append('len', that.videoRes.len)
              }
              if (that.temp.imageFile != null) {
                data.append('images', that.temp.imageFile)
              } else {
                if (that.videoRes !== 'init') {
                  data.append('images', that.videoRes.image)
                }
              }
              data.append('desc', tempData.desc)
              learn.edit(data).then(response => {
                // const index = that.list.findIndex(v => v.id === that.temp.id)
                // that.list.splice(index, 1, tempData)
                that.dialogFormVisible = false
                that.getList()
                that.$notify({
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
        }, 1200)
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            const data = new FormData()
            data.append('title', tempData.title)
            data.append('author', tempData.author)
            if (tempData.category === undefined) {
              return this.$message.warning('请选择分类')
            }
            data.append('category', tempData.category)
            data.append('category_two', tempData.category_two)
            data.append('content', tempData.content)
            // if (tempData.grade === undefined) {
            //   return this.$message.warning('请选择年级')
            // }
            // data.append('grade', tempData.grade)
            if (this.videoRes === '') {
              return this.$message.error('没有上传视频')
            }
            data.append('video', this.videoRes.url)
            data.append('video_url', this.videoRes.video_url)
            data.append('len', this.videoRes.len)
            if (this.temp.imageFile != null) {
              data.append('images', this.temp.imageFile)
            } else {
              data.append('images', this.videoRes.image)
            }
            data.append('desc', tempData.desc)
            data.append('type', this.listQuery.type)
            learn.add(data).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row, index) {
        learn.del(row.id).then(({ code, msg }) => {
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
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        this.videoRes = ''
        return this.$confirm(`确定移除 ${ file.name }？`)
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
          that.temp.images = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },
      // 上传前回调
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
          layer.msg('请上传正确的视频格式')
          return false
        }
        if (!fileSize) {
          layer.msg('视频大小不能超过50MB')
          return false
        }
        this.isShowUploadVideo = false
      },
      // 进度条
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0) * 1
      },
      // 上传成功回调
      handleVideoSuccess(res, file) {
        this.videoRes = res.data
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

