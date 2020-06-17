<template>
  <div class="app-container">
    <p>
      <!-- <el-input
        v-model="keyword"
        maxlength="16"
        style="width:300px;margin-right:15px"
        placeholder="请输入关键字,例如用户名/开户行/手机号"
        @keyup.enter.native="search()"
      />
      <el-button type="primary" @click="search()">搜索</el-button> -->
      <el-button type="primary" @click="all()">全部</el-button>
      <el-button type="info" @click="wait()">申请中</el-button>
      <el-button type="success" @click="success()">提现成功</el-button>
      <el-button type="danger" @click="fail()">提现失败</el-button>

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
      <el-table-column label="申请金额" width="120">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="实际到账金额" width="120">
        <template slot-scope="scope">
          {{ scope.row.real_money }}
        </template>
      </el-table-column>
      <el-table-column label="手续费比例" width="120">
        <template slot-scope="scope">
          {{ scope.row.percent }}
        </template>
      </el-table-column>

      <el-table-column label="手续费" width="120">
        <template slot-scope="scope">
          {{ scope.row.procedure_fee }}
        </template>
      </el-table-column>

      <el-table-column label="提现备注" width="200">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="提现状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">申请中</span>
          <span v-if="scope.row.status === 1">提现成功</span>
          <span v-if="scope.row.status === 2">提现失败</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="拒绝理由" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="管理">
        <template slot-scope="scope">
          <div>
            <el-button size="small" type="primary" @click="edit(scope.row,scope.$index)">查看</el-button>
            <el-popconfirm title="确定删除这行信息吗?" @onConfirm="del(scope.row)">
              <!-- <el-button slot="reference" size="small" type="danger">删除</el-button> -->
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
      title="提现审核"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
      @close="intiHandle"
    >
      <div class="box">
        <div class="row">
          <div class="key">提现金额：</div>
          <span class="val" style="color: #ff0000;">￥{{ userInfo.money }}</span>
        </div>
        <div class="row">
          <div class="key">实际到账金额：</div>
          <span class="val" style="color: #ff0000;">￥{{ userInfo.real_money }}</span>
        </div>
        <div class="row">
          <div class="key">手续费：</div>
          <span class="val" style="color: #ff0000;">￥{{ userInfo.procedure_fee }}</span>
        </div>
        <div class="row">
          <div class="key">收款方式：</div>
          <span class="val">{{ userInfo.beneficiary_type }}</span>
        </div>
        <div class="row">
          <div class="key">收款银行：</div>
          <span class="val">{{ userInfo.bank_name }}</span>
        </div>
        <div class="row">
          <div class="key">收款卡号：</div>
          <span class="val">{{ userInfo.bank_number }}</span>
        </div>
        <div class="row">
          <div class="key">收款人姓名：</div>
          <span class="val">{{ userInfo.bank_user }}</span>
        </div>
        <div class="row">
          <div class="key">状态：</div>
          <span v-if="userInfo.status === 0" class="val">待提现</span>
          <span v-if="userInfo.status === 1" class="val">提现成功</span>
          <span v-if="userInfo.status === 2" class="val">提现失败</span>
        </div>
      </div>
      <div v-if="userInfo.status === 0" class="row">
        <textarea v-model="note" class="note" placeholder="若拒绝，请填写拒绝反馈" cols="30" rows="6" />
      </div>
      <span v-if="userInfo.status === 0" slot="footer" class="dialog-footer">
        <el-button type="danger" @click="refuse">拒 绝</el-button>
        <el-button type="success" @click="pass">通 过</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {
    withdrawal_list,
    withdrawal_permission
  } from '@/api/finance'
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
        id: 0, // 银行卡id
        status: '',
        note: '',
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
        this.id = obj.id
        this.centerDialogVisible = true
        this.getData(index)
      },
      getData(index) {
          console.log(index)
            this.userInfo = this.list[index]
            this.userInfo.bank_name = this.list[index].beneficiary_info.bank
            this.userInfo.bank_number = this.list[index].beneficiary_info.numbe
            this.userInfo.bank_user = this.list[index].beneficiary_info.user
            console.log(this.userInfo)
      },
      // 拉取数据
      fetchData(page, status) {
        const that = this
        if (page) {
          this.page = page
          if (page <= 1) {
            that.page = 1
          }
        }
        var data = {}
        if (status) {
            data.page = this.page
            data.limit = this.limit
            data.status = this.status
        } else {
            data.page = this.page
            data.limit = this.limit
            data.query_all = 1
        }
        this.listLoading = true
        withdrawal_list(data).then(response => {
          that.list = []
          response.data.forEach(row => {
            console.log(row)
            that.list.push(row)
          })
          this.count = response.count
          this.listLoading = false
        }).catch((err) => {
          console.log(err.message)
        })
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
        this.fetchData(1, 'status')
      },
      // 成功----查询审核成功的数据
      success() {
        this.status = 1
        this.fetchData(1, 'status')
      },
      // 失败 -----查询审核失败的数据
      fail() {
        this.status = 2
        this.fetchData(1, 'status')
      },
      // 审核驳回
      refuse() {
        if (this.note === '') {
            this.$message.error('请输入驳回理由')
            return
        }
        this.permission(2)
      },
      // 审核通过
      pass() {
        this.permission(1)
      },
      permission(status) {
          var data = {}
          var text = ''
          if (status === 2) {
              text = '驳回成功'
              data.status = status
              data.reason = this.note
          } else {
              text = '提现成功'
              data.status = status
          }
          withdrawal_permission(this.id, data).then(res => {
              console.log(res)
              if (res.code === 0) {
                  this.$message.success(text)
                  this.fetchData()
              }
              this.note = ''
              this.centerDialogVisible = false
          }).catch((err) => {
            console.log(err.message)
             this.note = ''
            this.centerDialogVisible = false
          })
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
      width: 100%;
      display: flex;
      align-items: center;
     margin-bottom: 10px;
  }
  .key{
      width: 40%;
      text-align: right;
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
  .note{
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      resize: none;
  }
</style>
