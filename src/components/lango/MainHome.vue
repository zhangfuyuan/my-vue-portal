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

      <el-col :span="6" class="fixed-wrap">
        <el-card class="fixed">
          <template v-if="!isLogin || !loginInfo">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto" class="rule-form" inline label-position="top" :status-icon="false">
              <el-form-item :label="$t('main.account')" prop="account" class="rule-form-item">
                <el-input v-model="ruleForm.account" :placeholder="$t('main.enterAccount')" @keyup.enter.native="submitForm('ruleForm')" />
              </el-form-item>
              <el-form-item :label="$t('main.password')" prop="password" class="rule-form-item">
                <el-input type="password" v-model="ruleForm.password" :placeholder="$t('main.enterPassword')" @keyup.enter.native="submitForm('ruleForm')" />
              </el-form-item>
              <el-form-item :label="$t('main.code')" prop="code" class="rule-form-item">
                <div class="rule-form-item-code">
                  <el-input v-model="ruleForm.code" :placeholder="$t('main.enterCode')" @keyup.enter.native="submitForm('ruleForm')" />
                  <img
                    src="//lango-tech.cn/apm-web/servlet/validateCodeServlet"
                    alt="code"
                    ref="code"
                    @click="$refs.code.src = '//lango-tech.cn/apm-web/servlet/validateCodeServlet?t=' + Date.now()"
                  />
                </div>
              </el-form-item>
              <el-form-item class="rule-form-item rule-form-btns">
                <el-button type="primary" class="rule-form-item-btn" :loading="loginLoading" @click="submitForm('ruleForm')">{{ $t('main.login') }}</el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <div class="login-info">
              <div class="welcome">{{ $t('main.welcome') }}</div>

              <div class="info2">
                <div class="info-avatar"><img src="//lango-tech.cn/apm-web/static/images/homePage/user_small.png" alt="avatar" /></div>

                <div class="info-name">
                  <div class="info-name-account">{{ loginInfo.account }}</div>
                  <div class="info-name-nickname">{{ loginInfo.nickname }}</div>
                </div>
              </div>

              <div class="access">
                <p>{{ $t('main.accessPlatformsTips') }} :</p>
                <p>
                  <el-link type="primary" href="//lango-tech.cn/apm-web/a" target="_blank">{{ $t('main.accessApmTips') }}</el-link>
                </p>
              </div>

              <el-button class="logout" @click="logoutHandle">{{ $t('main.logout') }}</el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-backtop />
  </div>
</template>

<script>
import axios from '@/http';

export default {
  name: 'lango-main-home',
  data() {
    const validateAccount = (rule, value, callback) => {
      value ? callback() : callback(new Error(this.$t('main.enterAccount')));
    };
    const validatePassword = (rule, value, callback) => {
      value ? callback() : callback(new Error(this.$t('main.enterPassword')));
    };
    const validateCode = (rule, value, callback) => {
      value ? callback() : callback(new Error(this.$t('main.enterCode')));
    };

    return {
      sources: [],
      ruleForm: {
        account: '',
        password: '',
        code: ''
      },
      rules: {
        account: { validator: validateAccount, trigger: 'blur' },
        password: { validator: validatePassword, trigger: 'blur' },
        code: { validator: validateCode, trigger: 'blur' }
      },
      loginLoading: false,
      isLogin: false,
      loginInfo: null
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
        .get(`/static/data/home.json?t=${Date.now()}`)
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loginLoading = true;
          setTimeout(() => {
            this.loginLoading = false;
            this.isLogin = true;
            this.loginInfo = {
              account: 'APM账号',
              nickname: 'APM昵称'
            };
            this.ruleForm = {
              account: '',
              password: '',
              code: ''
            };
            this.$message.error(this.$t('main.loginErrTips1'));
            this.$message.error(this.$t('main.loginErrTips2'));
          }, 1000);
        } else {
          return false;
        }
      });
    },
    logoutHandle() {
      this.isLogin = false;
      this.loginInfo = null;
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
.fixed {
  position: fixed;
  width: 290px;
  box-sizing: border-box;
}
.rule-form,
.rule-form-item,
.rule-form-item-btn,
.logout {
  width: 100%;
}
.rule-form-item-code {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    margin-left: 5px;
    width: 180px;
    height: 40px;
    cursor: pointer;
  }
}
.rule-form-btns {
  margin-top: 17px;
  margin-bottom: 0;
}
.login-info {
  min-height: 309px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .welcome {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .info2 {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .info-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #464646;
  }

  .info-name {
    max-width: 150px;
    text-align: center;
  }

  .info-name-account {
    color: #606266;
    font-size: 15px;
    margin-bottom: 5px;
  }

  .info-name-nickname {
    color: #909399;
  }

  .access {
    text-align: center;
    color: #303133;
  }
}

@media screen and (max-width: 1280px) {
  .fixed {
    right: 0;
  }
}
</style>
