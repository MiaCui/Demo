<template>
  <el-container class="continer">
    <el-header>
      <div>
        <span>
          WeTrading Market
        </span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Header class="side"></Header>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from './header'
export default {
  name: 'home2',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Header
  }
}
</script>

<style scoped>
.continer{
  height: 100%;
}
.el-header {
  background-color: #27434d;
  padding-left: 10px;
  padding-top: 13px;
  font-size: xx-large;
  color: white;
}
.el-aside{
  width: 200px;
  background-color: white;
}

.el-main{
  background-color: white;
}
</style>
