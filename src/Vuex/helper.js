// src/vuex/ helpers.js

/**
 * 根据指定状态名，返回状态对象
 * @param {*} stateArr 指定需要返回的状态名
 * @returns 状态对象
 */
export function mapState(stateArr) {
  let obj = {};
  for (let i = 0; i < stateArr.length; i++) {
    let stateName = stateArr[i];
    obj[stateName] = function () {
      // 从 $store.state 中查找状态名
      return this.$store.state[stateName];
    };
    }
    console.log('111');
    
  return obj;
}
