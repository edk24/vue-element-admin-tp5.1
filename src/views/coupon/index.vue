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

        <el-select v-model="listQuery.master_id" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option label="培训班-全部" value="-1" />
          <el-option v-for="item in train_list" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-select v-model="listQuery.target_id" filterable style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option label="培训课程-全部" value="all" />
          <el-option label="全店通用" value="0" />
          <el-option v-for="item in course_list" :key="item.id" :label="item.title" :value="item.id" />
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
      <el-table-column label="优惠券标题" prop="title" width="150" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训机构" prop="type" align="center" width="150" style="height: 150px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.train.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用课程" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.course != null">{{ row.course.title }}</span>
          <span v-if="row.course === null">全店通用</span>
        </template>
      </el-table-column>
      <el-table-column label="时间范围" prop="note" align="center" width="220" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.start_time }}&nbsp;&nbsp;至&nbsp;&nbsp;{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发行数量" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.issue_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" prop="note" align="center" width="150" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
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
          <el-button type="success" size="mini" @click="handleEdit(row)">
            更改库存
          </el-button>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="优惠券标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="培训机构">
          <el-select v-model="temp.master_id" filterable placeholder="请选择" @change="handleTempTrain()">
            <el-option
              v-for="item in train_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="temp.target_id" filterable placeholder="请选择">
            <el-option
              label="全店通用"
              value="0"
            />
            <el-option
              v-for="item in course_list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="temp.start_time"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="temp.end_time"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="发布数量" prop="issue_number">
          <el-input v-model="temp.issue_number" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="剩余数量" prop="issue_number">
          <el-input v-model="temp.number" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="满减金额" prop="full_money">
          <el-input v-model="temp.full_money" clearable placeholder="请输入满减金额" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="减少金额" prop="dec_money">
          <el-input v-model="temp.dec_money" maxlength="10" placeholder="请输入减少金额" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="editDialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="优惠券标题" prop="title">
          <el-input v-model="temp.title" readonly />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="temp.start_time"
            type="date"
            placeholder="选择日期"
            readonly
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="temp.end_time"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="发布数量" prop="issue_number">
          <el-input v-model="temp.issue_number" readonly oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="剩余数量" prop="number">
          <el-input v-model="temp.number" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="增加数量">
          <el-button type="primary" @click="addnum(1)">
            +1
          </el-button>
          <el-button type="primary" @click="addnum(5)">
            +5
          </el-button>
          <el-button type="primary" @click="addnum(20)">
            +20
          </el-button>
          <el-button type="primary" @click="addnum(100)">
            +100
          </el-button>
        </el-form-item>
        <el-form-item label="减少数量">
          <el-button type="primary" @click="delnum(1)">
            - 1
          </el-button>
          <el-button type="primary" @click="delnum(5)">
            - 5
          </el-button>
          <el-button type="primary" @click="delnum(20)">
            - 20
          </el-button>
          <el-button type="primary" @click="delnum(100)">
            - 100
          </el-button>
        </el-form-item>
        <el-form-item label="满减金额" prop="full_money">
          <el-input v-model="temp.full_money" readonly clearable placeholder="请输入满减金额" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="减少金额" prop="dec_money">
          <el-input v-model="temp.dec_money" readonly maxlength="10" placeholder="请输入减少金额" oninput="value=value.replace(/[^\d.]/g,'')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diastatus">
          取消
        </el-button>
        <el-button v-if="dialogStatus != 'update'" type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import { coupon } from '@/api/coupon'
  import { formatDate } from '@/utils/time.js'
  import Pagination from '@/components/Pagination'
  import { organization } from '@/api/organization'
  import { course } from '@/api/course'
  import { mapGetters } from 'vuex'
  const type = [
    { key: 'all', name: '全部' },
    { key: 'forum', name: '论坛' },
    { key: 'goods', name: '商品分类' },
    { key: 'learn', name: '学生课程' }
  ]
  export default {
    components: { Pagination },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'id'
      ])
    },
    data() {
      return {
        user: {},
        train_list: [],
        course_list: [],
        imgsrc: process.env.VUE_APP_BASE_API,
        tableKey: 0,
        list: {
          train: []
        },
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          type: 'train',
          keyword: '',
          master_id: '-1',
          target_id: 'all'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        editDialogFormVisible: false,
        rules: {
          title: [{ required: true, message: '不能为空', trigger: 'change' }],
          full_money: [
            { required: true, type: 'string', trigger: 'blur', message: '金额不能为空' },
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
          ],
          dec_money: [
            { required: true, type: 'string', trigger: 'blur', message: '金额不能为空' },
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留两位小数' }
          ]
        },
        temp: {
          id: undefined,
          title: '',
          type: '',
          type_title: '',
          master_id: '2'
        },
        textMap: {
          update: '查看详情',
          create: '创建',
          edit: '更改库存'
        }
      }
    },
    mounted() {
      this.getTrainList()
    },
    created() {
      this.user.id = this.$store.state.user.id
      this.user.type = this.$store.state.user.type
      this.getList()
    },
    methods: {
      search() {
        this.getList()
      },
      addnum(row) {
        this.temp.number = parseInt(this.temp.number) + row
      },
      delnum(row) {
        if (this.temp.number - row < 0) {
          return this.$message.warning('数量过少')
        }
        this.temp.number = parseInt(this.temp.number) - row
      },
      diastatus() {
        this.dialogFormVisible = false
        this.editDialogFormVisible = false
      },
      handleDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
        if (this.listQuery.master_id !== '-1') {
          this.getCourseList()
        } else {
          this.listQuery.target_id = 'all'
        }
      },
      handleEdit(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'edit'
        this.editDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleTempTrain() {
        this.listQuery.master_id = this.temp.master_id
        this.getCourseList()
      },
      getTrainList() {
        organization.train_list(1, 9999, '', 1).then(res => {
          this.train_list = res.data
        }).catch(e => {
          console.log(e)
        })
      },
      getCourseList() {
        course.getlist(1, 9999, this.listQuery.master_id).then(res => {
          this.course_list = res.data
          console.log(res.data)
        }).catch(e => {
          console.log(e)
        })
      },
      getList() {
        this.listLoading = false
        this.list = []
        coupon.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type, this.listQuery.master_id, this.listQuery.target_id).then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.total = count
            data.forEach(row => {
              row.image = this.imgsrc + row.image
              this.list.push(row)
            })
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
          master_id: '',
          target_id: '',
          start_time: null,
          end_time: null,
          issue_number: '',
          number: '',
          full_money: '',
          dec_money: ''
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
            // const data = new FormData()
            // data.append('title', tempData.title)
            // if (tempData.master_id === '') {
            //   return this.$message.error('必须选择机构')
            // }
            // if (tempData.target_id === '') {
            //   return this.$message.error('必须选择课程')
            // }
            // if (tempData.start_time === null) {
            //   return this.$message.error('必须选择开始时间')
            // }
            // if (tempData.end_time === null) {
            //   return this.$message.error('必须选择结束时间')
            // }
            // data.append('target_id', tempData.target_id)
            // data.append('type', this.listQuery.type)
            // data.append('master_id', tempData.master_id)
            // data.append('start_time', this.handleDate(tempData.start_time))
            // data.append('end_time', this.handleDate(tempData.end_time))
            // data.append('number', tempData.number)
            var data = {
              number: tempData.number,
              end_time: tempData.end_time
            }
            // data.append('full_money', tempData.full_money)
            // data.append('dec_money', tempData.dec_money)
            coupon.edit(tempData.id, data).then(response => {
              // const index = this.list.findIndex(v => v.id === this.temp.id)
              // this.list.splice(index, 1, tempData)
              this.getList()
              this.editDialogFormVisible = false
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
            if (tempData.master_id === '') {
              return this.$message.error('必须选择机构')
            }
            if (tempData.target_id === '') {
              return this.$message.error('必须选择课程')
            }
            if (tempData.start_time === null) {
              return this.$message.error('必须选择开始时间')
            }
            if (tempData.end_time === null) {
              return this.$message.error('必须选择结束时间')
            }
            data.append('target_id', tempData.target_id)
            data.append('type', this.listQuery.type)
            data.append('master_id', tempData.master_id)
            data.append('start_time', this.handleDate(tempData.start_time))
            data.append('end_time', this.handleDate(tempData.end_time))
            data.append('number', tempData.issue_number)
            data.append('full_money', tempData.full_money)
            data.append('dec_money', tempData.dec_money)
            coupon.add(data).then(() => {
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
        coupon.del(row.id).then(({ code, msg }) => {
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

