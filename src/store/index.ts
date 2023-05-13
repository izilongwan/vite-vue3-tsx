import { RouteRecord } from 'vue-router'
import { createStore } from 'vuex'
import home from './home'
import login from './login'

export const SET_KEY_VALUE = 'SET_KEY_VALUE'

interface Payload {
  key: string
  value: any
}

const store = createStore({
  state() {
    return {
      routes: [] as RouteRecord[],
    }
  },
  mutations: {
    [SET_KEY_VALUE](state, payload: Payload) {
      const { key, value } = payload
      state[key as keyof typeof state] = value
    }
  },
  actions: {
    [SET_KEY_VALUE]({ commit }, payload: Payload) {
      commit(SET_KEY_VALUE, payload)
    }
  },
  modules: {
    home,
    login
  }
})

export default store
