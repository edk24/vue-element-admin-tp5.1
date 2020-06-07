<template>
  <div class="app-container">
    <div class="window">
      <!-- 头部 start -->
      <div class="title">
        <div class="text">客服</div>
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
                </div>
              </div>

              <div v-if="item.from == myId" class="my item">
                <div class="box">
                  <div v-if="item.type === 'text'" class="text" v-html="item.msg" />
                </div>
                <img class="avatar" :src="myInfo.avatar">
              </div>
            </div>
          </div>
          <!-- 内容区域 end -->

          <!-- 控制区域 start -->
          <div class="bottom">
            <div class="tag">
              <span class="el-icon-orange icon3" />
              <span class="el-icon-picture icon4" />
            </div>
            <div class="control">
              <audio id="myaudio" muted src="@/assets/san.mp3" controls="controls" autostart="false" loop="false" hidden="true" />
              <textarea v-model="tempMessage" class="message" @keyup.enter="send()" />
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
import { getUserInfo } from '@/api/chat'

export default {
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      message: '',
      tempMessage: '',
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
      from: ''
    }
  },
  created() {
    this.ws.onclose
    this.initWebSocket()
    // if (this.isDone) {
    //   this.isDone = false
    // }

    // 获取uid=1 的客服信息
    // this.getUser(3)
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
    changeUser(index) {
      this.currentUser = index
      this.toId = this.userList[index].id
      this.userList[index].unRead = false
      localStorage.setItem('xkl-chat-user', JSON.stringify(this.userList))
      console.log(this.toId)
      this.getHistory(this.toId)
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
            console.log('服务器推送的消息')
            console.log(result)
            that.list.push(JSON.parse(res.data).result)
            var userList = JSON.parse(localStorage.getItem('xkl-chat-user'))
            console.log(userList)
            userList.forEach((item) => {
              // 当前聊天对象等于接收消息对象 不显示未读标志
              if (result.from === that.toId) {
                return
              }
              if (item.id === result.from) {
                that.from = item.id
                item.unRead = true
              }
            })
            that.userList = userList
            localStorage.setItem('xkl-chat-user', JSON.stringify(userList))
            // console.log(JSON.parse(res.data))
          } else if (call === 'chat.unread') {
            console.log('多人未读消息')
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
              that.userList = JSON.parse(localStorage.getItem('xkl-chat-user'))
              console.log(that.userList)
              that.toId = that.userList[0].id
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
              console.log(JSON.parse(localStorage.getItem('xkl-chat-user')))
              console.log('------------------------')
              this.toId = JSON.parse(localStorage.getItem('xkl-chat-user'))[0].id
              that.getHistory(that.toId)
            }
          }
        }
      }
    },
    // 发送消息
    send() {
      console.log(this.tempMessage)
      this.message = this.tempMessage
      var data = {
        type: 'text',
        msg: this.message,
        to: this.toId,
        origin: 's' // s=单聊  g=群聊
      }
      this.sendBody('chat.send', data)
      this.tempMessage = ''
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
        pass: 'e10adc3949ba59abbe56e057f20f883e'
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
    // 【用于指定报错时的回调函数】
    websocketOnError() {
      // 连接建立失败重连
      this.initWebSocket()
    },
    // 【用于指定连接关闭后的回调函数。】
    websocketClose(e) {
      // 关闭
      console.log('断开连接', e)
    },
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
    getUser(id) {
      getUserInfo(id)
        .then(res => {
          if (res.code === 0) {
            // console.log(res.data)
            res.data.avatar = this.url + res.data.avatar
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
              res.data.unRead = false
              this.userList.push(res.data)
              console.log(this.userList)
              // this.toId = this.userList[0].id
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
    height: 8%;
    border-bottom: 1px solid #cccccc;
    background-color: #fafafa;
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
      .item {
        @include box(row,space-between,center);
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
        .nickname{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: 70%;
          margin: 0 auto;
        }
        .read{
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
          padding: 10px;
          .icon3,
          .icon4 {
            font-size: 24px;
            color: #cccccc;
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
