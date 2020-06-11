<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="FormShow = true">添加</el-button>
    </div>
    <div>
      <el-dialog :visible.sync="FormShow" title="添加数据">
        <el-form ref="form" :model="DataForm" label-width="80px">
          <el-form-item label="分类搜索">
            <el-input v-model="DataForm.keyword" placeholder="输入关键字进行搜索" autocomplete="off" @input="get_category" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="DataForm.category" placeholder="请选择分类" @change="category_change">
              <el-option v-for="(item,index) in CategoryList" :key="index" :label="item.title" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称">
            <el-input v-model="DataForm.title" placeholder="请输入产品名称" />
          </el-form-item>
          <el-form-item label="产品简介">
            <el-input v-model="DataForm.introduce" type="textarea" />
          </el-form-item>
          <el-form-item label="使用范围">
            <el-input v-model="DataForm.scope" type="textarea" />
          </el-form-item>
          <el-form-item label="产品概述">
            <editor-bar v-model="DataForm.overview" />
          </el-form-item>
          <el-form-item label="技术解析">
            <editor-bar v-model="DataForm.analysis" />
          </el-form-item>
          <el-form-item label="核心配件">
            <editor-bar v-model="DataForm.accessories" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="FormShow = false">取 消</el-button>
          <el-button type="primary" @click="data_submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import EditorBar from '@/components/wangEnduit'
  import { category_all } from '@/api/web'
    export default {
      components: { EditorBar },
        data() {
          return {
            data: {},
            page: 1,
            limit: 10,
            count: 0,
            DataForm: {
              keyword: '',
              title: '',
              category: 0,
              introduce: '',
              scope: '',
              overview: '',
              analysis: '',
              accessories: ''
            },
            FormShow: false,
            CategoryList: []
          }
        },
      created() {
        this.get_category()
      },
      methods: {
        // 获取分类列表
        get_category() {
          category_all(this.DataForm.keyword).then(res => {
            if (res.data.length < 1) {
              this.CategoryList = []
              this.DataForm.category = ''
              return
            }
            this.CategoryList = res.data
            this.DataForm.category = ''
          })
        },
        // 分类改变事件
        category_change() {
          console.log(this.DataForm.category)
          this.DataForm.keyword = this.CategoryList[this.DataForm.category].title
        },
        // 数据提交
        data_submit() {
          console.log(JSON.stringify(this.DataForm))
        }
      }
    }
</script>

<style scoped>

</style>
