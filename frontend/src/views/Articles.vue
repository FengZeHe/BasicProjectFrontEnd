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
                    <div class="article-comment-block-root-name">Cat</div>
                </div>
                <div class="article-comment-block-comment">
                    <p>我觉得很赞</p>
                    <p>我觉得很赞</p>
                    <p>我觉得很赞</p>
                    <p>我觉得很赞</p>
                    <div class="article-comment-block-comment-reply">回复</div>
                    <div class="article-comment-block-comment-time">2025-09-12 15:29:55</div>
                    <div class="article-comment-block-comment-to-comment">
                        <div class="artilce-comment-to-comment-block">
                            <img class="article-comment-block-comment-img" src="@/assets/cat.jpg" alt="">
                            <div class="article-comment-block-comment-name">Dog:我也觉得很赞</div>
                            <div class="article-comment-block-comment-reply">回复</div>
                            <div class="article-comment-block-comment-time">2025-09-12 15:29:55</div>
                        </div>



                        <div class="artilce-comment-to-comment-block">
                            <img class="article-comment-block-comment-img" src="@/assets/cat.jpg" alt="">
                            <div class="article-comment-block-comment-name">Dog 回复 Cat:我也觉得很赞</div>
                            <div class="article-comment-block-comment-reply">回复</div>
                            <div class="article-comment-block-comment-time">2025-09-12 15:29:55</div>
                        </div>


                    </div>

                </div>


            </div>
            <div class="article-comment-reply">
                <span>你的回复</span>
                <el-input type="textarea" placeholder="请输入内容" v-model="textarea" maxlength="100" show-word-limit>
                </el-input>
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
            paragraphs: [],
            textarea: ''
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
    border: 1px solid #ccc;
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
}

.article-comment-block {
    position: relative;
    display: flex;

}

.article-comment-block-root {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    float: left;
    position: relative;
    top: 15px;
    height: 80px;
    flex: 1;
    margin-right: 30px;
    border-right: 1px solid #ccc;
}

.article-comment-block-root-img {
    position: relative;
    width: 50px;
    height: 50px;
    display: flex;
    border: 1px solid #ccc;

}

.article-comment-block-root-name {
    margin-top: 10px;
    font-size: 15px;
    color: #37a;
}

.article-comment-block-comment {
    flex: 6;
    text-align: left;
}

.article-comment-block-comment-time {
    float: right;
    color: #999;
    font-size: 13px;
}

.article-comment-block-comment-to-comment {
    position: relative;
    top: 30px;
    width: 100%;
    background-color:#eaecee ;
    margin-bottom: 120px;
    right: 40px;
}

.artilce-comment-to-comment-block{
    position: relative;
    /* border: 1px solid red; */
    margin-top: 3px;
}


.article-comment-block-comment-img{
    margin: 5px 10px;
    width: 25px;
    height: 25px;
}

.article-comment-block-comment-name{
    margin: 5px 0;
}

.article-comment-block-comment-reply {
    float: right;
    font-size: 13px;
    margin-left: 20px;
    margin-right: 40px;
    margin-top: -3px;
}

.article-comment-block-comment-reply:hover {
    cursor: pointer;
    background-color: #999;
}

.article-comment-reply {
    margin-top: 30px;
}

.article-comment-block-comment-to-comment {
    margin-top: 30px;
}

.artilce-comment-to-comment-block{
    height: 50px;
    margin-top: 5px;
}


</style>