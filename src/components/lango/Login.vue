<template>
  <div class="login">
    <el-card class="fixed">
      <el-button type="primary" style="width: 100%;" @click="linkHandle($serverIp + '/apm-web/a')">访问 APM</el-button>

      <!-- <template v-if="!isLogin || !loginInfo">
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
                :src="$serverIp + '/apm-web/servlet/validateCodeServlet?r=' + $route.name"
                alt="code"
                ref="code"
                @click="$refs.code.src = $serverIp + '/apm-web/servlet/validateCodeServlet?t=' + Date.now()"
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
            <div class="info-avatar"><img :src="$serverIp + '/apm-web/static/images/homePage/user_small.png'" alt="avatar" /></div>

            <div class="info-name">
              <div class="info-name-account">{{ loginInfo.account }}</div>
              <div class="info-name-nickname">{{ loginInfo.nickname }}</div>
            </div>
          </div>

          <div class="access">
            <p>{{ $t('main.accessPlatformsTips') }} :</p>
            <p>
              <el-link type="primary" :href="$serverIp + '/apm-web/a'" target="_blank">{{ $t('main.accessApmTips') }}</el-link>
            </p>
          </div>

          <el-button class="logout" @click="logoutHandle">{{ $t('main.logout') }}</el-button>
        </div>
      </template> -->
    </el-card>
  </div>
</template>

<script>
import axios from '@/http';

export default {
  name: 'lango-login',
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
      loginInfo: null,
      publicKeyJson: {
        isLandingEncryption: false,
        exponent: '',
        modulus: ''
      }
    };
  },
  created() {
    // this.ajaxIsLogin();
  },
  mounted() {},
  watch: {},
  methods: {
    ajaxIsLogin() {
      axios.get(`${this.$serverIp}/apm-web/f/common/isLogin`).then(res => {
        let { data } = res || {};

        if (data === 1) {
          // 已登录
          this.isLogin = true;
          // let { status } = data;

          // if (status !== 'fail') {
          //   this.isLogin = true;
          //   this.loginInfo = {
          //     account: 'APM账号',
          //     nickname: 'APM昵称'
          //   };
          // }
        } else {
          // 未登录
          this.ajaxKeyPair();
        }
      });
    },
    ajaxKeyPair() {
      axios.post(`${this.$serverIp}/apm-web/a/keyPair`).then(res => {
        let { data } = res || {};

        if (data) {
          const { modulus, exponent } = data;

          if (modulus && exponent) {
            this.publicKeyJson.exponent = exponent;
            this.publicKeyJson.modulus = modulus;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { account, password, code } = this.ruleForm;
          const { isLandingEncryption, exponent, modulus } = this.publicKeyJson;

          if (isLandingEncryption && exponent && modulus) {
            password = RSAUtils.encryptedString(RSAUtils.getKeyPair(exponent, '', modulus), password);
          }

          this.loginLoading = true;
          axios
            .post(`${this.$serverIp}/apm-web/a/login`, {
              username: account,
              password,
              validateCode: code
            })
            .then(res => {
              let { data } = res || {};
              console.log(8126, res.request.responseURL);

              if (data) {
                let { status } = data;

                if (status !== 'fail') {
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
                } else if (status === 'error1') {
                  //TODO 账号或密码错误
                  this.$message.error(this.$t('main.loginErrTips1'));
                } else if (status === 'error2') {
                  //TODO 验证码错误
                  this.$message.error(this.$t('main.loginErrTips2'));
                } else {
                  this.$message.error(this.$t('common.requestFailed'));
                }
              } else {
                this.$message.error(this.$t('common.requestFailed'));
              }

              this.loginLoading = false;
            })
            .catch(err => {
              this.$message.error(this.$t('common.requestFailed'));
              this.loginLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    logoutHandle() {
      axios
        .get(`${this.$serverIp}/apm-web/a/logout`)
        .then(res => {
          let { data } = res || {};

          if (data) {
            let { status } = data;

            if (status !== 'fail') {
              this.isLogin = false;
              this.loginInfo = null;
            } else {
              this.$message.error(this.$t('common.requestFailed'));
            }
          }
        })
        .catch(err => {
          this.$message.error(this.$t('common.requestFailed'));
        });
    },
    linkHandle(link, name) {
      window.open(link, name || '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
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
