const state = {
  token: '',
  id: '',
  displayname: null,
  email: null,
  isAuthenticated: false,
  capabilities: [],
  version: {},
  groups: [],
  userReady: false
}

const actions = {
  clearUserState(context) {
    if (context.state.id === '') {
      return
    }

    // reset user to default state
    context.commit('SET_USER', state)
    // reset capabilities to default state
    context.commit('SET_CAPABILITIES', { capabilities: null, version: null })
    // set userReady to false
    context.commit('SET_USER_READY', false)
  }
}

const mutations = {
  SET_USER(state, user) {
    state.displayname = user.displayname
    state.id = user.id
    state.username = user.username
    state.email = user.email
    state.isAuthenticated = user.isAuthenticated
    state.token = user.token
    state.groups = user.groups
  },
  SET_CAPABILITIES(state, data) {
    state.capabilities = data.capabilities
    state.version = data.version
  },
  UPDATE_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_READY(state, ready) {
    state.userReady = ready
  }
}

const getters = {
  isAuthenticated: state => {
    return state.isAuthenticated
  },
  getToken: state => {
    return state.token
  },
  user: state => {
    return state
  },
  capabilities: state => {
    return state.capabilities
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
