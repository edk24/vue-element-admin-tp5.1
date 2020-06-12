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
      <!--      <el-table-column label="序号" type="index" width="50" align="center">-->
      <!--        <template scope="scope">-->
      <!--          <span>{{ (listQuery.page - 1) * listQuery.limit + scope.$index + 1 }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column type="index" label="序号" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />
      <el-table-column label="联系人" prop="type" align="center" width="150" style="height: 150px;" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="note" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈主题" prop="note" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.topic }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否已读" prop="note" align="center" width="250" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span v-if="row.is_read === 0">未读</span>
          <span v-if="row.is_read === 1">已读</span>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 弹窗页面   -->
    <el-dialog :title="textMap[dialogStatus]" width="500" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding:0 5px;margin-right:5px;margin-left:50px;">
        <el-form-item label="联系人">
          <el-input v-model="temp.username" readonly=""/>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.phone" readonly=""/>
        </el-form-item>
        <el-form-item label="反馈主题">
          <el-input v-model="temp.topic" readonly=""/>
        </el-form-item>
        <el-form-item label="反馈图片">
          <el-image
            v-for="(item,index) in imglist"
            :key="index"
            style="width: 100px; height: 100px;margin: 0 8px"
            :preview-src-list="imglist"
            :src="item"></el-image>
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input type="textarea" v-model="temp.username" readonly=""/>
        </el-form-item>
      </el-form>
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button type="danger" @click="refuse()">已读</el-button>-->
<!--        <el-button type="success" @click="pass()">返回</el-button>-->
<!--      </span>-->
      <div slot="footer" class="dialog-footer">
        <el-button v-if="temp.is_read === 0" type="success" @click="read(temp.id)">
          已读
        </el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { feedback } from '@/api/feedback'
  import Pagination from '@/components/Pagination'
  const type = [
    { key: 'all', name: '全部' },
    { key: '0', name: '未读' },
    { key: '1', name: '已读' }
  ]
  export default {
    components: { Pagination },
    data() {
      return {
        imglist: [],
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
          update: '查看详情',
          create: '创建'
        },
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
        this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      getList() {
        this.listLoading = false
        this.list = []
        feedback.getlist(this.listQuery.page, this.listQuery.limit, this.listQuery.keyword, this.listQuery.type).then(({ code, msg, data, count }) => {
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
      read(id) {
        feedback.read(id).then(res => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '阅读成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(error => {
          console.log(error)
        })
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
      handleUpdate(row) {
        this.imglist = []
        const that = this
        this.temp = Object.assign({}, row) // copy obj
        var img = (row.images).split(';')
        img.forEach(function(res) {
          res = that.imgsrc + res
          that.imglist.push(res)
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDelete(row, index) {
        feedback.del(row.id).then(({ code, msg }) => {
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

