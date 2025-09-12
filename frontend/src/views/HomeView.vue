<template>
  <div class="home">
    <h1 class="home-title">论坛首页</h1>
    <div class="content">
      <el-card v-for="item in this.articles" class="homeview-content-card">
        <div class="homeview-content-card-author clearfix">
          <img class="homeview-card-avatar" src="@/assets/bruce.jpg" alt="">
          <div class="homeview-card-authorName">{{ item.authorName }}</div>
        </div>
        <div class="homeview-content-card-title">{{ item.title }}</div>
        <div class="homeview-content-card-content">{{ item.content }}</div>
        <!-- {{ item }} -->
      </el-card>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="totalCount"
      :current-page="currentPage" small layout="prev, pager, next">
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
      currentPage: 1,
      totalCount: 0,
    }
  },
  components: {},
  methods: {
    getArticles(pageIndex) {
      if (pageIndex === undefined) {
        pageIndex = 1
      }
      const data = {
        "pageIndex": pageIndex,
        "pageSize": 8
      }
      axios.post("/article/getArticles", data).then(res => {
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
.home-title {
  font-size: 20px;
  margin-bottom: 30px;
}

.homeview-card-avatar {
  /* position: absolute; */
  float: left;
  width: 30px;
  height: 30px;
}

.homeview-content-card-author{
  /* border: 1px solid red; */
  height: 170px;
}

.homeview-content-card-author img{
  position: relative;
  top: 20px;
  left: 20px;
}

.homeview-content-card-author div{
  position: relative;
  top: 20px;
  left: 30px;
  height: 30px;
  line-height: 30px;
  color: #868686;
}

.homeview-content-card-author div,img{
  float: left;
}

.homeview-content-card-title{
  left: 0;
  /* position: relative; */
  /* float: left; */
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}



.homeview-content-card {
  margin-top: 1rem;
}
</style>