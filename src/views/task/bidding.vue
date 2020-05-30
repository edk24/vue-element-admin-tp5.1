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
          <span>{{ row.min_price }}~~{{ row.max_price }}</span>
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
      <el-table-column label="开发终端" align="center">
        <template slot-scope="{row}">
          <span>{{ row.terminal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏联系方式" align="center">
        <template slot-scope="{row}">
          <span v-if="row.hide_contacts === 1">隐藏</span>
          <span v-else>显示</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.enclosure }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="{row}">
          <span v-if="row.audit === 0">待审核</span>
          <span v-if="row.audit === 1">审核成功</span>
          <span v-if="row.audit === 2">审核失败</span>

        </template>
      </el-table-column>
      <el-table-column label="驳回原因" align="center">
        <template slot-scope="{row}">
          <span>{{ row.error_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="{row,$index}">-->
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
<!--            编辑-->
<!--          </el-button>-->
<!--          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">-->
<!--            删除-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  import { task_bidding } from '@/api/task'
  const type = [
    { key: 0, display_name: '结束竞标' },
    { key: 1, display_name: '竞标中' }
  ]
  export default {
    data() {
      return {
        tableKey: 0,
        type,
        list: null,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          // 默认为竞标中
          type: 1
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        var dd =  { type: this.listQuery.type, page: this.listQuery.page, limit: this.listQuery.limit }
        task_bidding(dd).then(({ code, msg, data, count }) => {
          this.list = data
          console.log(data)
        }).catch(error => {
          console.log(error)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
