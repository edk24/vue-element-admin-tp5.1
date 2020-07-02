<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" @click="create()">添加合伙人</el-button>
    </el-row>

    <p>
      <el-row>
        <el-input v-model="keyword" placeholder="请输入关键词" style="width:260px" />
        <el-button type="primary" @click="fetchData(true)">搜索</el-button>
      </el-row>
    </p>

    <el-table :data="list" stripe>
      <el-table-column prop="title" label="企业名称" width="180" />
      <el-table-column prop="code" label="企业统一代码" width="180" />
      <el-table-column prop="username" label="联系人" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="commission" label="产品销售提成(%)" />
      <!-- <el-table-column label="地址">
        <template
          slot-scope="scope"
        >{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }} {{ scope.row.address }}</template>
      </el-table-column>-->
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="showGudonAdmin(scope.row)">股东</el-button>
          <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除吗?" @onConfirm="del(scope.row)">
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <p>
      <el-pagination background layout="prev, pager, next" :total="count" :page-size="limit" />
    </p>

    <!-- 表单 -->
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form label-width="130px" :model="formLabelAlign">
        <el-form-item label="企业名称">
          <el-input v-model="formLabelAlign.title" />
        </el-form-item>
        <el-form-item label="企业统一代码">
          <el-input v-model="formLabelAlign.code" />
        </el-form-item>
        <el-form-item label="营业执照">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="onBeforeUpload"
            :on-change="changeImage"
          >
            <img v-if="formLabelAlign.license" :src="formLabelAlign.license" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formLabelAlign.id==null" label="绑定用户">
          <el-select
            v-model="formLabelAlign.user_id"
            :disabled="formLabelAlign.id>0"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号检索"
            :remote-method="userSearch"
            :loading="loading"
          >
            <el-option
              v-for="item in userList"
              :key="item.nickname"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择市场经理">
          <el-select v-model="formLabelAlign.manager_id" style="width: 140px" class="filter-item">
            <el-option label="顶级" :value="0" />
            <el-option v-for="item in manager_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="formLabelAlign.username" />
        </el-form-item>
        <el-form-item label="联系手机">
          <el-input v-model="formLabelAlign.phone" />
        </el-form-item>
        <el-form-item label="产品销售提点(%)">
          <el-input v-model="formLabelAlign.commission" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 股东管理 -->
    <el-dialog :visible.sync="showGudonDialog">
      <el-table :data="gudonList" stripe>
        <el-table-column prop="username" label="股东称呼" width="180" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.ceo==1">大股东</span>
            <span v-else>股东</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="管理">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="gudonEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗?" @onConfirm="deleteGudon(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <p>
        <el-button size="small" type="primary" @click="gudonCreate()">添加股东</el-button>
      </p>
    </el-dialog>

    <!-- 股东表单 -->
    <el-dialog :visible.sync="showGudonFormDialog">
      <el-form label-width="80px" :model="gudonForm">
        <el-form-item label="股东称呼">
          <el-input v-model="gudonForm.username" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="gudonForm.phone" />
        </el-form-item>

        <el-form-item v-if="gudonForm.id==null" label="绑定用户">
          <el-select
            v-model="gudonForm.user_id"
            :disabled="gudonForm.id>0"
            filterable
            remote
            reserve-keyword
            placeholder="请输入手机号检索"
            :remote-method="userSearch"
            :loading="loading"
          >
            <el-option
              v-for="item in userList"
              :key="item.nickname"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showGudonFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitGudon()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  create as company_create,
  del as company_del,
  update as company_update
} from '@/api/company'
import {
  getList as getGudonList,
  del as gudonDel,
  create as gudonAdd,
  update as gudonUpdate
} from '@/api/company_gudon'
import { user_search } from '@/api/user'
import { manager } from '@/api/manager'
export default {
  data() {
    return {
      manager_list: [],
      url: process.env.VUE_APP_BASE_API,
      list: [],
      page: 1,
      limit: 25,
      count: 0,
      keyword: null,

      // 用户搜索
      userList: [],
      loading: false,

      // 表单
      dialogFormVisible: false,
      formLabelAlign: {
        id: null,
        user_id: 0,
        title: '',
        code: '',
        license: '',
        username: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: '',
        commission: '',
        license_obj: '',
        manager_id: ''
      },

      // 股东管理
      showGudonDialog: false,
      showGudonFormDialog: false,
      gudonList: [],
      gudonForm: {
        id: null,
        user_id: 0,
        company_id: 0,
        username: '',
        phone: ''
      }
    }
  },
  mounted() {
    this.getManagerList()
  },
  created() {
    this.fetchData(true)
  },
  methods: {
    // 拉取数据
    fetchData(clear = false) {
      if (clear) {
        this.page = 1
        this.list = []
      }
      getList(this.page, this.limit, this.keyword)
        .then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              this.list.push(row)
            })
            this.page++
            this.count = count
          } else {
            this.$message.info(msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getManagerList(){
      manager.getlist(1, 9999, '').then(res => {
        this.manager_list = res.data
      }).catch(e => {
        console.log(e)
      })
    },
    // 修改表单
    edit(item) {
      this.formLabelAlign = item
      this.dialogFormVisible = true
    },
    // 创建表单
    create() {
      this.formLabelAlign = { id: null }
      this.dialogFormVisible = true
    },

    // 删除企业
    del(item) {
      company_del(item.id)
        .then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('删除成功')
            this.fetchData(true)
          } else {
            this.$message.warning(msg || '删除失败')
          }
        })
        .catch(() => {
          this.$$message.error('系统错误, 请稍候再试')
        })
    },
    // 提交表单
    submit() {
      const formdata = new FormData()
      formdata.append('user_id', this.formLabelAlign.user_id)
      formdata.append('title', this.formLabelAlign.title)
      formdata.append('code', this.formLabelAlign.code)
      formdata.append('username', this.formLabelAlign.username)
      formdata.append('manager_id', this.formLabelAlign.manager_id)
      formdata.append('phone', this.formLabelAlign.phone)
      formdata.append('province', this.formLabelAlign.province)
      formdata.append('city', this.formLabelAlign.city)
      formdata.append('area', this.formLabelAlign.area)
      formdata.append('address', this.formLabelAlign.address)
      formdata.append('commission', this.formLabelAlign.commission)
      if (this.formLabelAlign.license_obj !== undefined) {
        formdata.append('license', this.formLabelAlign.license_obj)
      }

      if (this.formLabelAlign.id === null) {
        // create
        company_create(formdata).then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('保存成功')
            this.fetchData(true)
          } else {
            this.$message.error(msg || '保存失败')
          }
        })
      } else {
        // update

        company_update(this.formLabelAlign.id, formdata).then(
          ({ code, msg }) => {
            if (code === 0) {
              this.$message.success('保存成功')
              this.fetchData(true)
            } else {
              this.$message.error(msg || '保存失败')
            }
          }
        )
      }

      this.dialogFormVisible = false
    },
    // 提交股东表单
    submitGudon() {
      if (this.gudonForm.id === null) {
        // add
        gudonAdd(this.gudonForm)
          .then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('添加成功')
              this.showGudonFormDialog = false
              this.showGudonAdmin(this.formLabelAlign)
            } else {
              this.$message.error(msg)
            }
          })
          .catch(() => {})
      } else {
        // modify
        gudonUpdate(this.gudonForm.id, this.gudonForm)
          .then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('修改成功')
              this.showGudonFormDialog = false
            } else {
              this.$message.error(msg)
            }
          })
          .catch(() => {})
      }
    },
    // 用户搜索
    userSearch(query) {
      if (query !== '') {
        this.loading = true
        user_search(query)
          .then(({ code, count, data, msg }) => {
            if (code === 0) {
              this.userList = data
            } else {
              this.userSearch = []
              this.$message.warning(msg)
            }
            this.loading = false
          })
          .catch(err => {
            this.loading = false
          })
      } else {
        this.userSearch = []
        this.loading = false
      }
    },

    // On上传图片前
    onBeforeUpload(file) {
      // 验证
      const isRightSize = file.size / 1024 < 500
      if (!isRightSize) {
        this.$message.error('文件大小超过 500KB')
      }

      const isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }

      this.formLabelAlign.license_obj = file
      return false // don't auto upload
    },
    // on 图片被选中
    changeImage(file) {
      var reader = new FileReader()
      reader.onload = e => {
        this.formLabelAlign.license = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },

    // 展示股东管理
    showGudonAdmin(item) {
      this.showGudonDialog = true
      this.formLabelAlign = item
      this.gudonList = []
      const that = this

      getGudonList(item.id)
        .then(({ code, data, msg, count }) => {
          if (code === 0) {
            data.forEach(row => {
              that.gudonList.push({
                id: row.id,
                title: item.title,
                username: row.username,
                phone: row.phone,
                create_time: row.create_time,
                ceo: row.ceo
              })
            })
            this.gudonList = data
          } else {
            this.$message.error(msg)
          }
        })
        .catch(() => {})
    },
    // 删除股东
    deleteGudon(item) {
      gudonDel(item.id)
        .then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('删除成功')
          } else {
            this.$message.error(msg || '删除失败')
          }
        })
        .catch(() => {})
    },
    // 股东创建表单
    gudonCreate() {
      this.showGudonFormDialog = true
      this.gudonForm = { id: null, company_id: this.formLabelAlign.id }
    },
    gudonEdit(item) {
      this.showGudonFormDialog = true
      this.gudonForm = item
    }
  }
}
</script>

<style>
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
