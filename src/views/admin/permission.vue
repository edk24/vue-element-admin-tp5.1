<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="mini" @click="openDialogAdd()">
        <span> <i class="el-icon-plus" />新增 </span>
      </el-button>
    </el-row>

    <el-table row-key="id" :data="data" :tree-props="{ children: 'child' }">
      <el-table-column prop="title" label="菜单名称" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <svg aria-hidden="true" class="svg-icon" width="24" height="24"><use :xlink:href="'#icon-'+scope.row.icon"></use></svg>
        </template>
      </el-table-column>
      <el-table-column prop="flag" label="权限标识" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="route_path" label="路径" />
      <el-table-column label="是否可见">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.show === 1" type="success">显示</el-tag>
          <el-tag v-else-if="scope.row.show === 0">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialogUpdate(scope.row)">
            <span> <i class="el-icon-edit" />修改 </span>
          </el-button>
          <el-popconfirm title="确定删除吗?" @onConfirm="deleteMenu(scope.row)">
            <el-button slot="reference" type="text">
              <span> <i class="el-icon-delete" />删除 </span>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="centerDialogVisible" width="400px" center>
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="上级菜单">
          <el-select v-model="formData.pid" placeholder="请选择">
            <el-option label="顶级" :value="0" />
            <el-option
              v-for="item in data"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="formData.sort" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-select
            class="el-select"
            filterable
            v-model="formData.icon"
            placeholder="请选择"
          >
            <el-option
              v-for="item in iconList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">
                <svg aria-hidden="true" class="svg-icon" width="16" height="16"><use :xlink:href="'#icon-'+item.value"></use></svg>
                {{item.label}}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路由名称" prop="route_name">
          <el-input v-model="formData.route_name" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component_path">
          <el-input v-model="formData.component_path" />
        </el-form-item>
        <el-form-item label="外链打开" prop="target">
          <el-radio v-model="formData.target" :label="0">否</el-radio>
          <el-radio v-model="formData.target" :label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="路由地址" prop="route_path">
          <el-input v-model="formData.route_path" />
        </el-form-item>
        <el-form-item label="显示状态" prop="show">
          <el-radio v-model="formData.show" :label="0">隐藏</el-radio>
          <el-radio v-model="formData.show" :label="1">显示</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get_menu_tree, create_menu, update_menu, del_menu } from '@/api/menu'
export default {
  data() {
    return {
      data: [],
      props: {
        label: 'name_cn'
      },
      formData: {
        id: null,
        route_name: '',
        icon: '',
        component_path: '',
        route_path: '',
        pid: 0,
        title: '',
        sort: 1,
        show: 1,
        target: 0
      },
      rules: {
        title: [{ required: true, trigger: 'change', message: '必须输入标题' }]
      },

      // el-option
      all_permission: [],
      centerDialogVisible: false,

      // icon
      iconList: [
        { value: 'add-account', label: 'add-account' },
        { value: 'add-cart', label: 'add-cart' },
        { value: 'ali-clould', label: 'ali-clould' },
        { value: 'all', label: 'all' },
        { value: 'assessed-badge', label: 'assessed-badge' },
        { value: 'aviation', label: 'aviation' },
        { value: 'banzhengfuwu', label: 'banzhengfuwu' },
        { value: 'bussiness-man', label: 'bussiness-man' },
        { value: 'calculator', label: 'calculator' },
        { value: 'cart-full', label: 'cart-full' },
        { value: 'comments', label: 'comments' },
        { value: 'component', label: 'component' },
        { value: 'conditions', label: 'conditions' },
        { value: 'connections', label: 'connections' },
        { value: 'consumption', label: 'consumption' },
        { value: 'coupons', label: 'coupons' },
        { value: 'credit-level', label: 'credit-level' },
        { value: 'CurrencyConverter', label: 'CurrencyConverter' },
        { value: 'customization', label: 'customization' },
        { value: 'daibancaishui', label: 'daibancaishui' },
        { value: 'data_1', label: 'data_1' },
        { value: 'data', label: 'data' },
        { value: 'earth', label: 'earth' },
        { value: 'electronics', label: 'electronics' },
        { value: 'email', label: 'email' },
        { value: 'Exportservices', label: 'Exportservices' },
        { value: 'gift', label: 'gift' },
        { value: 'hardware', label: 'hardware' },
        { value: 'home', label: 'home' },
        { value: 'hot', label: 'hot' },
        { value: 'index.js', label: 'index.js' },
        { value: 'inspection', label: 'inspection' },
        { value: 'insurance', label: 'insurance' },
        { value: 'integral', label: 'integral' },
        { value: 'jiaobiao', label: 'jiaobiao' },
        { value: 'kuaidiwuliu', label: 'kuaidiwuliu' },
        { value: 'leftbutton', label: 'leftbutton' },
        { value: 'link', label: 'link' },
        { value: 'Moneymanagement', label: 'Moneymanagement' },
        { value: 'namecard', label: 'namecard' },
        { value: 'nightmode', label: 'nightmode' },
        { value: 'online-tracking', label: 'online-tracking' },
        { value: 'packaging', label: 'packaging' },
        { value: 'quanyipeizhi', label: 'quanyipeizhi' },
        { value: 'rmb', label: 'rmb' },
        { value: 'robot', label: 'robot' },
        { value: 'salescenter', label: 'salescenter' },
        { value: 'set', label: 'set' },
        { value: 'similar-product', label: 'similar-product' },
        { value: 'store', label: 'store' },
        { value: 'success', label: 'success' },
        { value: 'tongguanshuju', label: 'tongguanshuju' },
        { value: 'tool-hardware', label: 'tool-hardware' },
        { value: 'tuishui', label: 'tuishui' },
        { value: 'unlock', label: 'unlock' },
        { value: 'video', label: 'video' },
        { value: 'viewgallery', label: 'viewgallery' },
        { value: 'viewlist', label: 'viewlist' },
        { value: 'wuliuchanpin', label: 'wuliuchanpin' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 抓取数据
    fetchData() {
      // get all
      get_menu_tree().then(({ code, msg, data }) => {
        this.data = data
      })
    },
    // 删除
    deleteMenu(item) {
      del_menu(item.id)
        .then(({ code, msg, data, count }) => {
          if (code === 0) {
            this.$message.success('删除成功')
            this.fetchData()
          } else {
            this.$message.error(msg || '删除失败')
          }
        })
        .catch(() => {})
    },
    // 修改
    openDialogUpdate(data) {
      this.centerDialogVisible = true
      this.formData = Object.assign({}, this.formData, data)
    },
    // 打开新增表单
    openDialogAdd() {
      this.centerDialogVisible = true
      this.formData = Object.assign(
        {},
        {
          pid: 0,
          show: 1,
          tatget: 0,
          id: null,
          title: ''
        }
      )
    },
    // 提交
    submit() {
      // TODO: 验证

      this.centerDialogVisible = false
      if (this.formData.id === null) {
        // add
        delete this.formData.id
        create_menu(this.formData)
          .then(({ msg, code }) => {
            if (code === 0) {
              this.$message.success('添加成功')
              this.fetchData()
            } else {
              this.$message.error(msg || '添加失败')
            }
          })
          .catch(() => {
            this.$message.error('系统异常')
          })
      } else {
        // update
        update_menu(this.formData.id, this.formData)
          .then(({ msg, code }) => {
            if (code === 0) {
              this.$message.success('修改成功')
              this.fetchData()
            } else {
              this.$message.error(msg || '修改失败')
            }
          })
          .catch(() => {
            this.$message.error('系统异常')
          })
      }
    }
  }
}
</script>

<style lang="scss">
.block {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.el-select {
  display: flex;

  el-option {
    flex: 1;
  }
}
</style>
