<template>
  <div class="WriteArticle">
    <h1>This is Write Article Page</h1>
    <h3>标题</h3>
    <el-input v-model="article.title" placeholder="请输入标题"></el-input>
    <h3>文章正文</h3>
    <el-input
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 30}"
        placeholder="请输入内容"
        v-model="article.content">
    </el-input>

    <el-row>
      <el-button @click="updateArticle">保存</el-button>
      <el-button type="primary">保存并发表</el-button>
    </el-row>

  </div>
</template>

<script>
import axios from "@/axios"

export default {
  data() {
    return {
      article: {}
    }
  },
  methods: {
    updateArticle() {
      console.log(this.article.id, this.article.authorID);
      const data = {
        "draftID": this.article.id,
        "authorID": this.article.authorID,
        "title": this.article.title,
        "content": this.article.content,
        "status": "1"
      }
      axios.post("/draft/updateArticle",data).then(response => {
          console.log("修改结果",response)
      }).catch(error => {
        console.log(error);
      })
    }
  },
  created() {
    this.article = this.$route.params.items;
  }
}


</script>

<style scoped>

</style>