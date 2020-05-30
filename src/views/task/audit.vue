<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in type" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        搜索-->
<!--      </el-button>-->
      <!--      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">-->
      <!--        添加-->
      <!--      </el-button>-->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column type="index" label="序号" sortable="custom" align="center" width="80">
      </el-table-column>
      <el-table-column label="项目标题" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="后端语言" align="center">
        <template slot-scope="{row}">
          <span>{{ row.admin_lang }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端语言" align="center">
        <template slot-scope="{row}">
          <span>{{ row.show_lang }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格区间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.min_price }}~{{ row.max_price }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="价格区间低" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.min_price }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="价格区间高" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.max_price }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="是否价格可议" align="center">
        <template slot-scope="{row}">
          <span v-if="row.price_change === 0">否</span>
          <span v-if="row.price_change === 1">可议</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="开发终端" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.terminal }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{row}">
          <span v-if="row.hide_contacts === 1">隐藏</span>
          <span v-else>显示</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="备注" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.note }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="附件地址" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.enclosure }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="审核状态" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span v-if="row.audit === 0">待审核</span>-->
<!--          <span v-if="row.audit === 1">审核成功</span>-->
<!--          <span v-if="row.audit === 2">审核失败</span>-->

<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column v-if="listQuery.type === 2" label="驳回原因" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.error_content }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="创建时间" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.create_time }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="修改时间" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.update_time }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" fixed="right" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
<!--            编辑-->
<!--          </el-button>-->
<!--          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">-->
<!--            删除-->
<!--          </el-button>-->
          <el-button size="mini" type="primary" plain @click="handleStatus(row,1)">
            查看
          </el-button>
          <el-button size="mini" v-if="listQuery.type === 0" type="success" @click="handleStatus(row,2)">
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
    <!-- 弹窗页面   -->
    <el-dialog :destroy-on-close="true" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5%" width="35%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="margin:0 25px">
        <el-form-item label="项目标题" width="100px;" >
          <el-input v-model="temp.title" readonly=""/>
        </el-form-item>
        <el-form-item label="项目类型" width="100px;">
          <el-input v-model="temp.type" readonly=""/>
        </el-form-item>
        <el-form-item label="后端语言" width="100px;" >
          <el-input v-model="temp.admin_lang" readonly=""/>
        </el-form-item>
        <el-form-item label="前端语言" width="100px;">
          <el-input v-model="temp.show_lang" readonly=""/>
        </el-form-item>
        <el-form-item label="价格区间" width="100px;">
          <el-input :value="this.price_s()" readonly=""/>
        </el-form-item>
        <el-form-item label="是否价格可议" width="100px;">
          <el-input v-if="temp.price_change === 0" value="否" readonly=""/>
          <el-input v-else value="是" readonly=""/>
        </el-form-item>
        <el-form-item label="开发终端" width="100px;">
          <el-input v-model="temp.terminal" readonly=""/>
        </el-form-item>
        <el-form-item label="联系方式" width="100px;">
          <el-input v-if="temp.hide_contacts === 1" value="隐藏" readonly=""/>
          <el-input v-else value="显示" readonly=""/>
        </el-form-item>
        <el-form-item label="备注" width="100px;">
          <el-input type="textarea" autosize v-model="temp.note"/>
<!--          <el-input v-model="temp.note" readonly=""/>-->
        </el-form-item>
        <el-form-item label="附件地址" width="100px;">
          <el-input v-model="temp.enclosure" readonly=""/>
        </el-form-item>
        <el-radio v-if="this.dialogStatus !== 'look'" v-model="radio" label="1" value="1" @change="sta(1)">审核成功</el-radio>
        <el-radio v-if="this.dialogStatus !== 'look'" v-model="radio" label="2" value="2" @change="sta(2)">审核失败</el-radio>
        <el-form-item label="驳回理由" width="100px;" :style="style">
<!--          <el-input v-if="listQuery.type === 2" type="textarea" autosize placeholder="请输入驳回理由" v-model="temp.error_content"/>-->
          <el-input type="textarea" autosize v-model="temp.error_content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="this.dialogStatus !== 'look'" type="primary" @click="dialogStatus==='status'?statusData():createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { task_audit, task_audit_do } from '@/api/task'
  const type = [
    { key: 0, display_name: '待审核' },
    { key: 1, display_name: '审核成功' },
    { key: 2, display_name: '审核失败' }
  ]
  export default {
    data() {
      return {
        radio: '1',
        style: {
          'margin-top': '20px',
          display: 'none'
        },
        tableKey: 0,
        type,
        list: null,
        dialogStatus: '',
        dialogFormVisible: false,
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        temp: {

        },
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          // 默认为待审核
          type: 0
        },
        textMap: {
          update: 'Edit',
          status: '审核',
          look: '查看信息'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        var dd =  { type: this.listQuery.type, page: this.listQuery.page, limit: this.listQuery.limit }
        task_audit(dd).then(({ code, msg, data, count }) => {
          // console.log('data:' + data)
          this.list = data
        }).catch(error => {
          console.log(error)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
        this.error_content_status()
      },
      handleStatus(row, status) {
        this.temp = Object.assign({}, row)
        this.dialogFormVisible = true
        if (status === 2) {
          this.dialogStatus = 'status'
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.dialogStatus = 'look'
        }
      },
      statusData() {
        const tempData = Object.assign({}, this.temp)
        const data = new FormData()
        data.append('id', tempData.id)
        if (this.radio === '1') {
          data.append('type', this.radio)
        } else {
          data.append('type', this.radio)
          if (!tempData.error_content) {
            return this.$message.error('驳回理由为空！')
          }
          data.append('error_content', tempData.error_content)
        }
        task_audit_do(data).then(response => {
          this.$message.success(response.msg || '操作成功')
          this.dialogFormVisible = false
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      },
    //  驳回理由的显示
      error_content_status() {
        if (this.listQuery.type === 2) {
          this.style.display = 'block'
        } else {
          this.style.display = 'none'
        }
      },
    //  价格区间
      price_s() {
        var price = this.temp.min_price + '~' + this.temp.max_price
        return price
      },
    //  是否显示驳回理由
      sta(s) {
        if (s === 1) {
          this.style.display = 'none'
        } else {
          this.style.display = 'block'
        }
      }
    }
  }
</script>

<style scoped>
</style>
