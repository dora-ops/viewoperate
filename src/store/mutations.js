import * as types from './mutation-types'

const mutations = {
  [types.SOCKET_CONNECT](state, connected) {
    // console.log('in')
    state.socketConnectedFlag = connected
    // console.log(state.socketConnectedFlag === true)
  },
  [types.INIT_SOURCES](state, list) {
    state.sources = list
  },
  [types.SET_TOOLLIST](state, toolList) {
    state.toolList = toolList
  },
  [types.SET_SERVICES](state, services) {
    state.services = services
  },
  [types.DEL_SERVICE](state, index) {
    state.services.splice(index, 1);
  },
  // servDetailMode
  [types.SET_SDMODE](state, formOrInfo) {
    state.formOrInfo = formOrInfo
  },
  [types.SET_ENTITIES](state, entities) {
    state.entities = entities
  },
  // 把entity的名字推入相应的service的sources属性数组中
  [types.PUSH_SOURCE](state, payload) {
    state.services[payload.servIndex].sources.push(payload.entity)
  }
}

export default mutations