<template>
  <div class="app-container">
    <div class="window">
      <!-- 头部 start -->
      <div class="title">
        <div class="text">聊天对象:{{ nickname }}</div>
        <div class="icon">
          <span class="el-icon-minus icon1" />
          <span class="el-icon-copy-document icon2" />
        </div>
      </div>
      <!-- 头部 end -->

      <div class="content">
        <!-- 用户列表 start -->
        <div class="left">
          <div
            v-for="(item,a) in userList"
            :key="a"
            :class="currentUser==a?'on':''"
            class="item"
            @click="changeUser(a)"
          >
            <img class="avatar" :src="item.avatar" alt>
            <div class="nickname">{{ item.nickname }}</div>
            <div v-if="item.unRead" class="read" />
          </div>
        </div>
        <!-- 用户列表 end -->

        <div class="right">
          <!-- 内容区域 start -->
          <div class="top">
            <div v-for="(item,b) in list" :key="b" class="row">
              <div v-if="item.from == toId" class="other item">
                <img class="avatar" :src="otherAvatar">
                <div class="box">
                  <div v-if="item.type === 'text'" class="text" v-html="item.msg" />
                  <img v-if="item.type === 'img'" class="img" :src="item.msg.src" alt="">
                  <audio
                    v-if="item.type === 'sound'"
                    muted
                    :src="item.msg.src"
                    controls="controls"
                    autostart="false"
                  />
                </div>
              </div>

              <div v-if="item.from == myId" class="my item">
                <div class="box">
                  <div v-if="item.type === 'text'" class="text" v-html="item.msg" />
                  <img v-if="item.type === 'img'" class="img" :src="item.msg.src" alt="">
                  <audio
                    v-if="item.type === 'sound'"
                    muted
                    :src="item.msg.src"
                    controls="controls"
                    autostart="false"
                  />
                </div>
                <img class="avatar" :src="myInfo.avatar">
              </div>
            </div>
          </div>
          <!-- 内容区域 end -->

          <!-- 控制区域 start -->
          <div class="bottom">
            <div class="tag">
              <div class="emojio">
                <div class="icon3 el-icon-orange" @click="openPanel()" />
                <div v-if="isShow" class="panel">
                  <img
                    v-for="(item,c) in emojiList"
                    :key="c"
                    :src="url+ '/uploads/emoji/' +item.url"
                    :alt="item.url"
                    @click="getEmojio(c,$event)"
                  >
                </div>
              </div>
              <el-upload
                :show-file-list="false"
                :multiple="false"
                :action="http"
                :headers="header"
                :before-upload="selectImg"
                :on-change="changeImage"
                :on-success="successBack"
                :on-error="failBack"
                :on-progress="complete"
                name="images"
              >
                <span class="el-icon-picture icon4" />

              </el-upload>
            </div>
            <div class="control">
              <audio
                id="myaudio"
                muted
                src="@/assets/san.mp3"
                controls="controls"
                autostart="false"
                loop="false"
                hidden="true"
              />
              <div
                id="message"
                contenteditable="true"
                class="message"
                v-html="tempContent"
              />
              <div class="submit" @click="send()">发送</div>
            </div>
          </div>
          <!-- 控制区域 end -->
        </div>
      </div>
    </div>

  </div>
</template>

<script>

// 定义最后光标对象
console.log(getSelection())

import { getUserInfo } from '@/api/chat'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      nickname: '暂无~', // 聊天对象昵称
      url: process.env.VUE_APP_BASE_API,
      http: process.env.VUE_APP_BASE_API + 'v1/chat/index',
      header: {
        'Authorization': 'Bearer ' + getToken()
      },
      message: '',
      tempContent: '',
      tempMessage: '', // 表情
      tempText: '', // 文本
      currentUser: 0, // 当前选中用户
      userList: [],
      list: [],
      ws: {},
      token: '',
      isDone: true, // 第一次是否加载完成
      toId: null,
      myId: 1,
      otherAvatar: '', // 聊天对象头像
      myInfo: {},
      firstLoad: true, // 页面第一次加载
      from: '', // 接受的id
      emojiList: [
        { url: '100.gif', alt: '[微笑]' },
        { url: '101.gif', alt: '[伤心]' },
        { url: '102.gif', alt: '[美女]' },
        { url: '103.gif', alt: '[发呆]' },
        { url: '104.gif', alt: '[墨镜]' },
        { url: '105.gif', alt: '[哭]' },
        { url: '106.gif', alt: '[羞]' },
        { url: '107.gif', alt: '[哑]' },
        { url: '108.gif', alt: '[睡]' },
        { url: '109.gif', alt: '[哭]' },
        { url: '110.gif', alt: '[囧]' },
        { url: '111.gif', alt: '[怒]' },
        { url: '112.gif', alt: '[调皮]' },
        { url: '113.gif', alt: '[笑]' },
        { url: '114.gif', alt: '[惊讶]' },
        { url: '115.gif', alt: '[难过]' },
        { url: '116.gif', alt: '[酷]' },
        { url: '117.gif', alt: '[汗]' },
        { url: '118.gif', alt: '[抓狂]' },
        { url: '119.gif', alt: '[吐]' },
        { url: '120.gif', alt: '[笑]' },
        { url: '121.gif', alt: '[快乐]' },
        { url: '122.gif', alt: '[奇]' },
        { url: '123.gif', alt: '[傲]' },
        { url: '124.gif', alt: '[饿]' },
        { url: '125.gif', alt: '[累]' },
        { url: '126.gif', alt: '[吓]' },
        { url: '127.gif', alt: '[汗]' },
        { url: '128.gif', alt: '[高兴]' },
        { url: '129.gif', alt: '[闲]' },
        { url: '130.gif', alt: '[努力]' },
        { url: '131.gif', alt: '[骂]' },
        { url: '132.gif', alt: '[疑问]' },
        { url: '133.gif', alt: '[秘密]' },
        { url: '134.gif', alt: '[乱]' },
        { url: '135.gif', alt: '[疯]' },
        { url: '136.gif', alt: '[哀]' },
        { url: '137.gif', alt: '[鬼]' },
        { url: '138.gif', alt: '[打击]' },
        { url: '139.gif', alt: '[bye]' },
        { url: '140.gif', alt: '[汗]' },
        { url: '141.gif', alt: '[抠]' },
        { url: '142.gif', alt: '[鼓掌]' },
        { url: '143.gif', alt: '[糟糕]' },
        { url: '144.gif', alt: '[恶搞]' },
        { url: '145.gif', alt: '[什么]' },
        { url: '146.gif', alt: '[什么]' },
        { url: '147.gif', alt: '[累]' },
        { url: '148.gif', alt: '[看]' },
        { url: '149.gif', alt: '[难过]' },
        { url: '150.gif', alt: '[难过]' },
        { url: '151.gif', alt: '[坏]' },
        { url: '152.gif', alt: '[亲]' },
        { url: '153.gif', alt: '[吓]' },
        { url: '154.gif', alt: '[可怜]' },
        { url: '155.gif', alt: '[刀]' },
        { url: '156.gif', alt: '[水果]' },
        { url: '157.gif', alt: '[酒]' },
        { url: '158.gif', alt: '[篮球]' },
        { url: '159.gif', alt: '[乒乓]' },
        { url: '160.gif', alt: '[咖啡]' },
        { url: '161.gif', alt: '[美食]' },
        { url: '162.gif', alt: '[动物]' },
        { url: '163.gif', alt: '[鲜花]' },
        { url: '164.gif', alt: '[枯]' },
        { url: '165.gif', alt: '[唇]' },
        { url: '166.gif', alt: '[爱]' },
        { url: '167.gif', alt: '[分手]' },
        { url: '168.gif', alt: '[生日]' },
        { url: '169.gif', alt: '[电]' },
        { url: '170.gif', alt: '[炸弹]' },
        { url: '171.gif', alt: '[刀子]' },
        { url: '172.gif', alt: '[足球]' },
        { url: '173.gif', alt: '[瓢虫]' },
        { url: '174.gif', alt: '[翔]' },
        { url: '175.gif', alt: '[月亮]' },
        { url: '176.gif', alt: '[太阳]' },
        { url: '177.gif', alt: '[礼物]' },
        { url: '178.gif', alt: '[抱抱]' },
        { url: '179.gif', alt: '[拇指]' },
        { url: '180.gif', alt: '[贬低]' },
        { url: '181.gif', alt: '[握手]' },
        { url: '182.gif', alt: '[剪刀手]' },
        { url: '183.gif', alt: '[抱拳]' },
        { url: '184.gif', alt: '[勾引]' },
        { url: '185.gif', alt: '[拳头]' },
        { url: '186.gif', alt: '[小拇指]' },
        { url: '187.gif', alt: '[拇指八]' },
        { url: '188.gif', alt: '[食指]' },
        { url: '189.gif', alt: '[ok]' },
        { url: '190.gif', alt: '[情侣]' },
        { url: '191.gif', alt: '[爱心]' },
        { url: '192.gif', alt: '[蹦哒]' },
        { url: '193.gif', alt: '[颤抖]' },
        { url: '194.gif', alt: '[怄气]' },
        { url: '195.gif', alt: '[跳舞]' },
        { url: '196.gif', alt: '[发呆]' },
        { url: '197.gif', alt: '[背着]' },
        { url: '198.gif', alt: '[伸手]' },
        { url: '199.gif', alt: '[耍帅]' },
        { url: '200.png', alt: '[微笑]' },
        { url: '201.png', alt: '[生病]' },
        { url: '202.png', alt: '[哭泣]' },
        { url: '203.png', alt: '[吐舌]' },
        { url: '204.png', alt: '[迷糊]' },
        { url: '205.png', alt: '[瞪眼]' },
        { url: '206.png', alt: '[恐怖]' },
        { url: '207.png', alt: '[忧愁]' },
        { url: '208.png', alt: '[眨眉]' },
        { url: '209.png', alt: '[闭眼]' },
        { url: '210.png', alt: '[鄙视]' },
        { url: '211.png', alt: '[阴暗]' },
        { url: '212.png', alt: '[小鬼]' },
        { url: '213.png', alt: '[礼物]' },
        { url: '214.png', alt: '[拜佛]' },
        { url: '215.png', alt: '[力量]' },
        { url: '216.png', alt: '[金钱]' },
        { url: '217.png', alt: '[蛋糕]' },
        { url: '218.png', alt: '[彩带]' },
        { url: '219.png', alt: '[礼物]' }
      ],
      emojioText: [],
      isShow: false, // 是否打开表情面板 默认不打开
      form: {
        image: '',
        imageFile: ''
      }
    }
  },
  created() {
    this.ws.onclose
    this.initWebSocket()
    console.log(this.http)
    console.log(this.header)
  },
  beforeDestroy() {
    console.log('销毁之前')
    this.ws.onclose
  },
  // destroyed() {
  //   console.log('销毁')
  //   this.ws.onclose
  // },
  methods: {
     /**
       * 事件-选择图片
       */
      selectImg(file) {
        console.log(file)
        // 验证
        const isRightSize = file.size / 1024 < 500
        if (!isRightSize) {
          this.$message.error('文件大小超过 500KB')
        }
        const isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
        }

        this.form.imageFile = file
        return false // don't auto upload
      },

      // 图片被改变
      changeImage(file) {
        // 读图片预览
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.form.image = e.target.result
          that.complete()

          // console.log(that.form.image)
        }
        reader.readAsDataURL(file.raw)
      },
      successBack(response, file, fileList) {
        console.log('成功')
        console.log(response)
      },
      complete(response, file, fileList) {
        console.log('完成')
        console.log(response)
        console.log(file)
      },
      failBack(err, file, fileList) {
        console.log('失败')
        console.log(err)
      },
    // 是否打开表情面板
    openPanel() {
      this.isShow = !this.isShow
    },
    // 选择聊天表情
    getEmojio(index, e) {
      console.log(this.emojiList[index])
      console.log(e.srcElement.src)
      this.tempMessage +=
        "<img src='" +
        e.srcElement.src +
        "' alt='" +
        this.emojiList[index].alt +
        "'>"
        this.tempContent = "<div style='display:flex;flex-wrap:wrap;'>" + this.tempMessage + '</div>'
    },
    // 切换聊天对象
    changeUser(index) {
      this.currentUser = index
      this.toId = this.userList[index].id
      this.userList[index].unRead = false
      localStorage.setItem('xkl-chat-user', JSON.stringify(this.userList))
      console.log(this.toId)
      this.getHistory(this.toId)
      this.nickname = this.userList[index].nickname
    },
    initWebSocket() {
      // 初始化weosocket
      // const wsuri = this.config.ws_server
      const wsuri = 'ws://47.108.63.117:9502'
      // 连接服务端
      this.ws = new WebSocket(wsuri)
      var that = this
      // 【用于指定连接成功后的回调函数】
      this.ws.onopen = function() {
        that.login()
        // 【用于指定收到服务器数据后的回调函数】
        that.ws.onmessage = function(res) {
          // console.log(res)
          console.log(JSON.parse(res.data))
          // 回调名称--call  回调结果--result
          var call = JSON.parse(res.data).call
          var result = JSON.parse(res.data).result
          // 登录之后获得token
          if (call === 'login.do') {
            that.token = result.token
            console.log(that.toId)
            if (that.toId) {
              // 登录之后 拉取历史记录
              that.getHistory(that.toId)
            }
            // 查询客服信息
            that.getUser(1)
          } else if (call === 'chat.history') {
            console.log('历史记录')
            this.list = []
            if (result) {
              result.forEach(item => {
                // 返回的数据是倒序 所以用unshift
                that.list.unshift(JSON.parse(item))
              })
            }
          } else if (call === 'chat.recv') {
            // 接受到消息 播放提示音
            var myAuto = document.getElementById('myaudio')
            myAuto.play()
            // 关闭提示音
            setTimeout(function() {
              myAuto.pause()
            }, 600)
            console.log('服务器推送的消息 start')
            console.log(result)
            that.list.push(JSON.parse(res.data).result)
            var userList = JSON.parse(localStorage.getItem('xkl-chat-user'))
            console.log(userList)
            userList.forEach(item => {
              console.log('未读状态：' + item.unRead)
              // if (result.from !== item.id) {
              //   console.log('新数据')
              //   that.from = result.from
              //   // localStorage.setItem('xkl-chat-user', JSON.stringify(userList))
              // }
              // // 当前聊天对象等于接收消息对象 不显示未读标志
              if (result.from === that.toId) {
                return
              } else {
                 console.log('-------------------------')
                that.from = item.id
                item.unRead = true
                console.log(item.unRead)
              }
            })
              that.getUser(that.from)

            // that.userList = userList
            // localStorage.setItem('xkl-chat-user', JSON.stringify(userList))
            // console.log(JSON.parse(res.data))
            console.log('服务器推送的消息 end')
          } else if (call === 'chat.unread') {
            console.log('多人未读消息 ------------ start')
            console.log(JSON.parse(res.data))
            // 获得对象中的键---key
            var keyArr = []
            var idArr = []
            var getUid = /[a-z]/g
            keyArr = Object.keys(JSON.parse(res.data).result)
            // console.log(keyArr)
            that.toId = idArr[0]
            // 查看缓存有没有数据
            if (localStorage.getItem('xkl-chat-user')) {
              console.log('缓存')
              // 有新数据 新用户
              console.log(keyArr.length)
              console.log(that.userList.length)
              if (keyArr.length > that.userList.length) {
                console.log('有新增用户了')
                keyArr.forEach(item => {
                  item = item.replace(getUid, '')
                  idArr.push(item)
                  console.log('id:' + item)
                  that.getUser(parseInt(item))
                })
              // 没有新数据
              } else {
                that.userList = JSON.parse(
                  localStorage.getItem('xkl-chat-user')
                )
                that.toId = that.userList[0].id
              }
              // 登录之后 拉取历史记录
              that.getHistory(that.toId)
            } else {
              console.log('赋值')
              keyArr.forEach(item => {
                item = item.replace(getUid, '')
                idArr.push(item)
                console.log('id:' + item)
                that.getUser(parseInt(item))
              })
            }
            console.log('多人未读消息 ------------ end')
          }
        }
      }
      this.ws.websocketClose = function(e) {
        console.log('断开连接', e)
        // 连接建立失败重连
        this.initWebSocket()
      }
      this.ws.websocketOnError = function() {
        // 连接建立失败重连
        this.initWebSocket()
      }
    },
    // 发送消息
    send() {
      if (!this.toId) {
        this.$message.error('请选择聊天对象')
        return
      }
      this.tempText = document.getElementById('message').innerHTML
      // this.tempContent += this.tempText
      this.message += this.tempText
      // 清空输入框文本
      this.tempMessage = ''
      this.tempText = ''
      this.tempContent = ''
      console.log(this.tempText)
      if (!this.message) {
        this.$message.error('发送内容不能为空')
        return
      }
      var data = {
        type: 'text',
        msg: this.message,
        to: this.toId,
        origin: 's' // s=单聊  g=群聊
      }
      this.sendBody('chat.send', data)
      this.isShow = false
    },
    // 发送体
    sendBody(call, data) {
      var temp = {
        call: call,
        body: data,
        token: this.token
      }
      if (call === 'chat.send') {
        console.log('点击发送了')
        console.log(this.getText(data))
        this.list.push(this.getText(data))
        this.message = ''
      } else if (call === 'chat.history') {
        console.log('history')
        // this.list.push(this.getText(data))
      }
      this.ws.send(JSON.stringify(temp))
      console.log(temp)
    },
    // 普通文本格式
    getText(data) {
      var body = {
        type: data.type,
        msg: data.msg,
        to: data.to,
        origin: data.origin, // s=单聊  g=群聊
        from: this.myId
      }
      return body
    },
    login() {
      this.sendBody('login.do', {
        user: '18230771271',
        pass: 'f8053a97efd69963b5173749ce378e19'
      })
    },
    websocketOnOpen() {
      // 连接建立之后执行send方法发送数据
      // const actions = { 'type': , 'msg': 'requestPermission' }
      // this.websocketSend(JSON.stringify(actions))
      // // 连接后,定时发送,否则不段时间不通信会自动断连(时间长短一般是服务端指定的)
      // var that = this
      // setInterval(function() {
      //     that.websocketSend(JSON.stringify({ 'type': 0, 'msg': 'ping' }))
      // }, 15000)
    },
    // websocketOnMessage(res) {
    //   // 数据接收
    //   console.log('监听中...')
    //   console.log(res)
    //   const redata = JSON.parse(res.data)
    //   console.log(redata)
    // },
    // websocketSend(res) {
    //   // 数据发送
    //   console.log('发送')
    //   console.log(res)
    // },
    // 拉取聊天记录
    getHistory() {
      var data = {
        type: 's', // g=群聊 s=单聊
        to: this.toId, // uid 或者 群号
        limit: 20, // 拉取数量 建议不要超过20条
        offset: 0 // 偏移
      }
      this.getUser(this.toId)
      this.sendBody('chat.history', data)
    },
    getLocalUser() {
      var arr = []
      localStorage.setItem('userList', JSON.stringify(arr))
    },
    // 获取用户信息
    getUser(id) {
      getUserInfo(id)
        .then(res => {
          if (res.code === 0) {
            console.log(res.data)
            res.data.avatar = res.data.avatar
            if (id === 1) {
              this.myInfo = res.data
              console.log(this.myInfo)
            } else {
              // 如果是第一次加载 则加载聊天对象的头像
              if (this.toId) {
                this.otherAvatar = res.data.avatar
                console.log(res.data.nickname)
                return
              }
              console.log(res.data)
              res.data.unRead = false
              this.userList.push(res.data)
              console.log(this.toId)
              localStorage.setItem(
                'xkl-chat-user',
                JSON.stringify(this.userList)
              )
            }
          }
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  }
}
</script>

<style lang="scss">
@mixin box($direction: row, $horizontal: space-between, $vertical: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $horizontal;
  align-items: $vertical;
}

.window {
  margin: 80px auto;
  width: 800px;
  height: 700px;
  border: 1px solid #dddddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .title {
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 8%;
    border-bottom: 1px solid #cccccc;
    background-color: #fafafa;
    .text{
      flex: 1;
      text-align: center;
    }
    .icon {
      display: flex;
      align-items: center;
      .icon1 {
        margin-right: 10px;
        color: #333333;
      }
    }
  }
  .content {
    height: 92%;
    display: flex;
    justify-content: space-between;
    .left {
      width: 30%;
      border-right: 1px solid #cccccc;
      box-sizing: border-box;
      overflow-y: auto;
      .item {
        @include box(row, space-between, center);
        padding: 10px 20px;
        cursor: pointer;
        &.on {
          background-color: #f1f1f1;
          font-weight: 700;
        }
        &:hover {
          background-color: #f1f1f1;
        }
        .avatar {
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .nickname {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 70%;
          margin: 0 auto;
        }
        .read {
          width: 12px;
          height: 12px;
          background-color: #f00;
          border-radius: 50%;
        }
      }
    }
    .right {
      width: 70%;
      .top {
        height: 70%;
        overflow-y: auto;
        .row {
          padding: 10px;
          .item {
            display: flex;
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
            .box {
              max-width: 80%;
              padding: 10px;
              background-color: #dddddd;
              border-radius: 10px;
              .img{
                width: 160px;
                height: 200px;
              }
            }
          }
        }
        .other {
          .avatar {
            margin-right: 10px;
          }
        }
        .my {
          justify-content: flex-end !important;
          .avatar {
            margin-left: 10px;
          }
        }
      }
      .bottom {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-top: 1px solid #cccccc;
        height: 30%;
        background-color: #ffffff;
        .tag {
          display: flex;
          padding: 10px;
          .icon3,
          .icon4 {
            font-size: 24px;
            color: #cccccc;
          }
          .emojio {
            margin-right: 10px;
            position: relative;
            display: flex;
            .panel {
              // display: none;
              padding: 5px;
              box-sizing: border-box;
              position: absolute;
              top: -161px;
              left: 0;
              background-color: #ffffff;
              width: 300px;
              height: 150px;
              overflow-y: auto;
              user-select: none;
            }
          }
        }
        .control {
          flex: 1;
          position: relative;
          .message {
            height: 65%;
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            outline: none;
            border: none;
            resize: none;
          }
          .submit {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 80px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            color: #ffffff;
            background: linear-gradient(to right, #00a7ec, #0000ff);
            border-radius: 2px;
            cursor: pointer;
            user-select: none;
          }
        }
      }
    }
  }
}
</style>
