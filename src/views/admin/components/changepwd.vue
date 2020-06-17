<template>
  <div>
    <el-dialog v-bind="$attrs" title="Dialog Titile" v-on="$listeners" @open="onOpen" @close="onClose">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入新密码"
            clearable
            show-password
            :style="{width: '100%'}"
          /> 
        </el-form-item>
        <el-form-item label="重复密码" prop="re_pwd">
          <el-input
            v-model="formData.re_pwd"
            placeholder="请输入重复密码"
            clearable
            show-password
            :style="{width: '100%'}"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      formData: {
        password: undefined,
        re_pwd: undefined
      },
      rules: {
        password: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }],
        re_pwd: [{
          required: true,
          message: '请输入重复密码',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    }
  }
}

</script>
<style>
</style>
