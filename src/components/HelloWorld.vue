<template>
  <div class="hello">
    <br> 根模块测试： <br>
    商品数量: {{this.$store.state.num}} 个<br>
    商品单价: 10 元<br>
    订单金额: {{this.$store.getters.getPrice}} 元<br>
    <button @click="$store.commit('changeNum',5)">同步更新：数量+5</button>
    <button @click="$store.dispatch('changeNum',-5)">异步更新：数量-5</button>

    <br> 子模块测试： <br>
    A 模块-商品数量: {{this.$store.state.moduleA.num}} 个<br>
    B 模块-商品数量: {{this.$store.state.moduleB.num}} 个<br>
    C 模块-商品数量: {{this.$store.state.moduleA.moduleC.num}} 个<br>
    <button @click="$store.commit('moduleA/changeNum',5)">A 模块-同步更新：数量+5</button>
    <button @click="$store.commit('moduleB/changeNum',5)">B 模块-同步更新：数量+5</button>
    <button @click="$store.commit('moduleA/moduleC/changeNum',5)">C 模块-同步更新：数量+5</button>


  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    console.log('home mounted:如果有值就代表传递下去了', this.$store);

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
