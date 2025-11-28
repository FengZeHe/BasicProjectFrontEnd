<template>
  <div class="home">
    <div class="content">
      <el-card v-for="item in articles" class="homeview-content-card" :key="item.id"
        @click.native="handleCardClick(item.id)">
        <div class="homeview-content-card-author clearfix">
          <img class="homeview-card-avatar" src="@/assets/bruce.jpg" alt="">
          <div class="homeview-card-authorName">{{ item.authorName }}</div>
        </div>
        <div class="homeview-content-card-title">{{ item.title }}</div>
        <div class="homeview-content-card-content">{{ item.content }}</div>
        <div class="homeview-content-card-like">
          <div class="homeview-content-card-like-number">{{ getInteractiveArt(item.id).collectCount }}</div>
          <img src="@/assets/collect.png" alt="">
          <!-- 
          <div class="homeview-content-card-like-number">1k+</div>
          <img src="@/assets/comment.png" alt=""> -->

          <div class="homeview-content-card-like-number">{{ getInteractiveArt(item.id).likeCount }}</div>
          <img src="@/assets/like.png" alt="">

          <div class="homeview-content-card-like-number">{{ getInteractiveArt(item.id).readCount }}</div>
          <img src="@/assets/eyes.png" alt="">

        </div>
      </el-card>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="totalCount"
      :current-page="currentPage" small layout="prev, pager, next">
    </el-pagination>
  </div>
</template>

<script>
import axios from "@/axios"
import Article from "@/views/Articles.vue"

export default {
  name: 'HomeView',
  data() {
    return {
      articles: [],
      currentPage: 1,
      totalCount: 0,
      interactiveArt: {}
    }
  },
  components: { Article },
  methods: {
    handleCardClick(item) {
      this.addReadCount(item)
      this.$router.push({
        name: 'article',
        query: { 
          article: JSON.stringify(item),
         }
      }).catch(()=>{

      })

    },
    async addReadCount(aid) {
      await axios.post("/interactive/addRead", {
        "Aid": aid
      }).then((res)=>{

      }).catch((err)=>{
        console.log("add read count error",err)
      })
    },


    async getArticles(pageIndex) {
      if (pageIndex === undefined) {
        pageIndex = 1
      }
      const data = {
        "pageIndex": pageIndex,
        "pageSize": 8
      }
      await axios.post("/article/getArticles", data).then(res => {
        this.articles = res.data.data.articles
        this.currentPage = res.data.data.pageIndex
        this.totalCount = res.data.data.totalCount

        // 遍历articles
        for (var i = 0; i < this.articles.length; i++) {
          this.getArticleStatus(this.articles[i].id)
        }
      })
    },
    async getArticleStatus(aid) {
      await axios.get("/interactive/status", {
        params: {
          "aid": aid
        }
      }).then((res) => {
        const temp = res.data.data
        this.$set(this.interactiveArt, aid, temp)
      }).catch((err) => {
        console.log("err", err)
      })
    },


    handleSizeChange(val) {
      console.log("handleSizeChange", val)
    },
    handleCurrentChange(newPage) {
      this.getArticles(newPage)
    }
  },
  computed: {
    getInteractiveArt() {
      return (aid) => {
        const item = this.interactiveArt[aid]
        return item ? item : 0
      }
    }
  },
  created() {
    this.getArticles()
  }
}
</script>

<style>
.content::-webkit-scrollbar {
  display: none;
}

.content {
  padding-bottom: 80px;
}


.home-title {
  font-size: 20px;
  margin-bottom: 30px;
}

.homeview-card-avatar {
  float: left;
  width: 30px;
  height: 30px;
}

.homeview-content-card-author {
  height: 65px;
}

.homeview-content-card-author img {
  position: relative;
  top: 20px;
  left: 20px;
}

.homeview-content-card-author div {
  position: relative;
  top: 20px;
  left: 30px;
  height: 30px;
  line-height: 30px;
  color: #868686;
}

.homeview-content-card-author div,
img {
  float: left;
}

.homeview-content-card {
  position: relative;
}

.homeview-content-card-title {
  position: relative;
  display: block;
  height: 30px;
  padding-left: 15px;
  text-align: left;
  font-size: 15px;
  color: #646464;
  font-weight: bold;
}

.homeview-content-card-content {
  position: relative;
  padding-left: 12px;
  height: 60px;
  line-height: 20px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}



.homeview-content-card {
  margin-top: 1rem;
}

.homeview-content-card-like {
  /* border: 1px solid red; */
  height: 20px;
  text-align: right;
  padding-top: 8px;
  margin-right: 20px;
}

.homeview-content-card-like img {
  float: right;
  width: 15px;
  height: 15px;
  padding-left: 12px;
  padding-right: 2px;
}

.homeview-content-card-like-number {
  float: right;
  font-size: 12px;
  color: #999;
}
</style>