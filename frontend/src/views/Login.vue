<template>
  <div class="login">
    <h1>This is Login Page</h1>
    <div class="btn">
      <el-input v-model="email" placeholder="请输入邮箱"></el-input>
      <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
    </div>
    <div>
      <el-button @click="toRegister">去注册</el-button>
      <el-button type="primary" @click="Login">登录</el-button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '1@qq.com',
      password: '123'
    }
  },
  methods: {
    toRegister() {
      this.$router.push('/signin')
    },
    Login() {
      axios.post('http://127.0.0.1:8088/v2/users/login',{
        email: this.email,
        password: this.password
      }).then(res => {
        this.SetJwtToken(res.data.token)
        this.$message({
          message:"登录成功",
          type: 'success'
        });
        this.$router.push('/');
      }).catch(err => {
        console.log(err)
        this.$message({
          message: "登录失败",
          type: "error"
        })
      })
    }
    ,
    SetJwtToken(token){
      document.cookie = "jwt="+token
    }
  }

}
</script>

<style scoped>
.btn {
  padding: 20px;
}
</style>