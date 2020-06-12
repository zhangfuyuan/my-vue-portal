<template>
  <div class="main">
    <el-card class="part">
      <div slot="header" class="title">
        <i class="el-icon-video-play" />
        <span class="title">{{ $t('main.videoTutorial') }}</span>
      </div>

      <el-row type="flex">
        <el-col :span="18">
          <div class="player" :style="{ height: `${playerHeight}px` }"><video ref="videoPlayer" class="video-js  vjs-theme-sea" /></div>
        </el-col>

        <el-col :span="6">
          <div class="list" :style="{ height: `${playerHeight}px` }">
            <template v-if="sources.length > 0">
              <div v-for="(item, index) in sources" :key="index" :class="['list-btn', { active: activeSource.sort === item.sort }]" :title="item.name" @click="changeSource(item)">
                {{ item.name }}
              </div>
            </template>
            <template v-else>
              <div style="text-align: center;">{{ $t('common.noData') }}</div>
            </template>
          </div>
        </el-col>
      </el-row>

      <p class="name">{{ (activeSource && activeSource.name) || '' }}</p>
      <p class="des">{{ (activeSource && activeSource.des) || '' }}</p>
    </el-card>
  </div>
</template>

<script>
import videojs from 'video.js';
import videojs_zhCN from 'video.js/dist/lang/zh-CN.json';
import videojs_en from 'video.js/dist/lang/en.json';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/sea/index.css';
import axios from '@/http';

export default {
  name: 'lango-main',
  data() {
    return {
      player: null,
      playerHeight: 560,
      sources: [],
      activeSource: {}
    };
  },
  created() {},
  mounted() {
    const { name } = this.$route;
    const locale = this.$i18n.locale;

    this.player = videojs(this.$refs.videoPlayer, {
      controls: true,
      muted: false,
      preload: 'auto',
      language: locale,
      fluid: true,
      languages: {
        zh: {
          ...videojs_zhCN,
          'Picture-in-Picture': '画中画'
        },
        en: videojs_en
      }
    });
    this.ajaxSources(name, locale);
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  watch: {
    $route(route) {
      const { name, query } = route;
      const { locale } = query || {};

      this.ajaxSources(name, locale || this.$i18n.locale);
    }
  },
  methods: {
    ajaxSources(name, locale) {
      axios
        .get(`/static/data/${name === 'guard' ? 'guard' : 'apm'}/${locale === 'zh' ? 'zh' : 'en'}/index.json?t=${Date.now()}`)
        .then(res => {
          const { data } = res || {};
          const { sources = [] } = data;

          this.sources = (sources && sources.sort((a, b) => a.sort - b.sort)) || [];
          this.changeSource(sources[0]);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    changeSource(activeSource) {
      this.activeSource = activeSource || {};
      const { src, type } = this.activeSource;
      this.player.src({ src, type });
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  min-height: calc(100vh - 160px);
}

.title {
  font-size: 15px;
  font-weight: bold;
}

.player {
  width: 100%;
}

.video-js {
  width: 100%;
  height: 100%;
}

.list {
  margin-left: 20px;
  overflow-y: auto;
  border-left: 1px solid #dcdfe6;
}

.list-btn {
  padding: 8px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;

  &:hover,
  &:active,
  &.active {
    color: #409eff;
    background-color: #ecf5ff;
  }
}

.name {
  font-size: 18px;
  color: #303133;
}

.des {
  margin: 0;
  color: #909399;
}
</style>
