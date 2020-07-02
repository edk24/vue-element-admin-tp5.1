<template>
  <div class="app-container">

    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column label="头像" fixed>
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type===0">家长</span>
          <span v-else-if="scope.row.type===1">子公司</span>
          <span v-else-if="scope.row.type===2">培训机构</span>
          <span v-else-if="scope.row.type===3">股东</span>
          <span v-else-if="scope.row.type===4">学生</span>
          <span v-else-if="scope.row.type===5">未知</span>
          <span v-else-if="scope.row.type===6">学校</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <!-- <el-table-column prop="realname" label="真实姓名" />
      <el-table-column prop="money" label="余额" />
      <el-table-column prop="jifen" label="积分" /> -->
      <el-table-column label="实名状态">
        <template slot-scope="scope">
          <span v-if="scope.row.audit===3">通过</span>
          <span v-else-if="scope.row.audit===1">申请中</span>
          <span v-else-if="scope.row.audit===2">驳回</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex===1">男</span>
          <span v-else-if="scope.row.sex===0">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }}
          <p>{{ scope.row.address }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="注册时间" />
      <el-table-column label="管理" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-if="scope.row.audit === 1" size="mini" type="primary" @click="showAuditDialog(scope.row)">审核</el-button>
            <el-popconfirm title="确认删除吗?" @onConfirm="onUserDel(scope.row)">
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <p>
      <el-pagination background layout="prev, pager, next" :total="count" :page-size="limit" />
    </p>

    <!-- 信息审核 -->
    <el-dialog
      title="审核"
      :visible.sync="visibleAuditDialog"
      width="600px"
      center
    >

      <el-form label-width="100px">
        <el-form-item label="真实姓名">{{ userInfo.realname }}</el-form-item>
        <el-form-item label="手机号">{{ userInfo.phone }}</el-form-item>
        <el-form-item label="身份证号码">{{ userInfo.id_number }}</el-form-item>
        <el-form-item label="生日">{{ userInfo.birthday }}</el-form-item>

        <div class="demo-type">
          <div>
            <el-image :src="userInfo.card_image_a" :preview-src-list="userInfo.image" />
          </div>
          <div>
            <el-image :src="userInfo.card_image_b" :preview-src-list="userInfo.image" />
          </div>
          <div>
            <el-image :src="userInfo.hand_image" :preview-src-list="userInfo.image" />
          </div>
        </div>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAudit(true)">通 过</el-button>
        <el-button type="danger" @click="onAudit(false)">驳 回</el-button>
        <el-button @click="visibleAuditDialog=false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { user_list, user_del, user_audit } from '@/api/user'
export default {
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,

      userList: [],
      count: 0,
      page: 0,
      limit: 25,
      keyword: '',
      type: -1,

      // 显示培训机构
      visibleAuditDialog: false,
      // 机构信息
      userInfo: {
        id: 0,
        birthday: '',
        phone: '',
        realname: '',
        id_number: '',
        card_image: '',
        card_image_a: '',
        card_image_b: '',
        hand_image: '',
        audit: 1,
        image: []
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 抓取数据
    fetchData(clear = false) {
      if (clear) {
        this.userList = []
        this.page = 0
      }

      this.page++
      this.refreshData()
    },
    // 刷新数据
    refreshData() {
      if (this.page <= 0) {
        this.page = 1
      }
      this.userList = []
      user_list(this.page, this.limit, this.keyword, this.type, 1).then(
        ({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(user => {
              this.userList.push(user)
            })
            this.count = count
          } else {
            this.$message.warning(msg)
          }
        }
      )
    },
    // 提交审核
    onAudit(status) {
      if (status) {
        user_audit(this.userInfo.id, 3).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.refreshData()
          } else {
            this.$message.error(msg)
          }
        }).catch(() => {})
      } else {
        user_audit(this.userInfo.id, 2).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('操作成功')
            this.refreshData()

          } else {
            this.$message.error(msg)
          }
        }).catch(() => {})
      }

      this.visibleAuditDialog = false
    },
    // 打开审核对话框
    showAuditDialog(row) {
        this.userInfo = row
        this.userInfo.hand_image = this.url + this.userInfo.hand_image
        this.userInfo.image = []
        this.userInfo.image.push(this.userInfo.hand_image)
        if (this.userInfo.card_image != null && this.userInfo.card_image.indexOf(';') > 0) {
          const img = this.userInfo.card_image.split(';')
          this.userInfo.card_image_a = this.url + img[0]
          this.userInfo.card_image_b = this.url + img[1]
        this.userInfo.image.push(this.userInfo.card_image_a)
        this.userInfo.image.push(this.userInfo.card_image_b)
        }
        this.visibleAuditDialog = true
    },
    // 删除用户
    onUserDel(row) {
      user_del(row.id)
        .then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('删除成功')
            this.refreshData()
          } else {
            this.$message.error(msg || '删除失败')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.demo-type {
    display: flex;
  div {
    flex:1;
    padding: 0 3px;
    img {
      max-width: 100%;
      max-height: 100px;
    }
  }
  }
</style>
