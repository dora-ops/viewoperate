export const connected = state => state.socketConnectedFlag
export const sources = state => state.sources
export const toolList = state => state.toolList
export const services = state => state.services
export const getServiceById = (state) => (id) => {
  return state.services.find(service => service.servName === id)
}
export const getServIndex = state => id => {
  var servIndex;
  state.services.forEach(function (service, index) {
    if (id === service.servName) {
      servIndex = index;
    }
  });
  return servIndex;
}
export const formOrInfo = state => state.formOrInfo
export const entities = state => state.entities
