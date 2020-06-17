<template>
  <div class="app-container">
    <!-- header -->
    <p>
      <el-row>
        <el-input v-model="keyword" placeholder="请输入关键词" style="width:260px" />
        <el-button type="primary" @click="fetchData(true)">搜索</el-button>
      </el-row>
    </p>

    <!-- table -->
    <el-table :data="list" stripe>
      <el-table-column prop="order_sn" label="订单编号" width="180" />
      <el-table-column>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'goods'">产品订单</span>
          <span v-else-if="scope.row.type === 'jifen'">积分订单</span>
          <span v-if="scope.row.type === 'train'">培训课程</span>
        </template>
      </el-table-column>
      <el-table-column prop="unickname" label="用户名" width="180" />
      <el-table-column label="金额">
        <template slot-scope="scope">
          <b v-if="scope.row.type === 'jifen'" style="color:red">
            {{ scope.row.total_jifen }}积分
            <small>运费:{{ scope.row.express_amount }}</small>
          </b>
          <b v-else style="color:red">
            ¥
            <del v-if="scope.row.discount_amount>0">{{ scope.row.total_amount }}</del>
            {{ scope.row.order_amount }}
            <small>运费:{{ scope.row.express_amount }}</small>
          </b>
        </template>
      </el-table-column>
      <el-table-column label="支付时间">
        <template slot-scope="scope">
          <span v-if="scope.row.paid_status===1">{{ scope.row.paid_time }}</span>
          <span v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.order_status===0">-</span>
          <span v-else-if="scope.row.order_status === 1">待发货</span>
          <span v-else-if="scope.row.order_status === 2">已发货</span>
          <span v-else-if="scope.row.order_status === 3">已收货</span>
          <span v-else-if="scope.row.order_status === 4">已评价</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <p>{{ scope.row.consignee }} {{ scope.row.phone }}</p>
          <p>{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }} {{ scope.row.address }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="留言" />
      <el-table-column label="配送方式">
        <template slot-scope="scope">
          <div v-if="scope.row.order_status>1">
            <div v-if="scope.row.delivery_method === 'express'">
              <p>快递</p>
              <p>承运公司: {{ scope.row.express_com }}</p>
              <p>运单编号: {{ scope.row.express_sn }}</p>
            </div>
            <div v-else-if="scope.row.delivery_method === 'home_pickup'">上门自提</div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间" />
      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="edit(scope.row)">查看订单</el-button>
          <el-button v-if="scope.row.order_status === 1" size="small" type="primary">发货</el-button>
          <el-popconfirm title="确定删除吗?" @onConfirm="del(scope.row)">
            <el-button
              slot="reference"
              size="small"
              type="danger"
              @click="deleteOrder(scope.row)"
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <p>
      <el-pagination background layout="prev, pager, next" :total="count" :page-size="limit" />
    </p>

    <!-- 发货 -->
    <el-dialog :visible.sync="showShipState" title="发货">
      <el-form label-width="100%">
        <el-form-item label="配送方式">
          <el-radio v-model="shipForm.delivery_method" label="express">快递配送</el-radio>
          <el-radio v-model="shipForm.delivery_method" label="home_pickup">上门自提</el-radio>
        </el-form-item>
        <div v-if="shipForm.delivery_method==='express'">
          <el-form-item label="配送公司">
            <el-select v-model="shipForm.express_com" filterable placeholder="请选择配送公司">
              <el-option
                v-for="item in expressList"
                :key="item.code"
                :label="item.title"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input v-model="shipForm.express_sn" placeholder="请输入快递单号" />
          </el-form-item>
        </div>
        <div v-if="shipForm.delivery_method==='home_pickup'" />
      </el-form>

      <span slot="footer" class="fialog-footer">
        <el-button @click="showShipState=false">取 消</el-button>
        <el-button type="primary" @click="submitShip">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, delOrder, shipOrder } from '@/api/order'
import { getAllExpressCompany } from '@/api/express'
export default {
  date() {
    return {
      list: [
        {
          delivery_method:''
        }
      ],
      count: 0,
      page: 0,
      limit: 25,
      status: 'all',
      keyword:'',

      // 窗口显示
      showOrderState: false,
      showShipState: false,

      // form
      // 发货表单
      shipForm: {
        id: null,
        delivery_method: 'express',
        express_com: '',
        express_sn: ''
      },

      // express
      expressList: []
    }
  },
  created() {
    this.fetchData(true)
    // 查询所有快递公司
    this.getAllExpressCompany()
      .then(({ code, data, count, msg }) => {
        this.expressList = data
      })
      .catch(() => {})
  },
  methods: {
    // 抓取订单记录
    fetchData(clear = false) {
      if (clear) {
        this.list = []
        this.count = 0
        this.page = 1
        this.limit = 0
        this.status = 'all'
      }
      getOrderList(
        this.page,
        this.limit,
        this.keyword,
        ['jifen', 'goods'],
        this.status
      )
        .then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.list = data
            this.page++
            this.count = count
          } else {
            this.$message.error(msg || '未查询到数据')
          }
        })
        .catch(() => {})
    },
    // 打开订单查看窗口
    showOrder(item) {
      this.showOrderState = true
    },
    // 打开发货窗口
    showShip(item) {
      this.showShipState = true
      this.shipForm = {
        id: item.id,
        express_sn: '',
        express_com: '',
        delivery_method: 'express'
      }
    },
    // 发货提交
    submitShip() {
      if (this.shipOrder.id) {
        shipOrder(shipForm.id, shipForm)
          .then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success('发货成功')
              if (this.page > 1) {
                this.page--
              }
              this.fetchData()
            } else {
              this.$message.error(msg)
            }
          })
          .catch(() => {})
      }

      this.showShipState = false
    },
    // 订单删除
    deleteOrder(item) {
      delOrder(item.id)
        .then(({ code, msg, count, data }) => {
          if (code === 0) {
            this.$$message.success('删除成功')
            if (this.page > 1) {
              this.page--
            }
            this.fetchData()
          } else {
            this.$message.error(msg || '删除失败')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>
