<template>
  <div id="app">
    <el-container>
      <el-header id="header"><lango-header /></el-header>
      <el-main id="main"><router-view /></el-main>
      <el-footer id="footer"><lango-footer /></el-footer>
    </el-container>
  </div>
</template>

<script>
import langoHeader from '@/components/lango/Header';
import langoFooter from '@/components/lango/Footer';

export default {
  name: 'App',
  components: {
    langoHeader,
    langoFooter
  }
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 14px;
  color: #606266;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  -moz-osx-font-smoothing: grayscale;
}
#header,
#main {
  margin: 0 auto;
  width: 1200px;
}
#footer {
  padding: 0;
  width: 100%;
  min-width: 1200px;
}
</style>
