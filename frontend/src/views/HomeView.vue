<template>
  <div class="home">
    <h1>This is Home Page</h1>
    <div class="content">
      <el-card v-for="item in this.articles" class="content-card">
        <div slot="header" class="card-header">
          <span>{{ item.title }}</span>
          <span>{{ item.authorName }}</span>
        </div>
      </el-card>
    </div>
    <el-pagination
        @size-change="handleSizeChange"
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
import axios from "@/axios"

export default {
  name: 'HomeView',
  data() {
    return {
      articles: {},
      currentPage:1,
      totalCount:0,
    }
  },
  components: {},
  methods: {
    getArticles(pageIndex) {
      if (pageIndex === undefined){
        pageIndex = 1
      }
      const data = {
        "pageIndex": pageIndex,
        "pageSize": 8
      }
      axios.post("/article/getArticles",data).then(res => {
        this.articles = res.data.data.articles
        this.currentPage = res.data.data.pageIndex
        this.totalCount = res.data.data.totalCount
      })
    },
    handleSizeChange(val) {
      console.log("handleSizeChange", val)

    },
    handleCurrentChange(newPage) {
      this.getArticles(newPage)
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

.content-card{
  margin-top: 1rem;
}
</style>