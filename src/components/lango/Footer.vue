<template>
  <div class="footer">
    <a :href="href" class="copyrightHref" target="_blank">{{ copyright }}</a>
  </div>
</template>

<script>
import axios from '@/http';

export default {
  name: 'lango-footer',
  data() {
    return {
      copyright: 'Copyright ©lango-tech.com. All Rights Reserved. 粤ICP备14024048号 | 朗国电子科技有限公司',
      href: '//www.beian.miit.gov.cn'
    };
  },
  mounted() {
    this.ajaxCopyright(this.$i18n.locale);
  },
  watch: {
    $route(route) {
      this.ajaxCopyright(route.query.locale || this.$i18n.locale);
    }
  },
  methods: {
    ajaxCopyright(locale) {
      axios
        .get(`/static/data/footer.json?t=${Date.now()}`)
        .then(res => {
          const { data } = res || {};
          const { copyright, href } = data[locale === 'zh' ? 'zh' : 'en'] || {};

          copyright && (this.copyright = copyright);
          href && (this.href = href);
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #545c64;
  text-align: center;
  color: #fff;
}

.copyrightHref {
  color: #fff;
  text-decoration: none;

  &:visited,
  &:hover,
  &:active {
    color: #fff;
    text-decoration: none;
  }
}
</style>
