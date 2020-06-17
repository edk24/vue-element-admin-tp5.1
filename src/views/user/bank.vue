<template>
  <div class="app-container">
    <p>
      <el-input
        v-model="keyword"
        maxlength="16"
        style="width:300px;margin-right:15px"
        placeholder="请输入关键字,例如用户名/开户行/手机号"
        @keyup.enter.native="search()"
      />
      <el-button type="primary" @click="search()">搜索</el-button>
      <el-button type="primary" @click="all()">全部</el-button>
      <el-button type="info" @click="wait()">未审核</el-button>
      <el-button type="success" @click="success()">审核成功</el-button>
      <el-button type="danger" @click="fail()">审核失败</el-button>
    </p>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      >
        <template scope="scope">
          <span>{{ (page - 1) * limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" width="120">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" width="200">
        <template slot-scope="scope">
          {{ scope.row.bank_code }}
        </template>
      </el-table-column>
      <el-table-column label="开户行" width="120">
        <template slot-scope="scope">
          {{ scope.row.bank_deposit }}
        </template>
      </el-table-column>
      <el-table-column label="开户支行" width="240">
        <template slot-scope="scope">
          {{ scope.row.bank_branch }}
        </template>
      </el-table-column>
      <el-table-column label="银行预留手机号码">
        <template slot-scope="scope">
          {{ scope.row.bank_phone }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">未审核</span>
          <span v-if="scope.row.status === 1">审核成功</span>
          <span v-if="scope.row.status === 2">审核失败</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="管理">
        <template slot-scope="scope">
          <div>
            <el-button size="small" type="primary" @click="edit(scope.row,scope.$index)">查看</el-button>
            <el-popconfirm title="确定删除这行信息吗?" @onConfirm="del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <p>
      <el-pagination
        background
        :current-page.sync="page"
        :page-size="limit"
        layout="total, prev, pager, next"
        :total="count"
        @current-change="fetchData"
      />
    </p>

    <el-dialog
      :visible.sync="centerDialogVisible"
      width="600px"
      center
      @close="intiHandle"
    >
      <div class="box">
        <div class="row">
          <span class="key">真实姓名：</span>
          <span
            class="val"
          >{{ userInfo.realname }}</span>
        </div>
        <div class="row">
          <span class="key">身份证号：</span>
          <span class="val">{{ userInfo.id_number }}</span>
        </div>
        <div class="row">
          <div class="key key1">身份证照片：</div>
          <img class="poster" :src="userInfo.card_image" alt="">
        </div>
        <div class="row">
          <div class="key key1">手持身份证照片：</div>
          <img class="poster" :src="userInfo.hand_image" alt="">
        </div>
        <div class="row">
          <span class="key">学校：</span>
          <span v-if="userInfo.school_name" class="val">{{ userInfo.school_name }}</span>
          <span v-else class="val">无</span>
        </div>
        <div class="row">
          <span>班级：</span>
          <span v-if="userInfo.class" class="val">{{ userInfo.class }}</span>
          <span v-else class="val">无</span>
        </div>
        <div
          class="row"
        >
          <span>省：</span>
          <span class="val">{{ userInfo.province }}</span>
        </div>
        <div
          class="row"
        >
          <span>市：</span>
          <span class="val">{{ userInfo.city }}</span>
        </div>
        <div
          class="row"
        >
          <span>区：</span>
          <span class="val">{{ userInfo.area }}</span>
        </div>
        <div
          class="row"
        >
          <span>详细地址：</span>
          <span class="val">{{ userInfo.address }}</span>
        </div>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import {
    bank_list,
    bank_del
  } from '@/api/user'
  export default {
    components: {},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        url: process.env.VUE_APP_BASE_API,
        userInfo: {},
        list: [],
        count: 0,
        page: 1,
        limit: 10,
        keyword: '',
        status: null,
        listLoading: true,
        centerDialogVisible: false,
        rules: {
          title: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.fetchData(1)
    },
    methods: {
      // 关闭对话窗初始化数据
      intiHandle() {
        this.userInfo = {}
        console.log(this.userInfo)
      },
      /**
       * 查看数据
       */
      edit(obj, index) {
        this.form = obj
        this.centerDialogVisible = true
        this.getData(index)
      },
      getData(index) {
          console.log(index)
            if (this.list[index].user.school) {
                this.list[index].user.school_name = this.list[index].user.school.title
            } else {
               this.list[index].user.school_name = null
            }
            this.userInfo = this.list[index].user
            console.log(this.userInfo)
      },
      // 拉取数据
      fetchData(page) {
        const that = this
        if (page) {
          this.page = page
          if (page <= 1) {
            that.page = 1
          }
        }
        this.listLoading = true
        bank_list(this.page, this.limit, this.keyword, this.status).then(response => {
          that.list = []
          response.data.forEach(row => {
            row.user.card_image = that.url + row.user.card_image
            row.user.hand_image = that.url + row.user.hand_image
            that.list.push(row)
          })
          this.count = response.count
          this.listLoading = false
        }).catch((err) => {
          console.log(err.message)
        })
      },
      // 删除银行卡
      del(obj) {
        bank_del(obj.id).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '删除失败')
          }
        }).catch(() => { })
      },
      // 搜索
      search() {
        if (this.keyword) {
          this.fetchData(1)
        } else {
          this.$message.warning('请输入关键词')
        }
      },
      // 查询全部
      all() {
        this.keyword = ''
        this.status = null
        this.fetchData()
      },
      // 未审核----查询未核的数据
      wait() {
        this.status = 0
        this.fetchData()
      },
      // 成功----查询审核成功的数据
      success() {
        this.status = 1
        this.fetchData()
      },
      // 失败 -----查询审核失败的数据
      fail() {
        this.status = 2
        this.fetchData()
      }
    }
  }
</script>

<style>
  .el-upload__tip {
    line-height: 1.2;
  }

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

  .icon {
    width: 50px;
    height: 50px;
    border-radius: 3px;
  }
    .row{
        margin-bottom: 10px;
    }
  .key{
      margin-right: 10px;
  }
  .val{
      font-weight: 700;
  }
  .poster{
      margin: 20px;
      width: 300px;
      height: 200px;
  }
</style>
