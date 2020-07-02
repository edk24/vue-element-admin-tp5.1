<template>
  <div class="app-container">
    <el-row>
      <el-input v-model="keyword" placeholder="请输入关键词" style="width:260px" />
      <el-select v-model="type" placeholder="请选择" @change="fetchData(true)">
        <el-option
          v-for="item in userTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-button type="primary" @click="fetchData(true)">搜索</el-button>

    </el-row>

    <p />
    <p />
    <!-- <el-tabs v-model="status" @tab-click="fetchData(true)">
    <el-tab-pane label="家长" name="all"></el-tab-pane>
    <el-tab-pane label="学生" name="waitpay"></el-tab-pane>
    <el-tab-pane label="学校" name="waitdelivery"></el-tab-pane>
    <el-tab-pane label="培训机构" name="shipped"></el-tab-pane>
    <el-tab-pane label="合伙人" name="recived"></el-tab-pane>
    <el-tab-pane label="股东" name="recived"></el-tab-pane>
    <el-tab-pane label="未知" name="recived"></el-tab-pane>
    </el-tabs>-->

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
      <el-table-column prop="realname" label="真实姓名" />
      <el-table-column prop="money" label="余额" />
      <el-table-column prop="jifen" label="积分" />
      <el-table-column label="实名状态">
        <template slot-scope="scope">
          <span v-if="scope.row.audit===3">通过</span>
          <span v-else-if="scope.row.audit===1">申请中</span>
          <span v-else-if="scope.row.audit===2">驳回</span>
          <span v-else>未审核</span>
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
            <el-button v-if="scope.row.type === 0" size="mini" type="primary" @click="handleChildren(scope.row)">查看孩子
            </el-button>
            <el-button v-else-if="scope.row.type === 6" size="mini" type="primary" @click="handleSchool(scope.row)">
              学校信息
            </el-button>
            <el-popconfirm v-else-if="scope.row.type === 4 && scope.row.is_poverty === 0" title="确认设置贫困学生吗?" @onConfirm="handlePoverty(scope.row)">
              <el-button slot="reference" size="mini" type="primary">设置贫困学生</el-button>
            </el-popconfirm>
            <el-button v-else-if="scope.row.type === 4 && scope.row.is_poverty != 0" size="mini" type="warning">
              贫困学生
            </el-button>
            <el-button
              v-else-if="scope.row.type === 1 || scope.row.type === 3"
              size="mini"
              type="primary"
              @click="showCompanyDialog(scope.row)"
            >公司信息
            </el-button>
            <el-button v-else-if="scope.row.type === 2" size="mini" type="primary" @click="showTrainDialog(scope.row)">
              机构信息
            </el-button>
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

    <!-- 公司信息 -->
    <el-dialog
      title="公司信息"
      :visible.sync="visibleCompanyDialog"
      width="600px"
      center
    >
      <span v-if="companyInfo === null">公司信息暂未完善</span>
      <el-form label-width="100px">
        <el-form-item label="公司名称">{{ companyInfo.name }}</el-form-item>
        <el-form-item label="统一社会代码">{{ companyInfo.code }}</el-form-item>
        <el-form-item label="法人姓名">{{ companyInfo.username }}</el-form-item>
        <el-form-item label="法人手机">{{ companyInfo.phone }}</el-form-item>
        <el-form-item label="地址">{{ companyInfo.province }} {{ companyInfo.city }} {{ companyInfo.area }} {{
          companyInfo.address }}
        </el-form-item>
        <el-form-item label="产品出售提成">{{ companyInfo.commission }}%</el-form-item>
        <el-form-item label="营业执照">
          <el-image :src="companyInfo.license" :fit="'scale-down'" />
        </el-form-item>
      </el-form>

      <h3>成员:</h3>
      <el-table style="width:100%" :data="companyInfo.members">
        <el-table-column label="姓名" prop="user" />
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.ceo === 1">大股东</span>
            <span v-else>股东</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="phone" />
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visibleCompanyDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 机构信息 -->
    <el-dialog
      title="机构信息"
      :visible.sync="visibleTrainDialog"
      width="600px"
      center
    >

      <el-form label-width="100px">
        <el-form-item label="机构名称">{{ trainInfo.name }}</el-form-item>
        <el-form-item label="机构描述">{{ trainInfo.desc }}</el-form-item>
        <el-form-item label="法人姓名">{{ trainInfo.contact }}</el-form-item>
        <el-form-item label="法人手机">{{ trainInfo.phone }}</el-form-item>
        <el-form-item label="地址">{{ trainInfo.province }} {{ trainInfo.city }} {{ trainInfo.area }} {{ trainInfo.address
        }}
        </el-form-item>
        <!-- <el-form-item label="推广员返点">{{companyInfo.commission}}%</el-form-item> -->
        <!-- <el-form-item label="营业执照">
      <el-image :src="companyInfo.license" :fit="'scale-down'"></el-image>
    </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visibleTrainDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--  孩子信息  -->
    <el-dialog
      title="孩子信息"
      :visible.sync="visibleKidDialog"
      width="600px"
      center
    >
      <span v-if="user_kid.length === 0" style="width: 100%; text-align: center;display:inline-block;">孩子信息暂未绑定</span>
      <el-form
        v-for="(item, index) in user_kid"
        :key="index"
        style="margin-top: 10px;border-bottom: 1px solid #000000"
        label-width="100px"
        :value="index"
      >
        <el-form-item label="姓名">{{ item.nickname }}</el-form-item>
        <el-form-item label="手机号码">{{ item.phone }}</el-form-item>
        <el-form-item label="生日">{{ item.birthday }}</el-form-item>
        <el-form-item label="详细地址">{{ item.address }}</el-form-item>
        <el-form-item label="学校">
          <span v-if="item.school != null">{{ item.school.title }}</span>
          <span v-if="item.school === null">暂未绑定学校</span>
        </el-form-item>
        <el-form-item label="班级">{{ item.class }}</el-form-item>
        <el-form-item label="性别">
          <span v-if="item.sex === 0">女</span>
          <span v-if="item.sex === 1">男</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visibleKidDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--     学校信息-->
    <el-dialog
      title="学校信息"
      :visible.sync="visibleSchoolDialog"
      width="600px"
      center
    >
      <span v-if="school_list.length === 0" style="width: 100%; text-align: center;display:inline-block;">学校信息暂未绑定</span>
      <el-form
        v-if="school_list.length != 0"
        style="margin-top: 10px;border-bottom: 1px solid #000000"
        label-width="100px"
      >
        <el-form-item label="学校名称">{{ school_list.title }}</el-form-item>
        <el-form-item label="学校联系方式">{{ school_list.phone }}</el-form-item>
        <el-form-item label="省">{{ school_list.province }}</el-form-item>
        <el-form-item label="市">{{ school_list.city }}</el-form-item>
        <el-form-item label="区">{{ school_list.area }}</el-form-item>
        <el-form-item label="详细地址">{{ school_list.address }}</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visibleSchoolDialog = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { user_list, user_del, user_kid, user_school, set_poverty } from '@/api/user'
  import { getList as company_gudon_list } from '@/api/company_gudon'
  import { get_company_info_by_uid } from '@/api/company'
  import { get_info_by_uid } from '@/api/train'

  export default {
    data() {
      return {
        school_list: [],
        user_kid: [],
        userList: [],
        count: 0,
        page: 0,
        limit: 25,
        keyword: '',
        type: -1,

        userTypes: [
          { value: -1, label: '全部' },
          { value: 0, label: '家长' },
          { value: 1, label: '子公司' },
          { value: 2, label: '培训机构' },
          { value: 3, label: '股东' },
          { value: 4, label: '学生' },
          { value: 6, label: '学校' },
          { value: 5, label: '未知' }
        ],
        // 学校
        visibleSchoolDialog: false,
        // 孩子
        visibleKidDialog: false,
        // 显示公司信息对话框
        visibleCompanyDialog: false,
        // 公司信息
        companyInfo: {
          title: '',
          code: 0,
          license: '',
          username: '',
          phone: '',
          province: '',
          city: '',
          area: '',
          address: '',
          commission: '',
          members: [] // 成员列表
        },

        // 显示培训机构
        visibleTrainDialog: false,
        // 机构信息
        trainInfo: {
          name: '',
          license: '',
          desc: '',
          image: '',
          province: '',
          city: '',
          area: '',
          address: '',
          contact: '',
          phone: '',
          rebate: 0
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
      handleChildren(row) {
        this.visibleKidDialog = true
        this.getKidList(row.id)
      },
      handleSchool(row) {
        this.visibleSchoolDialog = true
        this.getSchoolList(row.school)
      },
      // 刷新数据
      refreshData() {
        if (this.page <= 0) {
          this.page = 1
        }
        this.userList = []
        user_list(this.page, this.limit, this.keyword, this.type).then(
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
      // 设置贫困学生
      handlePoverty(row) {
        set_poverty(row.id).then(res => {
          this.$message.success('设置成功')
          this.refreshData()
        }).catch(e => {
          console.log(e)
        })
      },
      // 获取学校
      getSchoolList(id) {
        user_school(id).then(res => {
          if (res.code === 0) {
            this.school_list = res.data
          }
        }).catch(e => {
          console.log(e)
        })
      },
      // 获取孩子信息
      getKidList(id) {
        user_kid(id).then(res => {
          // console.log(res)
          this.user_kid = res.data.kid
          console.log(this.user_kid)
        }).catch(e => {
          console.log(e)
        })
      },
      // 显示公司信息对话框
      showCompanyDialog(row) {
        get_company_info_by_uid(row.id).then(({ data, code, msg, count }) => {
          if (code === 0) {
            this.companyInfo = data
            this.visibleCompanyDialog = true
          } else {
            this.$$message.error('查询失败')
          }
        }).catch(() => {
        })
      },
      // 显示机构信息对话框
      showTrainDialog(row) {
        get_info_by_uid(row.id).then(({ code, data, msg, count }) => {
          if (code === 0) {
            this.trainInfo = data
            this.visibleTrainDialog = true
          } else {
            this.$message.error(msg || '查询失败')
          }
        }).catch(() => {
        })
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
            .catch(() => {
            })
      }
    }
  }
</script>
