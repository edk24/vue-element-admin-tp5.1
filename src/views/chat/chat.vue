<template>
  <div class="app-container">
    <div class="window">
      <!-- 头部 start -->
      <div class="title">
        <div class="text">聊天列表</div>
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
            :class="ChatUser.id==item.id?'on':''"
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
          <div v-if="Chating" class="top">
            <div v-for="(item,b) in messageList" :key="b" class="row">
              <!--对方发送的聊天消息-->
              <div v-if="item.from == ChatUser.id" class="other item">
                <img class="avatar" :src="ChatUser.avatar">
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

              <div v-if="item.from === MyInfo.id" class="my item">
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
                <img class="avatar" :src="MyInfo.avatar">
              </div>
            </div>
          </div>
          <!-- 内容区域 end -->

          <!-- 控制区域 start -->
          <div v-if="Chating" class="bottom">
            <div class="tag">
              <div class="emojio">
                <div class="icon3 el-icon-orange" @click="openEmoji()" />
                <div v-if="EmojiShow" class="panel">
                  <img
                    v-for="(item,c) in emojiList"
                    :key="c"
                    :src="url+ '/uploads/emoji/' +item.url"
                    :alt="item.url"
                    @click="getEmoji(c,$event)"
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
                @focus="EmojiShow = false"
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
  import { getInfo } from '@/api/user'
  import { fileUpload } from '@/api/chat'
  export default {
    data() {
      return {
        Config: {
          url: 'ws://121.36.42.208:9502',
          online: false,
          token: '',
          reloadTime: 30
        },
        Socket: {},
        userList: [],
        ChatUser: {},
        messageList: [],
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
        Content: '',
        EmojiShow: false,
        header: {},
        MyInfo: {},
        url: process.env.VUE_APP_BASE_API,
        http: process.env.VUE_APP_BASE_API + 'v1/chat/index',
        tempMessage: '', // 表情
        ContentText: '', // 文本内容
        form: {
          image: '',
          imageFile: ''
        },
        Chating: false
      }
    },
    created() {
      // 创建socket 连接
      this.createWebSocket()
      this.getMyInfo()
      this.getUserList()
    },
    onbeforeunload() {
      console.log('页面刷新')
      this.createWebSocket()
    },
    methods: {
      // 获取用户列表
      getUserList() {
        this.userList = JSON.parse(localStorage.getItem('userList'))
      },
      // 设置用户列表
      setUserList() {
        localStorage.setItem('userList', this.userList)
      },
      // 获取当前登录用户信息
      getMyInfo() {
        getInfo().then(res => {
          this.MyInfo = res.data
        })
      },
      // 创建连接
      createWebSocket() {
        try {
          // 创建Web Socket 连接
          const socket = new WebSocket(this.Config.url)
          // 初始化事件
          this.initEventHandle(socket)
        } catch (e) {
          // 出错时重新连接
          this.reconnect()
        }
      },
      // 连接初始化
      initEventHandle(socket) {
        // 连接关闭时触发
        socket.onclose = () => {
          this.Config.online = false
          this.reconnect()
          console.log('连接关闭')
        }
        // 通信发生错误时触发
        socket.onerror = () => {
          console.log('通信错误')
          // 重新创建长连接
          this.reconnect()
        }
        // 连接建立时触发
        socket.onopen = () => {
          // 连接建立, 登录聊天
          this.Socket = socket
          this.Login(socket)
          console.log('连接成功')
        }
        // 客户端接收服务端数据时触发
        socket.onmessage = msg => {
          var data = JSON.parse(msg.data)
          switch (data.call) {
            case 'login.do':// 登录
              this.LoginReturn(data)
              break
            case 'chat.unread':// 未读消息
              this.NotReadReturn(data)
              break
            case 'chat.history':// 历史消息
              this.HistoryReturn(data)
              break
            case 'user.get':// 用户信息
                  this.getUserReturn(data)
                  break
            case 'chat.unread_history':// 未读历史
                  this.NotHistoryReturn(data)
                  break
            case 'chat.recv':// 收到消息
                  this.getMessage(data)
                  break
          }
        }
      },
      // 重连
      reconnect() {
        if (this.Config.online) {
          return
        }
        // 没连接上会一直重连，设置延迟避免请求过多
        setTimeout(() => {
          this.Config.online = false
          this.createWebSocket(this.Config.url)
        }, 2000)
      },
      // 选择图片
      selectImg(file) {
        // 验证
        const isRightSize = file.size / 1024 < 500
        if (!isRightSize) {
          this.$message.error('文件大小超过 500KB')
          return
        }
        const isAccept = new RegExp('image/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择image/*类型的文件')
        }
        this.form.imageFile = file
        this.UploadImage()
        return false
      },
      // 图片改变
      changeImage(file) {
        // 读图片预览
        const that = this
        var reader = new FileReader()
        reader.onload = (e) => {
          that.form.image = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },
      // 文件上传
      UploadImage() {
        var formData = new FormData()
        formData.append('images', this.form.imageFile)
        fileUpload(formData).then(res => {
          if (res.code === 0) {
            this.sendImage(res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 发送图片消息
      sendImage(data) {
        var that = this
        this.Socket.send(JSON.stringify({
          call: 'chat.send',
          body: {
            type: 'img',
            msg: {
              src: that.url + data.src,
              thumb: that.url + data.src, // 缩略图
              w: data.w,
              h: data.h
            },
            to: that.ChatUser.id, // 群号 or uid
            origin: 's' // s=单聊, g=群聊
          },
          token: that.Config.token
        }))
        this.messageList.push({
          type: 'img',
          msg: {
            src: that.url + data.src,
            thumb: that.url + data.src, // 缩略图
            w: data.w,
            h: data.h
          },
          from: that.MyInfo.id,
          to: that.ChatUser.id, // 群号 or uid
          origin: 's' // s=单聊, g=群聊
        })
        that.toBottom()
      },
      // 跳转聊天最底部
      toBottom() {
        this.$nextTick(() => {
          var container = this.$el.querySelector('.top')
          container.scrollTop = container.scrollHeight
        })
      },
      // 登录方法
      Login(socket) {
        const message = JSON.stringify({
          call: 'login.do',
          body: {
            user: '18230771271',
            pass: 'f8053a97efd69963b5173749ce378e19'
          }
        })
        socket.send(message)
      },
      // 登录返回
      LoginReturn(data) {
        if (data.code === 0) {
          this.Config.token = data.result.token
        } else {
          this.$message.error(data.errMsg)
        }
      },
      // 获取未读消息
      NotRead() {
        const message = JSON.stringify({
          call: 'chat.unread',
          token: this.Config.token
        })
        this.Socket.send(message)
      },
      // 未读消息返回
      NotReadReturn(data) {
        if (data.body) {
          console.log(data.body)
        }
      },
      // 获取历史记录
      History(to = 27) {
        this.Socket.send(JSON.stringify({
          call: 'chat.history',
          body: {
            type: 's', // 类型:g=群聊, s=单聊
            to: to, // uid or 群号
            limit: 20, // 拉取数量, 建议不超过20条
            offset: 0 // 偏移
          },
          token: this.Config.token
        }))
      },
      // 获取历史返回
      HistoryReturn(data) {
        if (data.result) {
          const list = []
          data.result.reverse() // 数组倒序
          var to_id = 0
          for (let i = 0; i < data.result.length; i++) {
            list.push(JSON.parse(data.result[i]))
            if (JSON.parse(data.result[i]).from !== this.MyInfo.id) {
              to_id = JSON.parse(data.result[i]).from
            }
          }
          this.getUser(to_id)
          this.messageList = list
          this.toBottom()
        }
      },
      // 获取用户信息
      getUser(uid) {
        this.Socket.send(JSON.stringify({
          call: 'user.get',
          body: {
            uid: uid
          },
          token: this.Config.token
        }))
      },
      // 获取用户信息返回
      getUserReturn(data) {
        var havaUser = false
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].id === data.result.id) {
            havaUser = true
          }
        }
        if (havaUser === false) {
          this.userList.push({
            id: data.result.id,
            avatar: data.result.avatar,
            nickname: data.result.nickname,
            unRead: false
          })
          localStorage.setItem('userList', JSON.stringify(this.userList))
        }
      },
      // 选择聊天对象
      changeUser(index) {
        this.Chating = true
        this.ChatUser = this.userList[index]
        this.userList[index].unRead = false
        this.History(this.ChatUser.id)
        this.setUserList()
      },
      // 获取未读历史
      NotHistory() {
        this.Socket.send(JSON.stringify({
          call: 'chat.unread_history',
          body: {
            type: 's', // 类型: g=群聊, s=单聊
            to: 27 // uid or 群号
          },
          token: this.Config.token
        }))
      },
      // 未读历史返回
      NotHistoryReturn(data) {
        console.log(data)
      },
      // 发送消息
      send() {
        var obj = document.getElementById('message')
        this.Socket.send(JSON.stringify({
            call: 'chat.send',
            body: {
              type: 'text',
              msg: obj.innerHTML,
              to: this.ChatUser.id,
              origin: 's'
            },
            token: this.Config.token
          }))
        this.messageList.push({
          type: 'text',
          msg: obj.innerHTML,
          to: this.ChatUser.id,
          origin: 's',
          from: this.MyInfo.id
        })
        this.toBottom()
        obj.innerHTML = ''
      },
      // 打开表情选择
      openEmoji() {
        if (this.EmojiShow) {
          this.EmojiShow = false
        } else {
          this.EmojiShow = true
        }
      },
      // 选择聊天表情
      getEmoji(index, e) {
        var html = "<img src='" +
          e.srcElement.src +
          "' alt='" +
          this.emojiList[index].alt +
          "'>"
        this.tempMessage += html
        var obj = document.getElementById('message')
        this.insertAtCursor(obj, html)
      },
      // 在光标位置插入html代码，如果dom没有获取到焦点则追加到最后
      insertAtCursor(dom, html) {
        if (dom !== document.activeElement) {
          dom.innerHTML = dom.innerHTML + html
          return
        }
        var sel, range
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0)
          range.deleteContents()
          var el = document.createElement('div')
          el.innerHTML = html
          var frag = document.createDocumentFragment()
          var node; var lastNode
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node)
          }
          range.insertNode(frag)
          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      },
      // 收到消息
      getMessage(data) {
        var have = false
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList.id === data.result.from) {
            have = true
          }
        }
        console.log(have)
        if (have === false) {
          this.getUser(data.result.from)
        }
        if (this.Chating) {
          if (this.ChatUser.id === data.result.from) {
            this.messageList.push(data.result)
          }
        }
        this.setUnRead(data.result.from)
      },
      // 设置未读消息
      setUnRead(uid) {
        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].id === uid) {
            if (this.Chating) {
              if (this.ChatUser.id !== uid) {
                this.userList[i].unRead = 1
              }
            } else {
              this.userList[i].unRead = 1
            }
          }
        }
        this.setUserList()
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

      .text {
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

                .img {
                  width: 160px;
                  /*height: 200px;*/
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
