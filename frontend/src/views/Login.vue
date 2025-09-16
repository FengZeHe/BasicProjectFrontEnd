<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <img src="../assets/logo.png" alt="Logo" class="login-logo">
        <h2>欢迎登录</h2>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin">
          </el-input>
        </el-form-item>
        <div class="login-actions">
          <el-button type="text" @click="toRegister">还没有账号？立即注册</el-button>
          <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'));
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          callback(new Error('请输入有效的邮箱地址'));
        } else {
          callback();
        }
      }
    };
    return {
      loginForm: {
        email: '1@qq.com',
        password: '123'
      },
      loading: false,
      rules: {
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    toRegister() {
      this.$router.push('/signin');
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          axios.post('http://127.0.0.1:8088/v2/users/login', {
            email: this.loginForm.email,
            password: this.loginForm.password
          }).then(res => {
            this.SetJwtToken(res.data.token);
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            this.$router.push('/');
          }).catch(err => {
            console.error(err);
            this.$message({
              message: '登录失败：' + (err.response?.data?.message || '请检查账号密码'),
              type: 'error'
            });
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    SetJwtToken(token) {
      document.cookie = 'jwt=' + token;
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 84px;
  height: 84px;
  margin-bottom: 20px;
}

.login-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  margin-top: 20px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.el-input {
  margin-bottom: 20px;
}

.el-button--text {
  padding: 0;
  font-size: 14px;
}

.el-button--primary {
  width: 120px;
}
</style>