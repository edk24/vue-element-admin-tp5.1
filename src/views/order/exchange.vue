<template>
  <div class="app-container">
    <el-row>
      <el-input v-model="key" placeholder="请输入关键词" style="width:260px" />
      <el-button type="primary" @click="fetchData(true)">搜索</el-button>
    </el-row>

    <p></p>
    <p></p>
    <el-tabs v-model="status" @tab-click="fetchData(true)">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="待支付" name="waitpay"></el-tab-pane>
      <el-tab-pane label="待发货" name="waitdelivery"></el-tab-pane>
      <el-tab-pane label="已发货" name="shipped"></el-tab-pane>
      <el-tab-pane label="已收货" name="recived"></el-tab-pane>
      <!-- <el-tab-pane label="已评价" name="comment"></el-tab-pane> -->
    </el-tabs>

    <!-- table -->
    <el-table :data="list" stripe>
      <el-table-column prop="order_sn" label="订单编号" width="140px" />
      <el-table-column label="类型" width="100px">
        <template slot-scope="scope" >
          <span v-if="scope.row.type === 'goods'">产品订单</span>
          <span v-else-if="scope.row.type === 'jifen'">积分订单</span>
          <span v-else-if="scope.row.type === 'train'">培训课程</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="130px">
        <template slot-scope="scope">{{ scope.row.userinfo?scope.row.userinfo.nickname:'' }}</template>
      </el-table-column>
      <el-table-column label="金额" width="100px">
        <template slot-scope="scope">
          <b v-if="scope.row.type === 'jifen'" style="color:red">
            {{ scope.row.total_jifen }}积分
            <p>
              <small>运费:{{ scope.row.express_amount }}</small>
            </p>
          </b>
          <b v-else style="color:red">
            ¥
            <del v-if="scope.row.discount_amount>0">{{ scope.row.total_amount }}</del>
            {{ scope.row.order_amount }}
            <p>
              <small>运费:{{ scope.row.express_amount }}</small>
            </p>
          </b>
        </template>
      </el-table-column>
      <!-- <el-table-column label="支付时间">
        <template slot-scope="scope">
          <span v-if="scope.row.paid_status===1">{{ scope.row.paid_time }}</span>
          <span v-else>未支付</span>
        </template>
      </el-table-column> -->
      <el-table-column label="订单状态" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.order_status===0">等待买家付款</span>
          <span v-else-if="scope.row.order_status === 1">待发货</span>
          <span v-else-if="scope.row.order_status === 2">已发货</span>
          <span v-else-if="scope.row.order_status === 3">已收货</span>
          <span v-else-if="scope.row.order_status === 4">已评价</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人">
        <template slot-scope="scope">
          <p>{{ scope.row.consignee }}</p>
          <p>{{ scope.row.phone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
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
      <el-table-column label="下单时间" >
        <template slot-scope="scope">
          {{scope.row.create_time}}
        </template>
      </el-table-column>
      <el-table-column label="管理" width="200px">
        <template slot-scope="scope">
          <el-button-group>
          <el-button size="mini" type="primary" @click="showOrder(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.order_status === 1"
            size="mini"
            type="primary"
            @click="showShip(scope.row)"
          >发货</el-button>
          <el-popconfirm title="确定删除吗?" @onConfirm="deleteOrder(scope.row)">
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

    <!-- 发货 -->
    <el-dialog :visible.sync="showShipState" title="发货">
      <el-form label-width="100px">
        <el-form-item label="配送方式">
          <el-radio-group v-model="shipForm.delivery_method">
            <el-radio label="express">快递配送</el-radio>
            <el-radio label="home_pickup">上门自提</el-radio>
          </el-radio-group>
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

    <!-- 查看订单 -->
    <el-dialog title="订单详情" :visible.sync="showOrderState">
      <div class="order">
        <div class="row">
          <div class="title">订单编号</div>
          <div class="value">{{orderInfo.order_sn}}</div>
          <div class="title">订单类型</div>
          <div class="value">
            <span v-if="orderInfo.type === 'goods'">产品订单</span>
            <span v-else-if="orderInfo.type === 'jifen'">积分订单</span>
            <span v-else-if="orderInfo.type === 'train'">培训课程</span>
          </div>
        </div>
        <div class="row">
          <div class="title">用户名称</div>
          <div class="value"></div>
          <div class="title">下单时间</div>
          <div class="value">{{orderInfo.create_time}}</div>
        </div>
        <div class="row">
          <div class="title">支付状态</div>
          <div class="value">
            <span v-if="orderInfo.paid_status === 0">未支付</span>
            <span v-else-if="orderInfo.paid_status === 1">已支付</span>
          </div>
          <div class="title">支付方式</div>
          <div class="value">
            <span v-if="orderInfo.paid_method==='ali_app'">支付宝</span>
            <span v-else-if="orderInfo.paid_method==='wx_app'">微信</span>
            <span v-else-if="orderInfo.paid_method==='balance'">余额</span>
            <span v-else-if="orderInfo.paid_method==='free'">免费</span>
            <span v-else-if="orderInfo.paid_method==='jifen'">积分兑换</span>
          </div>
        </div>

        <div class="row">
          <div class="title">订单状态</div>
          <div class="value">
            <span v-if="orderInfo.order_status===0">待支付</span>
            <span v-else-if="orderInfo.order_status===1">待发货</span>
            <span v-else-if="orderInfo.order_status===2">已发货</span>
            <span v-else-if="orderInfo.order_status===3">已收货</span>
            <span v-else-if="orderInfo.order_status===4">已评价</span>
          </div>
          <div class="title">配送方式</div>
          <div class="value">
            <span v-if="orderInfo.delivery_method==='express'">快递</span>
            <span v-else-if="orderInfo.delivery_method==='home_pickup'">上门自取</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="row">
          <div class="title">收货地址</div>
          <div class="value">
            {{orderInfo.consignee}} {{orderInfo.phone}}
            <br />
            {{orderInfo.province}} {{orderInfo.city}} {{orderInfo.area}} {{orderInfo.address}}
          </div>
        </div>
        <div class="row">
          <div class="title">买家留言</div>
          <div class="value">{{orderInfo.message||'-'}}</div>
        </div>

        <hr />
        <div class="row">
          <div class="value">
            <el-table :data="orderInfo.goods" style="width: 100%">
              <el-table-column label="图片" width="86">
                <template slot-scope="scope">
                  <el-image style="width:60px; height:60px" :src="url+scope.row.goods_img"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="goods_name" label="产品名称"></el-table-column>

              <el-table-column label="单价" width="120">
                <template slot-scope="scope">
                  <span style="color:red">{{scope.row.goods_price}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="数量" width="120"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="row" v-if="orderInfo.type !== 'jifen'">
          <div class="title">总金额</div>
          <div class="value">
            <b style="color:red">¥{{orderInfo.total_amount}}</b>
          </div>
          <div class="title">优惠金额</div>
          <div class="value">
            <b style="color:red">¥{{orderInfo.discount_amount}}</b>
          </div>
        </div>
        <div class="row" v-if="orderInfo.type !== 'jifen'">
          <div class="title">运费</div>
          <div class="value">
            <b style="color:red">¥{{orderInfo.express_amount}}</b>
          </div>
          <div class="title">已支付</div>
          <div class="value">
            <b style="color:red">¥{{orderInfo.paid_amount}}</b>
          </div>
        </div>
        <div class="row" v-else-if="orderInfo.type === 'jifen'">
          <div class="title">运费</div>
          <div class="value">
            <b style="color:red">¥{{orderInfo.express_amount}}</b>
          </div>
          <div class="title">兑换积分</div>
          <div class="value">
            <b style="color:red">{{orderInfo.total_jifen}}</b>
          </div>
        </div>
      </div>

      <div class="goods" v-for="(item, index) in orderInfo.goods">
        <img :src="item.goods_img" alt />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showOrderState = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, delOrder, shipOrder } from "@/api/order";
import { getAllExpressCompany } from "@/api/express";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      list: [
        {
          delivery_method: ""
        }
      ],
      count: 0,
      page: 1,
      limit: 25,
      status: "all",
      key: "",

      // 窗口显示
      showOrderState: false,
      showShipState: false,

      // form
      // 发货表单
      shipForm: {
        id: null,
        delivery_method: "express",
        express_com: "",
        express_sn: ""
      },
      orderInfo: {},

      // express
      expressList: []
    };
  },
  created() {
    // 查询所有快递公司
    getAllExpressCompany()
      .then(({ code, data, count, msg }) => {
        this.expressList = data;
        this.fetchData(true);
      })
      .catch(() => {});
  },
  methods: {
    // 抓取订单记录
    fetchData(clear = false) {
      if (clear) {
        this.list = [];
        this.count = 0;
        this.page = 1;
      }
      getOrderList(
        this.page,
        this.limit,
        this.key,
        ["jifen"],
        this.status
      )
        .then(({ code, msg, data, count }) => {
          if (code === 0) {
            data.forEach(row => {
              if (row.paid_status === 1) {
                row.paid_time = parseTime(row.paid_time);
              }
              this.list.push(row);
            });
            this.page++;
            this.count = count;
          } else {
            this.$message.error(msg || "未查询到数据");
          }
        })
        .catch(() => {});
    },
    // 打开订单查看窗口
    showOrder(item) {
      this.showOrderState = true;
      this.orderInfo = item;
    },
    // 打开发货窗口
    showShip(item) {
      this.showShipState = true;
      this.shipForm = {
        id: item.id,
        express_sn: "",
        express_com: "",
        delivery_method: "express"
      };
    },
    // 发货提交
    submitShip() {
      if (this.shipForm.id) {
        shipOrder(this.shipForm.id, this.shipForm)
          .then(({ code, msg }) => {
            if (code === 0) {
              this.$message.success("发货成功");
              if (this.page > 1) {
                this.page--;
              }
              this.fetchData();
            } else {
              this.$message.error(msg);
            }
          })
          .catch(() => {});
      }

      this.showShipState = false;
    },
    // 订单删除
    deleteOrder(item) {
      delOrder(item.id)
        .then(({ code, msg, count, data }) => {
          if (code === 0) {
            this.$$message.success("删除成功");
            if (this.page > 1) {
              this.page--;
            }
            this.fetchData();
          } else {
            this.$message.error(msg || "删除失败");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.order {
  width: 100%;
  .row {
    display: flex;
    flex-direction: row;
    line-height: 32px;

    .title {
      width: 90px;
      padding-right: 10px;
      text-align: right;
    }
    .value {
      flex: 1;
    }
  }
}
</style>
