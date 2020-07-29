<template>
  <div class="main">
    <el-row type="flex">
      <el-col :span="18">
        <template v-if="sources.length > 0">
          <el-row>
            <el-col :span="10" v-for="(item, index) in sources" :key="index" :offset="index % 2 === 0 ? 0 : 2">
              <el-card :body-style="{ padding: '0px' }" class="my-card" @click.native="viewSource(item)">
                <div class="image-box"><img v-lazy="item.poster" class="image" /></div>

                <div class="info">
                  <span :title="item.name || ''">{{ item.name || '...' }}</span>
                  <div class="bottom clearfix">
                    <span class="des" :title="item.des || ''">{{ item.des || '...' }}</span>
                    <el-button type="text" class="button">{{ $t('main.clickView') }}</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <div style="text-align: center;">{{ $t('common.noData') }}</div>
        </template>
      </el-col>

      <el-col :span="6"><lango-login /></el-col>
    </el-row>

    <el-backtop />
  </div>
</template>

<script>
import axios from '@/http';
import langoLogin from '@/components/lango/Login';

export default {
  name: 'lango-main-home',
  components: {
    langoLogin
  },
  data() {
    return {
      sources: []
    };
  },
  created() {},
  mounted() {
    this.ajaxSources();
  },
  watch: {},
  methods: {
    ajaxSources() {
      axios
        .get(`/static/data/case.json?t=${Date.now()}`)
        .then(res => {
          const { data } = res || {};
          const { videoList } = data.zh || {}; // TODO 可国际化

          this.sources = (videoList && videoList.sort((a, b) => a.order - b.order)) || [];
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    viewSource(source) {
      const { name, des, poster, src, type } = source || {};
      const { href } = this.$router.resolve({
        path: '/view',
        query: {
          name,
          des,
          poster,
          src,
          type
        }
      });
      window.open(href, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  min-height: calc(100vh - 160px);
}
.my-card {
  margin-bottom: 30px;
  cursor: pointer;

  &:hover .image {
    transform: scale(1.1);
  }
}
.info {
  padding: 14px;
  width: 100%;
  height: 79px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
}
.image-box {
  width: 100%;
  height: 270px;
  overflow: hidden;
}
.image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
}
.bottom {
  margin-top: 13px;
  line-height: 16px;
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
  display: inline-block;
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #999;
}
.button {
  padding: 0;
  float: right;
}
</style>
