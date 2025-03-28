<template>
  <div class="signin-container">
    <el-card class="signin-card">
      <div class="signin-header">
        <img src="../assets/logo.png" alt="Logo" class="signin-logo">
        <h2>用户注册</h2>
      </div>
      <el-form :model="registerForm" :rules="rules" ref="registerForm" class="signin-form">
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请确认密码">
          </el-input>
        </el-form-item>
        <div class="signin-actions">
          <el-button type="text" @click="toLogin">已有账号？立即登录</el-button>
          <el-button type="primary" :loading="loading" @click="handleRegister">注册</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignIn',
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
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      rules: {
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          axios.post('http://127.0.0.1:8088/v2/users/register', {
            email: this.registerForm.email,
            password: this.registerForm.password
          }).then(() => {
            this.$message({
              message: '注册成功，请登录',
              type: 'success'
            });
            this.$router.push('/login');
          }).catch(err => {
            console.error(err);
            this.$message({
              message: '注册失败：' + (err.response?.data?.message || '请稍后重试'),
              type: 'error'
            });
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.signin-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color) 0%, #1989fa 100%);
}

.signin-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.signin-header {
  text-align: center;
  margin-bottom: 30px;
}

.signin-logo {
  width: 84px;
  height: 84px;
  margin-bottom: 20px;
}

.signin-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
}

.signin-form {
  margin-top: 20px;
}

.signin-actions {
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