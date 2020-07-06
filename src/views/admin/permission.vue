<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="mini" @click="openDialogAdd()">
        <span>
          <i class="el-icon-plus" />新增
        </span>
      </el-button>
    </el-row>

    <el-table row-key="id" :data="data" :tree-props="{children: 'child'}">
      <el-table-column prop="title" label="菜单名称" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <i style="height:24px; width:24px" :class="'el-icon-'+scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="flag" label="权限标识" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="route_path" label="路径" />
      <el-table-column label="是否可见">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.show===1" type="success">显示</el-tag>
          <el-tag v-else-if="scope.row.show===0">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialogUpdate(scope.row)">
            <span>
              <i class="el-icon-edit" />修改
            </span>
          </el-button>
          <el-popconfirm title="确定删除吗?" @onConfirm="deleteMenu(scope.row)">
            <el-button slot="reference" type="text">
              <span>
                <i class="el-icon-delete" />删除
              </span>
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
            <el-option v-for="item in data" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="formData.sort" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-select class="el-select" filterable v-model="formData.icon" placeholder="请选择">
            <el-option
              v-for="item in iconList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">
                <i :class="'el-icon-'+item.value" />
                {{ item.label }}
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
import {
  get_menu_tree,
  create_menu,
  update_menu,
  del_menu
} from '@/api/menu'
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
        { value: 'delete-solid', label: 'delete-solid' },
        { value: 'delete', label: 'delete' },
        { value: 's-tools', label: 's-tools' },
        { value: 'setting', label: 'setting' },
        { value: 'user-solid', label: 'user-solid' },
        { value: 'user', label: 'user' },
        { value: 'phone', label: 'phone' },
        { value: 'phone-outline', label: 'phone-outline' },
        { value: 'more', label: 'more' },
        { value: 'more-outline', label: 'more-outline' },
        { value: 'star-on', label: 'star-on' },
        { value: 'star-off', label: 'star-off' },
        { value: 's-goods', label: 's-goods' },
        { value: 'goods', label: 'goods' },
        { value: 'warning', label: 'warning' },
        { value: 'warning-outline', label: 'warning-outline' },
        { value: 'question', label: 'question' },
        { value: 'info', label: 'info' },
        { value: 'remove', label: 'remove' },
        { value: 'circle-plus', label: 'circle-plus' },
        { value: 'success', label: 'success' },
        { value: 'error', label: 'error' },
        { value: 'zoom-in', label: 'zoom-in' },
        { value: 'zoom-out', label: 'zoom-out' },
        { value: 'remove-outline', label: 'remove-outline' },
        { value: 'circle-plus-outline', label: 'circle-plus-outline' },
        { value: 'circle-check', label: 'circle-check' },
        { value: 'circle-close', label: 'circle-close' },
        { value: 's-help', label: 's-help' },
        { value: 'help', label: 'help' },
        { value: 'minus', label: 'minus' },
        { value: 'plus', label: 'plus' },
        { value: 'check', label: 'check' },
        { value: 'close', label: 'close' },
        { value: 'picture', label: 'picture' },
        { value: 'picture-outline', label: 'picture-outline' },
        { value: 'picture-outline-round', label: 'picture-outline-round' },
        { value: 'upload', label: 'upload' },
        { value: 'upload2', label: 'upload2' },
        { value: 'download', label: 'download' },
        { value: 'camera-solid', label: 'camera-solid' },
        { value: 'camera', label: 'camera' },
        { value: 'video-camera-solid', label: 'video-camera-solid' },
        { value: 'video-camera', label: 'video-camera' },
        { value: 'message-solid', label: 'message-solid' },
        { value: 'bell', label: 'bell' },
        { value: 's-cooperation', label: 's-cooperation' },
        { value: 's-order', label: 's-order' },
        { value: 's-platform', label: 's-platform' },
        { value: 's-fold', label: 's-fold' },
        { value: 's-unfold', label: 's-unfold' },
        { value: 's-operation', label: 's-operation' },
        { value: 's-promotion', label: 's-promotion' },
        { value: 's-home', label: 's-home' },
        { value: 's-release', label: 's-release' },
        { value: 's-ticket', label: 's-ticket' },
        { value: 's-management', label: 's-management' },
        { value: 's-open', label: 's-open' },
        { value: 's-shop', label: 's-shop' },
        { value: 's-marketing', label: 's-marketing' },
        { value: 's-flag', label: 's-flag' },
        { value: 's-comment', label: 's-comment' },
        { value: 's-finance', label: 's-finance' },
        { value: 's-claim', label: 's-claim' },
        { value: 's-custom', label: 's-custom' },
        { value: 's-opportunity', label: 's-opportunity' },
        { value: 's-data', label: 's-data' },
        { value: 's-check', label: 's-check' },
        { value: 's-grid', label: 's-grid' },
        { value: 'menu', label: 'menu' },
        { value: 'share', label: 'share' },
        { value: 'd-caret', label: 'd-caret' },
        { value: 'caret-left', label: 'caret-left' },
        { value: 'caret-right', label: 'caret-right' },
        { value: 'caret-bottom', label: 'caret-bottom' },
        { value: 'caret-top', label: 'caret-top' },
        { value: 'bottom-left', label: 'bottom-left' },
        { value: 'bottom-right', label: 'bottom-right' },
        { value: 'back', label: 'back' },
        { value: 'right', label: 'right' },
        { value: 'bottom', label: 'bottom' },
        { value: 'top', label: 'top' },
        { value: 'top-left', label: 'top-left' },
        { value: 'top-right', label: 'top-right' },
        { value: 'arrow-left', label: 'arrow-left' },
        { value: 'arrow-right', label: 'arrow-right' },
        { value: 'arrow-down', label: 'arrow-down' },
        { value: 'arrow-up', label: 'arrow-up' },
        { value: 'd-arrow-left', label: 'd-arrow-left' },
        { value: 'd-arrow-right', label: 'd-arrow-right' },
        { value: 'video-pause', label: 'video-pause' },
        { value: 'video-play', label: 'video-play' },
        { value: 'refresh', label: 'refresh' },
        { value: 'refresh-right', label: 'refresh-right' },
        { value: 'refresh-left', label: 'refresh-left' },
        { value: 'finished', label: 'finished' },
        { value: 'sort', label: 'sort' },
        { value: 'sort-up', label: 'sort-up' },
        { value: 'sort-down', label: 'sort-down' },
        { value: 'rank', label: 'rank' },
        { value: 'loading', label: 'loading' },
        { value: 'view', label: 'view' },
        { value: 'c-scale-to-original', label: 'c-scale-to-original' },
        { value: 'date', label: 'date' },
        { value: 'edit', label: 'edit' },
        { value: 'edit-outline', label: 'edit-outline' },
        { value: 'folder', label: 'folder' },
        { value: 'folder-opened', label: 'folder-opened' },
        { value: 'folder-add', label: 'folder-add' },
        { value: 'folder-remove', label: 'folder-remove' },
        { value: 'folder-delete', label: 'folder-delete' },
        { value: 'folder-checked', label: 'folder-checked' },
        { value: 'tickets', label: 'tickets' },
        { value: 'document-remove', label: 'document-remove' },
        { value: 'document-delete', label: 'document-delete' },
        { value: 'document-copy', label: 'document-copy' },
        { value: 'document-checked', label: 'document-checked' },
        { value: 'document', label: 'document' },
        { value: 'document-add', label: 'document-add' },
        { value: 'printer', label: 'printer' },
        { value: 'paperclip', label: 'paperclip' },
        { value: 'takeaway-box', label: 'takeaway-box' },
        { value: 'search', label: 'search' },
        { value: 'monitor', label: 'monitor' },
        { value: 'attract', label: 'attract' },
        { value: 'mobile', label: 'mobile' },
        { value: 'scissors', label: 'scissors' },
        { value: 'umbrella', label: 'umbrella' },
        { value: 'headset', label: 'headset' },
        { value: 'brush', label: 'brush' },
        { value: 'mouse', label: 'mouse' },
        { value: 'coordinate', label: 'coordinate' },
        { value: 'magic-stick', label: 'magic-stick' },
        { value: 'reading', label: 'reading' },
        { value: 'data-line', label: 'data-line' },
        { value: 'data-board', label: 'data-board' },
        { value: 'pie-chart', label: 'pie-chart' },
        { value: 'data-analysis', label: 'data-analysis' },
        { value: 'collection-tag', label: 'collection-tag' },
        { value: 'film', label: 'film' },
        { value: 'suitcase', label: 'suitcase' },
        { value: 'suitcase-1', label: 'suitcase-1' },
        { value: 'receiving', label: 'receiving' },
        { value: 'collection', label: 'collection' },
        { value: 'files', label: 'files' },
        { value: 'notebook-1', label: 'notebook-1' },
        { value: 'notebook-2', label: 'notebook-2' },
        { value: 'toilet-paper', label: 'toilet-paper' },
        { value: 'office-building', label: 'office-building' },
        { value: 'school', label: 'school' },
        { value: 'table-lamp', label: 'table-lamp' },
        { value: 'house', label: 'house' },
        { value: 'no-smoking', label: 'no-smoking' },
        { value: 'smoking', label: 'smoking' },
        { value: 'shopping-cart-full', label: 'shopping-cart-full' },
        { value: 'shopping-cart-1', label: 'shopping-cart-1' },
        { value: 'shopping-cart-2', label: 'shopping-cart-2' },
        { value: 'shopping-bag-1', label: 'shopping-bag-1' },
        { value: 'shopping-bag-2', label: 'shopping-bag-2' },
        { value: 'sold-out', label: 'sold-out' },
        { value: 'sell', label: 'sell' },
        { value: 'present', label: 'present' },
        { value: 'box', label: 'box' },
        { value: 'bank-card', label: 'bank-card' },
        { value: 'money', label: 'money' },
        { value: 'coin', label: 'coin' },
        { value: 'wallet', label: 'wallet' },
        { value: 'discount', label: 'discount' },
        { value: 'price-tag', label: 'price-tag' },
        { value: 'news', label: 'news' },
        { value: 'guide', label: 'guide' },
        { value: 'male', label: 'male' },
        { value: 'female', label: 'female' },
        { value: 'thumb', label: 'thumb' },
        { value: 'cpu', label: 'cpu' },
        { value: 'link', label: 'link' },
        { value: 'connection', label: 'connection' },
        { value: 'open', label: 'open' },
        { value: 'turn-off', label: 'turn-off' },
        { value: 'set-up', label: 'set-up' },
        { value: 'chat-round', label: 'chat-round' },
        { value: 'chat-line-round', label: 'chat-line-round' },
        { value: 'chat-square', label: 'chat-square' },
        { value: 'chat-dot-round', label: 'chat-dot-round' },
        { value: 'chat-dot-square', label: 'chat-dot-square' },
        { value: 'chat-line-square', label: 'chat-line-square' },
        { value: 'message', label: 'message' },
        { value: 'postcard', label: 'postcard' },
        { value: 'position', label: 'position' },
        { value: 'turn-off-microphone', label: 'turn-off-microphone' },
        { value: 'microphone', label: 'microphone' },
        { value: 'close-notification', label: 'close-notification' },
        { value: 'bangzhu', label: 'bangzhu' },
        { value: 'time', label: 'time' },
        { value: 'odometer', label: 'odometer' },
        { value: 'crop', label: 'crop' },
        { value: 'aim', label: 'aim' },
        { value: 'switch-button', label: 'switch-button' },
        { value: 'full-screen', label: 'full-screen' },
        { value: 'copy-document', label: 'copy-document' },
        { value: 'mic', label: 'mic' },
        { value: 'stopwatch', label: 'stopwatch' },
        { value: 'medal-1', label: 'medal-1' },
        { value: 'medal', label: 'medal' },
        { value: 'trophy', label: 'trophy' },
        { value: 'trophy-1', label: 'trophy-1' },
        { value: 'first-aid-kit', label: 'first-aid-kit' },
        { value: 'discover', label: 'discover' },
        { value: 'place', label: 'place' },
        { value: 'location', label: 'location' },
        { value: 'location-outline', label: 'location-outline' },
        { value: 'location-information', label: 'location-information' },
        { value: 'add-location', label: 'add-location' },
        { value: 'delete-location', label: 'delete-location' },
        { value: 'map-location', label: 'map-location' },
        { value: 'alarm-clock', label: 'alarm-clock' },
        { value: 'timer', label: 'timer' },
        { value: 'watch-1', label: 'watch-1' },
        { value: 'watch', label: 'watch' },
        { value: 'lock', label: 'lock' },
        { value: 'unlock', label: 'unlock' },
        { value: 'key', label: 'key' },
        { value: 'service', label: 'service' },
        { value: 'mobile-phone', label: 'mobile-phone' },
        { value: 'bicycle', label: 'bicycle' },
        { value: 'truck', label: 'truck' },
        { value: 'ship', label: 'ship' },
        { value: 'basketball', label: 'basketball' },
        { value: 'football', label: 'football' },
        { value: 'soccer', label: 'soccer' },
        { value: 'baseball', label: 'baseball' },
        { value: 'wind-power', label: 'wind-power' },
        { value: 'light-rain', label: 'light-rain' },
        { value: 'lightning', label: 'lightning' },
        { value: 'heavy-rain', label: 'heavy-rain' },
        { value: 'sunrise', label: 'sunrise' },
        { value: 'sunrise-1', label: 'sunrise-1' },
        { value: 'sunset', label: 'sunset' },
        { value: 'sunny', label: 'sunny' },
        { value: 'cloudy', label: 'cloudy' },
        { value: 'partly-cloudy', label: 'partly-cloudy' },
        { value: 'cloudy-and-sunny', label: 'cloudy-and-sunny' },
        { value: 'moon', label: 'moon' },
        { value: 'moon-night', label: 'moon-night' },
        { value: 'dish', label: 'dish' },
        { value: 'dish-1', label: 'dish-1' },
        { value: 'food', label: 'food' },
        { value: 'chicken', label: 'chicken' },
        { value: 'fork-spoon', label: 'fork-spoon' },
        { value: 'knife-fork', label: 'knife-fork' },
        { value: 'burger', label: 'burger' },
        { value: 'tableware', label: 'tableware' },
        { value: 'sugar', label: 'sugar' },
        { value: 'dessert', label: 'dessert' },
        { value: 'ice-cream', label: 'ice-cream' },
        { value: 'hot-water', label: 'hot-water' },
        { value: 'water-cup', label: 'water-cup' },
        { value: 'coffee-cup', label: 'coffee-cup' },
        { value: 'cold-drink', label: 'cold-drink' },
        { value: 'goblet', label: 'goblet' },
        { value: 'goblet-full', label: 'goblet-full' },
        { value: 'goblet-square', label: 'goblet-square' },
        { value: 'goblet-square-full', label: 'goblet-square-full' },
        { value: 'refrigerator', label: 'refrigerator' },
        { value: 'grape', label: 'grape' },
        { value: 'watermelon', label: 'watermelon' },
        { value: 'cherry', label: 'cherry' },
        { value: 'apple', label: 'apple' },
        { value: 'pear', label: 'pear' },
        { value: 'orange', label: 'orange' },
        { value: 'coffee', label: 'coffee' },
        { value: 'ice-tea', label: 'ice-tea' },
        { value: 'ice-drink', label: 'ice-drink' },
        { value: 'milk-tea', label: 'milk-tea' },
        { value: 'potato-strips', label: 'potato-strips' },
        { value: 'lollipop', label: 'lollipop' },
        { value: 'ice-cream-square', label: 'ice-cream-square' },
        { value: 'ice-cream-round', label: 'ice-cream-round' }
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
      this.formData = Object.assign({}, {
        pid: 0,
        show: 1,
        tatget: 0,
        id: null,
        title: ''
      })
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
    flex:1

  }
}
</style>
