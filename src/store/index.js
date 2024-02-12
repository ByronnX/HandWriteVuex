import Vue from "vue";
// import Vuex from '../Vuex'
import Vuex from "vuex";

import moduleA from "./moduleA";
import moduleB from "./moduleB";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
        count: 0,
      num:1
  },
  getters: {
    count1(state) {
      console.log("缓存了嘛？");

      return state.count + 100;
    },
    count2(state) {
      return state.count + 200;
    },
  },
  mutations: {
    increment(state, data) {
      state.count += data;
    },
    decrement(state, data) {
      state.count -= data;
      },
      changeNum(state, data) {
        state.num += data
    }
  },
  actions: {
    increment(context, data) {
      setTimeout(() => {
        context.commit("increment", data);
      }, 1500);
    },
  },
  modules: {
    moduleA,
    moduleB,
  },
});
export default store;
