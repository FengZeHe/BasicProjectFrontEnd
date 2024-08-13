<template>
  <div class="viewArticle">
    <h1>这里是view Article页面</h1>
    <el-button @click="Hi">Hi</el-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'ViewArticle',
  methods: {
    Hi() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/sys/hi", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          this.$message({
            message: res.data,
            type: 'success'
          });
        }).catch(err => {
          console.log(err)
          this.$message.error('错误  '+err.message);
        })
      }
    },
    getToken() {
      let cookieValue = null;
      document.cookie.split('; ').forEach((item) => {
        let [n, v] = item.trim().split('=');
        if (n === 'jwt') {
          cookieValue = v;
        }
      });
      return cookieValue;
    }
  }
}

</script>

<style scoped>

</style>