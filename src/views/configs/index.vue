<template>
  <div class="app-container">
    <el-tabs :active-name="tab_select">
      <el-tab-pane
        v-for="(item, index) in configList"
        :key="index"
        :label="item.name"
        :name="item.group"
      >
        <el-form label-width="160px">
          <el-form-item v-for="(row, n) in item.item" :key="n" :label="row.title">
            <!-- 文本框 -->
            <el-input v-if="row.type==='input'"  v-model="row.value" :placeholder="row.desc" />
            <!-- 文本框 -->
            <el-input-number v-if="row.type==='number'"  v-model="row.value" :placeholder="row.desc" />
            <!-- 加长文本框 -->
            <el-input
              v-else-if="row.type ==='text'"
              v-model="row.value"
              type="textarea"
              :placeholder="row.desc"
            />
            <!-- 单选框 -->
            <el-radio-group v-else-if="row.type === 'radio'" v-model="row.value">
              <el-radio v-for="(v, i) in row.attach" :key="i" :label="v.value">{{ v.title }}</el-radio>
            </el-radio-group>
            <!-- 开关 -->
            <el-switch v-else-if="row.type==='switch'" v-model="row.value" />
            <!-- 选择列表 -->
            <el-select
              v-else-if="row.type === 'select'"
              v-model="row.value"
              :placeholder="row.desc"
            >
              <el-option v-for="(v,i) in row.attach" :key="i" :label="v.title" :value="v.value" />
            </el-select>
            <!-- 日期选择框 -->
            <el-date-picker
              v-else-if="row.type==='date'"
              v-model="row.value"
              type="date"
              :placeholder="row.desc"
            />
            <!-- 时间选择框 -->
            <el-time-picker
              v-else-if="row.type==='time'"
              v-model="row.value"
              :placeholder="row.desc"
            />
            <!-- 图片上传 -->
            <div v-else-if="row.type==='image'">
              <el-upload
              class="avatar-uploader"
                :action="url+'/v1/uploads/all'"
                list-type="picture-card"
                :data="attach"
                name="images"
                :multiple="false"
                :show-file-list="false"
                :before-upload="onBeforeUpload"
                :on-success="handleUploadSuccess"
                :limit="1"
                :value="row.value"
              >
              <!-- TODO: 修改不了 -->
                <img v-if="row.value" :src="url+row.value" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="submitUpdate()">保存设置</el-button>
  </div>
</template>

<script>
import { uploadImage } from '@/api/common'
import { getAllConfig, updateAll } from '@/api/configs'
export default {
  data() {
    return {
      url:process.env.VUE_APP_BASE_API,
      configList: [],
      tab_select: '',

      // 上传附带
      attach:{
        type:'configs'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      getAllConfig()
        .then(({ code, data, msg, count }) => {
          if (code === 0) {
            this.configList = data
              this.tab_select = data[0].group
          } else {
            this.$message.error(msg)
          }
        })
        .catch(() => {})
    },
    // 文件上传成功
    handleUploadSuccess(res, file, fileList)
    {
      console.log(this.$refs);
      console.log(res);
      // if (res.code===0) {
      //   row.value=res.data
      // }
    },
    // 文件上传
    onBeforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return true
    },
    woc(d){
      console.log('哈哈哈哈');
console.log(d);
    },
    // 提交更改
    submitUpdate() {
      const submitData = {}
      for (let i = 0; this.configList.length > i; i++) {
        for (let n = 0; this.configList[i].item.length > n; n++) {
          const key = this.configList[i].item[n].key
          const value = this.configList[i].item[n].value
          console.log(key)
          submitData[key] = value
        }
      }

      console.log(submitData)
      updateAll({ all: submitData })
        .then(({ code, msg }) => {
          if (code === 0) {
            this.$message.success('修改成功')
          } else {
            this.$message.error(msg || '修改失败')
          }
        })
        .catch(() => {})
    }
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
    border-color: #409EFF;
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
