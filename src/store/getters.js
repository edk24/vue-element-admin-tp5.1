const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  type: state => state.user.type,
  id: state => state.user.id,
  routerList: state => state.user.RouterList,
  roles: state => state.user.roles
}
export default getters
