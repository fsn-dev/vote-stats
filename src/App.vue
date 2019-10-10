<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <starChart/>
  </div>
</template>

<script>
import starChart from './components/starChart.vue'

export default {
  name: 'app',
  components: {
    starChart
  },
  mounted () {
    document.title = this.$$.config.title
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
