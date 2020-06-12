<template>
  <div class="header">
    <el-row class="menu" type="flex">
      <el-col :span="4"><img src="../../assets/img/logo.png" alt="logo" /></el-col>

      <!-- <el-col :span="12" :offset="4">
        <el-menu mode="horizontal" :default-active="activeIndex" @select="selectHandle">
          <el-menu-item index="apm" class="my-el-menu-item">{{ $t('main.apm') }}</el-menu-item>
          <el-menu-item index="guard" class="my-el-menu-item">{{ $t('main.guard') }}</el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="4">
        <el-select v-model="locale" size="small" @change="changeHandle">
          <el-option v-for="item in localeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'lango-header',
  data() {
    return {
      activeIndex: this.$route.name === 'guard' ? 'guard' : 'apm',
      locale: this.$i18n.locale,
      localeOptions: [
        {
          value: 'zh',
          label: '中文（简体）'
        },
        {
          value: 'en',
          label: 'English'
        }
      ]
    };
  },
  watch: {
    $route(route) {
      const { name, query } = route;
      const { locale } = query || {};

      this.activeIndex = name === 'guard' ? 'guard' : 'apm';

      if (locale && locale !== this.$i18n.locale) {
        this.locale = locale;
        this.$i18n.locale = locale;
        localStorage.setItem('locale', locale);
      }
    }
  },
  methods: {
    selectHandle(key) {
      this.activeIndex = key;
      this.$router.push({ path: key, query: { locale: this.locale } });
    },
    changeHandle(locale) {
      this.locale = locale;
      this.$i18n.locale = locale;
      localStorage.setItem('locale', locale);
      this.$router.push({ path: this.activeIndex, query: { locale } });
    }
  }
};
</script>

<style>
.header .el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
<style lang="less" scoped>
.header,
.menu {
  height: 100%;
}
.menu {
  align-items: center;
}
.my-el-menu-item {
  font-size: 16px;
}
</style>
