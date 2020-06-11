<template>
  <div class="app-container">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="关于我们" name="about">
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.type !== 'img'">
                    {{ scope.row.value }}
                  </div>
                  <el-image v-else style="width: 300px" :src="scope.row.value" fit="fill" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div>
                  <el-button size="small" type="primary" @click="data_update_popup(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="招商加盟" name="shop" >
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.type !== 'img'">
                    {{ scope.row.value }}
                  </div>
                  <el-image v-else style="width: 300px" :src="scope.row.value" fit="fill" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div>
                  <el-button size="small" type="primary" @click="data_update_popup(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="服务支持" name="server" >
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.type !== 'img'">
                    {{ scope.row.value }}
                  </div>
                  <el-image v-else style="width: 300px" :src="scope.row.value" fit="fill" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div>
                  <el-button size="small" type="primary" @click="data_update_popup(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="联系我们" name="contact" >
          <el-table :data="data" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="80" />
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.type !== 'img'">
                    {{ scope.row.value }}
                  </div>
                  <el-image v-else style="width: 300px" :src="scope.row.value" fit="fill" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" />
            <el-table-column label="管理" width="200">
              <template slot-scope="scope">
                <div>
                  <el-button size="small" type="primary" @click="data_update_popup(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>

    <el-dialog title="信息修改" :visible.sync="UpdateFormShow">
      <el-form :model="UpdateForm">
        <el-form-item v-if="UpdateForm.type === 'input'" label="内容">
          <el-input v-model="UpdateForm.value" autocomplete="off" />
        </el-form-item>

        <el-form-item v-if="UpdateForm.type === 'text'" label="内容">
          <el-input v-model="UpdateForm.value" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item v-else label="图片:">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
          >
            <img v-if="UpdateForm.value" :src="UpdateForm.value" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UpdateFormShow = false">取 消</el-button>
        <el-button type="primary" @click="text_update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图片修改" :visible.sync="ImageFormShow">
      <el-form :model="UpdateForm">
        <el-form-item v-if="UpdateForm.type === 'input'" label="内容">
          <el-input v-model="UpdateForm.value" autocomplete="off" />
        </el-form-item>

        <el-form-item v-if="UpdateForm.type === 'text'" label="内容">
          <el-input v-model="UpdateForm.value" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item v-else label="图片:">
          <el-upload
            :show-file-list="false"
            :multiple="false"
            action="post"
            :before-upload="selectImg"
            :on-change="changeImage"
          >
            <img v-if="UpdateForm.value" :src="UpdateForm.value" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ImageFormShow = false">取 消</el-button>
        <el-button type="primary" @click="image_update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { about, update_config } from '@/api/web'
    export default {
      data() {
        return {
          data: [],
          UpdateForm: {},
          UpdateFormShow: false,
          ImageFormShow: false,
          http: process.env.VUE_APP_BASE_API,
          imageFile: '',
          activeName: 'about'
        }
      },
      created() {
        this.get_list()
      },
      methods: {
        // 获取数据列表
        get_list() {
          about(this.activeName).then(res => {
            res.data.forEach(data => {
              if (data.type === 'img') {
                data.value = this.http + data.value
              }
            })
            this.data = res.data
          })
        },
        // 数据修改弹出
        data_update_popup(data) {
          this.UpdateForm = data
          if (data.type === 'img') {
            this.ImageFormShow = true
          } else {
            this.UpdateFormShow = true
          }
        },
        // 提交修改数据
        text_update() {
          const formData = new FormData()
          // 数据ID
          formData.append('id', this.UpdateForm.id)
          // 内容
          formData.append('value', this.UpdateForm.value)
          update_config(formData).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.UpdateFormShow = false
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        // 图片修改
        image_update() {
          const formData = new FormData()
          // 数据ID
          formData.append('id', this.UpdateForm.id)
          // 内容
          formData.append('value', this.imageFile)
          update_config(formData).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.ImageFormShow = false
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        /**
         * 事件-选择图片
         */
        selectImg(file) {
          // 验证
          // const isRightSize = file.size / 1024 < 500
          const isAccept = new RegExp('image/*').test(file.type)
          if (!isAccept) {
            this.$message.error('应该选择image/*类型的文件')
          }

          this.imageFile = file
          return false // don't auto upload
        },

        // 图片被改变
        changeImage(file) {
          // 读图片预览
          const that = this
          var reader = new FileReader()
          reader.onload = (e) => {
            that.UpdateForm.value = e.target.result
          }
          reader.readAsDataURL(file.raw)
        },

        // 选项卡改变事件
        handleClick() {
          this.get_list()
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
