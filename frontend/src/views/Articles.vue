<template>
    <div class="articles">
        <h1 class="articles-title">{{ this.article.title }}</h1>
        <img class="articles-icon" src="@/assets/bruce.jpg">
        <div class="articles-author">{{ this.article.authorName }}</div>
        <div class="articles-time">{{ this.article.created_at }}</div>
        <div class="articles-content">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
        </div>
        <div class="articles-like">
            <img src="@/assets/like-orange.png" alt="">
            <span>10w+</span>
        </div>
        <el-divider></el-divider>
        <div class="article-comment">
            <div class="article-comment-block">
                <!-- 评论块 -->
                <div class="article-comment-block-root">
                    <!-- 头像+名称 -->
                    <img class="article-comment-block-root-img" src="@/assets/cat.jpg" alt="">
                    <div class="article-comment-block-root-name">Name</div>
                </div>
                <div class="article-comment-block-comment">
                    我觉得很赞
                </div>
            </div>

        </div>

    </div>


</template>

<script>
import axios from "@/axios"
export default {
    props: [],
    data() {
        return {
            article: {},
            paragraphs: []
        }
    },
    methods: {
        getArticleFromHomeView() {
            const id = this.$route.query.article;
            if (id) {
                this.article.id = JSON.parse(id)
            } else {
                console.log("没有数据，返回首页")
                this.$router.push('/');
            }
        },
        getArticleDetail() {
            const req = {
                "id": this.article.id
            }
            axios.post("/article/getArticleByID", req).then(res => {
                this.article = res.data.data
                // this.article.content = this.article.content.replace(/\\n/g, '\n');
                this.paragraphs = this.article.content.split('\\n').filter(p => p.trim() !== '');
            })
        }
    },


    created() {
        this.getArticleFromHomeView()
        this.getArticleDetail()
    }
}

</script>

<style>
.articles {
    width: 100%;
    height: 100%;
    position: relative;
    position: relative;
}

.articles-title {
    text-align: left;
    font-size: 24px;
    position: relative;
    left: 30px;
}

.articles-author {
    color: #37a;
    text-align: left;
    position: relative;
    left: 40px;
    font-weight: bold;
    font-size: 16px;
}


.articles-time {
    text-align: left;
    position: relative;
    left: 40px;
    top: 15px;
    font-size: 13px;
    color: #999;
}

.articles-icon {
    width: 50px;
    height: 50px;
    position: relative;
    left: 30px;
}

.articles-content {
    position: relative;
    top: 25px;
    left: 30px;
    margin: 0 30px;
    padding-bottom: 80px;
}

.articles-content p {
    text-indent: 2em;
    line-height: 1.8;
    margin: 0;
    text-align: left;
    font-size: 15px;
}

.articles-like {
    background-color: #FBE9D9;
    position: relative;
    display: flex;
    align-items: center;
    float: right;
    width: 75px;
    height: 30px;
    line-height: 30px;
    margin-right: 30px;
    top: -15px;
    cursor: pointer;
    border-radius: 5px;
}

.articles-like img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    margin-right: 4px;
}

.articles-like span {
    color: #999;
}

.article-comment {
    width: 100%;
    /* height: 100%; */
    border: 1px solid red;
}

.article-comment-block{
    position: relative;
}

.article-comment-block-root{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    float: left;
    position: relative;
    left: 20px;
    top: 20px;
    width: 150px;
    height: 150px;
    border: 1px solid red;   
}

.article-comment-block-root-img{
    position: relative;
    width: 50px;
    height: 50px;
}

.article-comment-block-comment{
    position: relative;
    text-align: left;    
    width: 100%;
    /* left: 170px; */
    border: 1px solid black;
}
</style>