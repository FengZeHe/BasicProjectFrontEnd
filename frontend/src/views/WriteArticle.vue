<template>
  <div class="WriteArticle">
    <h1>This is Write Article Page</h1>
    <br>
    <h3>标题</h3>
    <el-input v-model="Article.title" placeholder="请输入标题"></el-input>
    <h3>文章正文 </h3>
    <el-input
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 30}"
        placeholder="请输入内容"
        v-model="Article.content">
    </el-input>

    <el-row>
      <el-button @click="handleSave('0')">保存</el-button>
      <el-button type="primary" @click="handleSave('1')">保存并发表</el-button>
    </el-row>

  </div>
</template>

<script>
import axios from "@/axios"

export default {
  data() {
    return {
      Article: {},
      isNew: false,
    }
  },
  methods: {
    handleSave(status) {
      if (this.isNew === true) {
        this.addArticle(status)
      } else {
        this.updateArticle(status)
      }
    },
    addArticle(status) {
      const data = {
        "authorName": this.Article.authorName,
        "title": this.Article.title,
        "content": this.Article.content,
        "status": status,
      }
      axios.post("/draft/addArticle", data).then(response => {
        console.log(response)
        this.showSuccessMsg("保存成功")
        console.log("发表成功了准备跳转！！！")
        if (status === 0) {
          this.$router.push("/draftList");
        } else {
          this.$router.push('/');
        }

      }).catch(error => {
        console.log(error)
        this.showErrorMsg('保存失败')
      })

    },
    updateArticle(status) {
      const data = {
        "draftID": this.Article.id,
        "authorID": this.Article.authorID,
        "title": this.Article.title,
        "content": this.Article.content,
        "status": status // 0 未发表， 1已发表
      }
      axios.post("/draft/updateArticle", data).then(response => {
        console.log("res", response.data.data)
        var msg = response.data.data
        this.showSuccessMsg(msg)
        if (status === 0 || status === "0") {
          this.$router.push("/draftList");
        } else {
          this.$router.push('/');
        }
      }).catch(error => {
        console.log(error);
        this.showErrorMsg('保存失败')
      })
    },
    getDraft() {
      const data = {
        "draftID": this.Article.id,
        "authorID": this.Article.authorID,
      }
      axios.post("/draft/getDraft", data).then(response => {
        console.log("数据回来了", response.data.data)
        this.Article = response.data.data
      })
    },
    showSuccessMsg(msg) {
      this.$notify({
        title: "成功",
        message: msg,
        type: "success"
      })
    },
    showErrorMsg(msg) {
      this.$notify.error({
        title: '错误',
        message: msg
      });
    }
  },
  created() {
    this.Article = JSON.parse(this.$route.query.items)
    if (this.Article.id === undefined) {
      console.log("这是一篇新文章")
      this.isNew = true
    } else {
      this.getDraft()
    }
  },

}


</script>

<style scoped>

</style>