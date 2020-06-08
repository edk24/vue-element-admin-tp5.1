<template>
  <div class="app-container">
    <p>
      <el-button type="primary" @click="create()">添加轮播图</el-button>
    </p>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="title" label="名称" width="180" />
      <el-table-column label="图片" width="250">
        <template slot-scope="scope">
          <el-image class="image" width="200" :src="scope.row.image">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="is_sub" label="轮播图信息">
        <template slot-scope="scope">
          <span>{{ scope.row.explain }}</span>
          <!--  <span v-if="scope.row.is_sub===1">是</span>
          <span v-else>否</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="is_sub" label="轮播图分类">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
          <!-- <span v-if="scope.row.type===0">首页</span> -->
        </template>
      </el-table-column>

      <el-table-column prop="to_type" label="跳转链接">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="create_time" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理">
        <template slot-scope="scope">
          <div>
            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除这个轮播图吗?" @onConfirm="del(scope.row)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="centerDialogVisible" width="600px" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="图片:">

          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
          >
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

        </el-form-item>

        <el-form-item label="详细介绍:">
          <el-input v-model="form.explain" placeholder="请输入轮播图信息" />
        </el-form-item>

        <el-form-item label="分类:">

          <el-select v-model="current" placeholder="请选择分类">
            <el-option v-for="(item,index) in typeArr" :key="index" :label="item" :value="index" />

          </el-select>
        </el-form-item>

        <el-form-item label="跳转链接:">
          <el-input v-model="form.url" placeholder="请输入跳转链接" />
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
  export default {
    data() {
      return {
        list: [], // 列表
        page: 1,
        limit: 25,
        count: 0,
      }
    },
    // init
    created() {
    },
    methods: {

    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
