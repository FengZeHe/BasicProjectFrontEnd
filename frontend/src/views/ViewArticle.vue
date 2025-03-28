<template>
  <div class="viewArticle">
    <h1>文章列表</h1>
    <div class="content">
      <el-card v-for="item in this.articles" class="content-card" >
        <div slot="header" class="card-header"  @click="handleArticleCardClick(item.id)">
          <span>{{ item.title }}</span>
          <span>{{ item.authorName }}</span>
        </div>
        <div class="read-count">阅读 {{item.read}}</div>
      </el-card>
    </div>
<!--      @size-change="handleSizeChange"-->
    <el-pagination
        @current-change="handleCurrentChange"
        :total="totalCount"
        :current-page="currentPage"
        small
        layout="prev, pager, next"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'ViewArticle',
  methods: {
    getArticles(pageIndex) {
      if (pageIndex === undefined) {
        pageIndex = 1
      }
      const data = {
        "pageIndex": pageIndex,
        "pageSize": 8
      }
      axios.post("/article/getAuthorArticles", data).then(res => {
        this.articles = res.data.data.articles
        this.currentPage = res.data.data.pageIndex
        this.totalCount = res.data.data.totalCount
      })
    },
    handleCurrentChange(newPage) {
      this.getArticles(newPage)
    },
    handleArticleCardClick(id){
      if (id === undefined) {
        console.log("id is undefined")
        return
      }
      console.log("Click +1",id)
      this.$notify({
        title: '成功',
        message: '点击+1',
        type: 'success'
      });
      const data = {
        "id": id,
      }
      // axios.post("/article/addReadCount", data).then(res => {
      //   console.log("addReadCount", res.data.data)
      // })
    }
  },
  data() {
    return {
      articles: {},
      currentPage: 1,
      totalCount: 0,
      readcount:100,
    }
  },
  created() {
    this.getArticles()
  }
}

</script>

<style>

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-card {
  margin-top: 1rem;
  position:relative;
}

.read-count{
  position: absolute;
  bottom:10px;
  right: 10px;
  font-size: 12px;
}
</style>