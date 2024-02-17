// src/store/index.js

import Vue from "vue";
import Vuex from "vuex";

// 引入两个测试模块
import moduleA from './moduleA'
import moduleB from './moduleB'
// 引入 Vuex 日志插件 logger
import logger from 'vuex/dist/logger'
Vue.use(Vuex);

// vuex-persists 插件实现
function persists() {
  return function (store) {
    console.log("----- persists 插件执行 -----")
    // 取出本地存储的状态
    let data = localStorage.getItem('VUEX:STATE');
    if (data) {
      console.log("----- 存在本地状态，同步至 Vuex -----")
      // 如果存在，使用本地状态替换 Vuex 中的状态
      store.replaceState(JSON.parse(data));
    }
    // subscribe：由 vuex 提供的订阅方法，当触发 mutation 方法时被执行;
    store.subscribe((mutation, state) => {
      console.log("----- 进入 store.subscribe -----")
      localStorage.setItem('VUEX:STATE', JSON.stringify(state));
    })
  }
}

const store = new Vuex.Store({
  state: {
    num: 10,
  },
  getters: {
    getPrice(state) {
      return state.num * 10;
    },
  },
  // 同步更新状态
  mutations: {
    changeNum(state, payload) {
      state.num += payload;
    },
  },
  // 可执行异步操作，通过 mutations 更新状态
  actions: {
    changeNum({ commit }, payload) {
      setTimeout(() => {
        commit("changeNum", payload);
      }, 1000);
    },
  },
  // 在根模块下注册子模块 A、B
  modules: {
    moduleA,
    moduleB,
  },
  plugins: [
    persists(),
    logger()
  ]
});
export default store;
