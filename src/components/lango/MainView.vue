<template>
  <div class="main">
    <el-card>
      <div slot="header" class="title clearfix">
        <i class="el-icon-video-play" />
        <span class="title">{{ source.name }}</span>
      </div>

      <div class="player"><video ref="videoPlayer" class="video-js vjs-theme-sea" /></div>

      <p class="des">{{ source.des }}</p>
    </el-card>
  </div>
</template>

<script>
import videojs from 'video.js';
import videojs_zhCN from 'video.js/dist/lang/zh-CN.json';
import videojs_en from 'video.js/dist/lang/en.json';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/sea/index.css';

export default {
  name: 'lango-main',
  data() {
    return {
      player: null,
      source: {}
    };
  },
  created() {},
  mounted() {
    const { query = {} } = this.$route;
    const { poster, src, type } = query;

    this.source = query;
    this.player = videojs(this.$refs.videoPlayer, {
      controls: true,
      muted: false,
      preload: 'auto',
      language: this.$i18n.locale,
      // fluid: true,
      languages: {
        zh: videojs_zhCN,
        en: videojs_en
      },
      poster,
      sources: [
        {
          src,
          type
        }
      ]
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  watch: {},
  methods: {}
};
</script>

<style lang="less" scoped>
.main {
  min-height: calc(100vh - 160px);
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.player {
  width: 100%;
  height: 560px;
}

.video-js {
  width: 100%;
  height: 100%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.des {
  color: #909399;
}
</style>
