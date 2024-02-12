<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
   <h2>{{ $store.state.count }}</h2>
   <button @click="$store.state.count = 999">点击</button>
   <h1>getters:{{ $store.getters.count1 }}</h1>
   <h1>getters:{{ $store.getters.count1 }}</h1>
   <h1>getters:{{ $store.getters.count2 }}</h1>
   <button @click="$store.commit('increment',1)">同步点击+1</button>
   <button @click="$store.commit('decrement',1)">同步点击-1</button>
   <button @click="$store.dispatch('increment',20)">异步点击+20</button>
   <h1>本体的数据：{{ this.$store.state.num }}</h1>
   <h1>模块化的数据：{{ this.$store.state.moduleA.num }}</h1>
   <h1>模块化的数据：{{ this.$store.state.moduleB.num }}</h1>
   <button @click="$store.commit('moduleA/changeNum',10)">模块化的修改</button>
   <button @click="$store.commit('moduleB/changeNum', 20)">模块化的修改</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    // console.log('home mounted:如果有值就代表传递下去了',this.$store);
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
