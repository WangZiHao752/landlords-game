import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [persistedState({
    reducer(val){
      return {
        // 只储存state中的count
        uid: val.uid
      }
    }
  })],
  state: {
    socket:null,
    uid:"",
    roomid:"",
  },
  mutations: {
    saveUid(state,payload){
      state.uid = payload;
    },
    setRoomId(state,payload){
      state.roomid = payload;
    },
    socketInit(state,payload){
      state.socket = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
