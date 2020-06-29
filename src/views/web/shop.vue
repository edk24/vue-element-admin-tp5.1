<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="-1">
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="phone" label="联系电话" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="content" label="留言内容" align="center" />
            <el-table-column prop="audit_title" label="回访状态" align="center" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.audit === 0">
                  <el-popconfirm title="确定已回访吗？" @onConfirm="data_update(scope.row)">
                    <el-button slot="reference" size="small" type="primary">回访</el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未回访" name="0">
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="phone" label="联系电话" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="content" label="留言内容" align="center" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div>
                  <el-popconfirm title="确定已回访吗？" @onConfirm="data_update(scope.row)">
                    <el-button size="small" type="primary">回访</el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已回访" name="1">
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="phone" label="联系电话" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="content" label="留言内容" align="center" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div>
                  <el-popconfirm title="确定已回访吗？" @onConfirm="data_update(scope.row)">
                    <el-button size="small" type="primary">回访</el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { shop_audit, shop_list } from '@/api/web'

    export default {
        data() {
          return {
            data: [],
            page: 1,
            limit: 10,
            count: 0,
            activeName: '-1'
          }
        },
      created() {
          this.get_list()
      },
      methods: {
          // 获取数据
        get_list(page) {
            if (page) {
              if (page <= 1) {
                page = 1
              }
            }
            this.page = page
            shop_list(this.page, this.limit, this.activeName).then(res => {
              this.data = res.data
              this.count = res.count
            })
          },
        // 分页改变事件
        page_change(data) {
          this.get_list(data)
        },
        // 回访
        data_update(data) {
          shop_audit(data.id).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.get_list()
            } else {
              this.$message.error(res.data)
            }
          })
        },
        // 选项卡改变
        handleClick() {
          this.get_list(1)
        }
      }
    }
</script>

