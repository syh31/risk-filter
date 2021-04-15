// vuex的核心管理对象模块

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 状态对象
const state = {}

// 包含多个更新state函数的对象
const mutations = {}

// 包含多个对应事件回调函数的对象
const actions = {}

// 包含多个getter计算属性函数的对象
const getters = {}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
