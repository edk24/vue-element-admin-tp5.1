<template>
    <div class="app-container">
      <el-button type="primary" @click="show_addnews=true">添加新闻</el-button>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id"
         >
        </el-table-column>

        <el-table-column
          prop="title"
          label="分类名称"
         >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          >
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="修改时间"
         >
        </el-table-column>

        <el-table-column
          label="操作"
          >
          <el-button @click="update_news_type()">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </el-table-column>
      </el-table>

      <el-dialog  :visible.sync="show_addnews">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="add_news_type">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

    </div>
</template>

<script>
  import { news_type_add , news_type} from '@/api/web'
  import EditorBar from '@/components/wangEnduit'
  export default {
    components: { EditorBar },
    data() {
      return {
        form: {
          title: ''
        },
        tableData:[],
        show_addnews: false
      }
    },
    created() {
      this.get_news_tpye()
    },
    methods: {
      //获得新闻分类列表
      get_news_tpye() {
        var that=this;
        news_type().then(res=>{
          console.log(res);
          if(res.code==0){
            that.tableData=res.data;
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //添加新闻分类列表
      add_news_type(){
        var that=this;
        if (!that.form.title) {
          this.$message.error('请输入分类名称')
          return
        }
        const formData = new FormData()
        formData.append('title',that.form.title);
        console.log(this.form.title);
        news_type_add(formData).then(res=>{
          console.log(res);
          if(res.code==0){
            this.$message.success('添加成功')
            that.get_news_tpye();
            that.show_addnews=false
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      //编辑新闻分类列表
      update_news_type(){

      }
    }
  }
</script>

<style scoped>

</style>
