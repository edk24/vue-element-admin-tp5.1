
const getDefaultState = () => {
    return {
        // 是否打开连接
        isOpen: false,
        // websocket
        socket: null,
        // 心跳间隔
        timeout: 10000,
        // 心跳事件
        interval: null,
        // 重连次数
        connectNum: 0,
        // ws token
        token: '',
        // 当前聊天场景
        currentToUser: {
            id: 1,
            name: '',
            avatar: '',
            type: 's' // s=单聊, g群聊
        },
        // 当前列表历史
        wsHistory: [

        ],
        // 我的信息
        wsUserInfo: {
            addr: '',
            avatar: '',
            driver: '',
            fd: 0,
            id: 0,
            ip: '',
            nickName: '未登录',
            token: ''
        },
        // 消息回调
        wsCallback: null
    }
}

const state = getDefaultState()

const mutations = {
    // 关闭连接
    wsClose(state) {
        if (state.isOpen) {
            state.isOpen = false
            state.socket.close()
        }
    },
    // 登录
    wsLogin(state, uid) {
        this.dispatch('chat/SendRaw', {
            call: 'login.uid',
            data: {
                uid: uid
            }
        })
    },
    // message 回调
    set_message_callback(state, callback) {
        state.wsCallback = callback
    }
}

const actions = {
    initWs({ commit, state, rootState }) {
        console.log('检查是否已链接')
        if (state.isOpen) return // 防止重复连接
        // 检查网络是否可用
        const that = this
        // 连接
        console.log('开始ws链接')
        const wsurl = 'ws://121.36.42.208:9502'
        state.socket = new WebSocket(wsurl)
        console.log(state.socket)
        if (!state.socket) { return }

        // 监听开启
        state.socket.onopen = () => {
            console.log('ws连接成功')
            // 将连接状态设为已连接
            state.isOpen = true

            // 开启心跳
            state.interval = setInterval(() => {
                // 发送心跳
                if (state.isOpen) {
                    try {
                        state.socket.send('ping')
                    } catch (err) {
                        console.log('心跳发送失败了 ...执行重连', err)
                        // that.$message.warring('正在尝试重新链接第' + (state.connectNum + 1) + '次')
                        state.isOpen = false
                        // 执行重连
                        that.dispatch('chat/reConnect')
                    }

                    // if (!bool) {
                    
                    // }
                }
            }, state.timeout)
        }

        // 监听信息
        state.socket.onmessage = (e) => {
            if (e.data === 'pong') { return }

            const pack = JSON.parse(e.data)
            if (typeof pack !== 'object') { return }

            switch (pack.call) {
                case 'login.uid': // 登录
                    state.token = pack.result.token
                    state.wsUserInfo = pack.result
                    break

                case 'chat.recv':
                    // TODO: play muisc
                    break
            }

            if (state.wsCallback !== null) {
                state.wsCallback(pack)
            }
        }
        // 监听关闭
        state.socket.onclose = () => {
            state.isOpen = false
            state.socket = false
            // 清除定时器
            clearTimeout(state.interval)
            state.interval = null
        }
        // 监听错误
        state.socket.onerror = (e) => {
            state.isOpen = false
            state.socket = false
        }
    },

    reConnect({ commit, state }) {
        if (state.connectNum < 20) {
            state.timer = setTimeout(() => {
                this.dispatch('chat/initWs')
            }, 3000)
            state.connectNum += 1
        } else if (state._connectNum < 50) {
            state.timer = setTimeout(() => {
                this.dispatch('chat/initWs')
            }, 10000)
            state.connectNum += 1
        } else {
            state.timer = setTimeout(() => {
                this.dispatch('chat/initWs')
            }, 450000)
            state.connectNum += 1
        }
    },

    // 发送消息
    SendMsg({ commit, state }, payload) {
        var data = {
            to: payload.to,
            origin: state.currentToUser.type,
            type: payload.type,
            msg: payload.msg
        }
        this.dispatch('chat/SendRaw', { call: 'chat.send', data: data })
    },

    // 发送体
    SendRaw({ commit, state }, data) {
        try {
            console.log(data)
            const message = {
                call: data.call,
                body: data.data,
                token: state.token
            }
            const msgText = JSON.stringify(message)
            console.log(typeof state.socket)
            if (state.socket && state.isOpen) {
                state.socket.send(msgText)
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

