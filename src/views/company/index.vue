<template>
  <div class="app-container">
    <el-tabs v-model="type" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="审核中" name="check" />
      <el-tab-pane label="已通过" name="ok" />
      <el-tab-pane label="驳回" name="back" />
      <el-tab-pane label="黑名单" name="hmd" />
      <el-tab-pane label="异常企业" name="try" />
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          prop="title"
          label="企业名称"
          width="180"
        />
        <el-table-column
          label="地址"
          width="180"
          prop="created_at"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.company_province }} {{ scope.row.company_city }} {{ scope.row.company_area }} {{ scope.row.company_address }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="异常状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.bug_status	==0">无异常</span>
            <span v-else-if="scope.row.bug_status	==1">异常</span>
            <span v-else-if="scope.row.bug_status	==2">禁止访问</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">资料提交中</span>
            <span v-else-if="scope.row.status==1">通过</span>
            <span v-else-if="scope.row.status==2">驳回</span>
            <span v-else-if="scope.row.status==3">待审核</span>
          </template>
        </el-table-column>

        <el-table-column
          label="驳回原因"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==2">{{ scope.row.return_text }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="created_at"
          label="管理"
          width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status===3"
              type="primary"
              size="small"
              @click="openCheck(scope.row)"
            >审核</el-button>
            <el-button v-else type="primary" size="small" @click="open(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>

    <p>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :size-change="handleSizeChange"
        :total="count"
        :page-size="limit"
        :page-sizes="[20, 50, 100, 150]"

        :current-change="fetchData"
      />
    </p>

    <!-- 审核视图 -->
    <el-dialog
      title="审核"
      :visible.sync="centerDialogVisible"
      width="700px"
      center
    >

      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="企业名称">
          {{ cur_audit_info.title }}
        </el-form-item>
        <el-form-item label="营业执照期限">
          {{ cur_audit_info.business_license_time }}
        </el-form-item>
        <el-form-item label="社会信用代码">
          {{ cur_audit_info.company_code }}
        </el-form-item>
        <el-form-item label="企业性质">
          {{ cur_audit_info.company_nature }}
        </el-form-item>
        <el-form-item label="公司地址">
          {{ cur_audit_info.company_province }} {{ cur_audit_info.company_city }} {{ cur_audit_info.company_area }} {{ cur_audit_info.company_address }}
        </el-form-item>
        <el-form-item label="公司电话">
          {{ cur_audit_info.company_phone }}
        </el-form-item>
        <el-form-item label="公司官网">
          <a :href="cur_audit_info.company_https" target="_blank">{{ cur_audit_info.company_https }}</a>
        </el-form-item>
        <el-form-item label="法人姓名">
          {{ cur_audit_info.person_name }}
        </el-form-item>
        <el-form-item label="身份证号码">
          {{ cur_audit_info.person_number }}
        </el-form-item>
        <el-form-item label="法人身份证有效期">
          {{ cur_audit_info.person_card_time }}
        </el-form-item>
        <el-form-item label="法人地址">
          {{ cur_audit_info.person_province }} {{ cur_audit_info.person_city }} {{ cur_audit_info.person_area }} {{ cur_audit_info.person_address }}
        </el-form-item>
        <el-form-item label="法人手机">
          {{ cur_audit_info.person_phone }}
        </el-form-item>
      </el-form>
      <div class="demo-image__placeholder">
        <div class="block">
          <span class="demonstration">营业执照</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.business_license"
            :preview-src-list="[cur_audit_info.business_license]"
          />
        </div>
        <div class="block">
          <span class="demonstration">法人手持营业执照图片</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.business_license_hand"
            :preview-src-list="[cur_audit_info.business_license_hand]"
          />
        </div>
        <div class="block">
          <span class="demonstration">申请公函</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.head_image"
            :preview-src-list="[cur_audit_info.head_image]"
          />
        </div>
        <div class="block">
          <span class="demonstration">税务证书照片</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.head_image"
            :preview-src-list="[cur_audit_info.head_image]"
          />
        </div>
      </div>

      <div class="demo-image__placeholder">
        <div class="block">
          <span class="demonstration">法人身份证</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.person_card"
            :preview-src-list="[cur_audit_info.person_card]"
          />
        </div>
        <div class="block">
          <span class="demonstration">法人手持身份证照片</span>
          <el-image
            style="width: 250px; height: 150px"
            :src="cur_audit_info.person_hand_card"
            :preview-src-list="[cur_audit_info.person_hand_card]"
          />
        </div>
      </div>

      <span v-if="dialogType==1 " slot="footer" class="dialog-footer">
        <el-button @click="audit(cur_audit_info.id, 2)">驳回</el-button>
        <el-button type="primary" @click="audit(cur_audit_info.id, 1)">通过</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible=false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, company_audit } from '@/api/company'
export default {
  data() {
    return {
      list: [],
      page: 1,
      limit: 20,
      count: 0,
      type: 'all',
      where_type: 0, // 0=>默认 1=>审核中 2=>已通过 3=>驳回的申请 5=>黑名单, 4异常
      centerDialogVisible: false,
      dialogType: 1, // 1=审核, 2=查看详情
      cur_audit_info: {} // 审核数据
    }
  },
  created() {
    this.fetchData(1)
  },
  methods: {
    /**
     * 获取数据
     */
    fetchData(page = null) {
      if (page) {
        this.page = page
      }
      this.list = []
      console.log(this.where_type)
      getList(this.page, this.limit, this.where_type).then(({ code, data, msg, count }) => {
        if (code === 0) {
          this.list = data
          this.count = count
          this.page++
        } else {
          this.$message.error(msg)
        }
      }).catch(() => {})
    },
    /**
     * 审核
     * @param id id
     * @param type 状态 (1=通过, 2=拒绝)
     */
    audit(id, type) {
      this.centerDialogVisible = false
      const postData = {
        id: id,
        type: type,
        note: ''
      }
      if (type === 2) {
        // 拒绝理由
        this.$prompt('请输入驳回理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          postData.note = value
        }).catch(() => {})
      }
      // submit
      company_audit(postData).then(({ code, msg, data, count }) => {
        if (code === 0) {
          this.$message.success(msg || '操作成功')
        } else {
          this.$message.error(msg || '操作失败')
        }
      }).catch(() => {})
    },
    /**
     * 打开审核面板
     */
    openCheck(row) {
      console.log(row)
      this.centerDialogVisible = true
      this.cur_audit_info = row
      this.dialogType = 1
    },
    open(row) {
      this.centerDialogVisible = true
      this.cur_audit_info = row
      this.dialogType = 2
    },

    /**
     * tab被点击
     */
    handleClick(tab, event) {
      const that = this
      if (tab.name === 'all') {
        that.where_type = 0
        that.fetchData(1)
      } else if (tab.name === 'check') {
        that.where_type = 1
        that.fetchData(1)
      } else if (tab.name === 'ok') {
        that.where_type = 2
        that.fetchData(1)
      } else if (tab.name === 'back') {
        that.where_type = 3
        that.fetchData(1)
      } else if (tab.name === 'hmd') {
        that.where_type = 5
        that.fetchData(1)
      } else if (tab.name === 'try') {
        that.where_type = 4
        that.fetchData(1)
      }
    },
    /**
     * 事件-页码改变
     */
    handleSizeChange(val) {
      this.fetchData(1)
    }
  }
}
</script>

<style lang="scss">
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

.demo-image .block,
.demo-image__error .block,
.demo-image__placeholder .block {
  padding: 30px 0;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image .block:last-child,
.demo-image__error .block:last-child,
.demo-image__placeholder .block:last-child {
  border-right: none;
}
.demo-image .demonstration,
.demo-image__error .demonstration,
.demo-image__placeholder .demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__error .block,
.demo-image__placeholder .block {
  width: 49%;
}
.demo-image__error .el-image,
.demo-image__placeholder .el-image {
  width: 300px;
  height: 200px;
}
.demo-image__error .image-slot,
.demo-image__placeholder .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}
.demo-image__placeholder .dot {
  animation: dot 2s steps(3, start) infinite;
  overflow: hidden;
}
</style>
