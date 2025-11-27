<template>
    <div class="articles">
        <h1 class="articles-title">{{ article.title }}</h1>
        <img class="articles-icon" src="@/assets/bruce.jpg">
        <div class="articles-author">{{ article.authorName }}</div>
        <div class="articles-time">{{ article.created_at }}</div>
        <div class="articles-content">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
        </div>

        <div class="articles-content-btn" @click="handleCollect">
            <img :src="selectImg('collect', interactiveStatus.collected)" alt="">
            <span>{{ interactiveStatus.collectCount }}</span>
        </div>

        <div class="articles-content-btn" @click="handleLike">
            <img :src="selectImg('like', interactiveStatus.liked)" alt="">
            <span> {{ interactiveStatus.likeCount }}</span>
        </div>



        <el-divider></el-divider>
        <div class="article-comment">
            <div class="article-comment-block" v-for="item in comment.list" :key="item.parent.id">
                <!-- 评论块 -->
                <div class="article-comment-block-root">
                    <!-- 头像+名称 -->
                    <img class="article-comment-block-root-img" src="@/assets/cat.jpg" alt="">
                    <div class="article-comment-block-root-name">Cat</div>
                </div>
                <div class="article-comment-block-comment">
                    <p>{{ item.parent.content }}</p>
                    <div class="article-comment-block-comment-reply">回复</div>
                    <div class="article-comment-block-comment-time">2025-09-12 15:29:55</div>


                    <div class="article-comment-block-comment-to-comment" v-for="child in item.child" :key="child.id">
                        <div class="artilce-comment-to-comment-block">
                            <img class="article-comment-block-comment-img" src="@/assets/cat.jpg" alt="">
                            <div class="article-comment-block-comment-name">{{ child.content }}</div>
                            <div class="article-comment-block-comment-reply">回复</div>
                            <div class="article-comment-block-comment-time">{{ child.createdAt }}</div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="article-comment-reply">
                <span>你的评论</span>
                <el-input type="textarea" placeholder="请输入内容" v-model="textarea" maxlength="100" show-word-limit>
                </el-input>
                <el-button class="article-comment-reply-btn">提交</el-button>
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
            textarea: '',
            comment: {
                parentNodes: [],
                list: []
            },
            interactiveStatus: {},
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
                this.paragraphs = this.article.content.split('\\n').filter(p => p.trim() !== '');
            })

            this.getArticleStatus(this.article.id)
        },
        getArticleComment() {
            const params = {
                aid: this.article.id
            }
            axios.get("/comment/", { params }).then(response => {
                this.comment.data = response.data.data
                var pn = []
                for (let i = 0; i < this.comment.data.length; i++) {
                    const temp = this.comment.data[i]
                    if (temp.id === temp.rid.Int64) {  // 以顶层评论作为节点
                        pn.push(temp)
                    }
                }
                this.comment.parentNodes = pn
                this.SortOutComments()
            }).catch(error => {
                console.log(error)
            })
        },
        SortOutComments() {
            for (let i = 0; i < this.comment.parentNodes.length; i++) {
                var node = {}
                var child = []
                for (let j = 0; j < this.comment.data.length; j++) {
                    if (this.comment.parentNodes[i].id === this.comment.data[j].pid.Int64) {
                        node.parent = this.comment.parentNodes[i]
                        child.push(this.comment.data[j])
                        node['child'] = [...child]
                    }
                }
                this.comment.list.push(node)
            }
        },
        handleLike() {
            this.interactiveStatus.liked = this.interactiveStatus.liked === 0 ? 1 : 0;
            if (this.interactiveStatus.liked === 1) {
                this.interactiveStatus.likeCount++;
            } else {
                this.interactiveStatus.likeCount--;
            }
            this.addArtLike();
        },
        handleCollect() {
            this.interactiveStatus.collected = this.interactiveStatus.collected === 0 ? 1 : 0;
            if (this.interactiveStatus.collected === 1) {
                this.interactiveStatus.collectCount++;
            } else {
                this.interactiveStatus.collectCount--;
            }
            this.addArtCollect();
        },
        async addArtLike() {
            console.log(this.aid)
            await axios.post("/interactive/like", {
                "aid": this.article.id,
                "like": this.interactiveStatus.liked
            }).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        },
        async addArtCollect() {
            await axios.post("/interactive/collect", {
                "aid": this.article.id,
                "collect": this.interactiveStatus.collected
            }).then((res) => {
                console.log(res)
            }).then((err) => {
                console.log(err)
            })
        },
        async getArticleStatus(aid) {
            await axios.get("/interactive/status", {
                params: {
                    "aid": aid
                }
            }).then((res) => {
                const temp = res.data.data
                this.interactiveStatus = temp
            }).catch((err) => {
                console.log("err", err)
            })
        },
    },
    computed: {
        selectImg() {
            return (iconType, selected) => {
                if (iconType == "like" && selected == "1") {
                    return require("@/assets/like-orange-selected.png");
                } else if (iconType == "like" && selected == "0") {
                    return require("@/assets/like-orange.png");
                } else if (iconType == "collect" && selected == "1") {
                    return require("@/assets/collect-selected.png");
                } else if (iconType == "collect" && selected == "0") {
                    return require("@/assets/collect.png");
                }
            }
        },


    },

    created() {
        this.getArticleFromHomeView()
        this.getArticleDetail()
        this.getArticleComment()
    },

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

.articles-content-btn {
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

.articles-content-btn img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    margin-right: 4px;
}

.articles-content-btn span {
    /* border: 1px solid red ; */
    color: #999;
    /* font-size: 20px; */
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
    margin-left: 20px;
    position: relative;
    top: 30px;
    width: 100%;
    background-color: #eaecee;
    margin-bottom: 120px;
    right: 40px;
}

.artilce-comment-to-comment-block {
    position: relative;
    /* border: 1px solid red; */
    margin-top: 3px;
}


.article-comment-block-comment-img {
    margin: 5px 10px;
    width: 25px;
    height: 25px;
}

.article-comment-block-comment-name {
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



.article-comment-block-comment-to-comment {
    margin-top: 30px;
}

.artilce-comment-to-comment-block {
    height: 50px;
    margin-top: 5px;
}

.article-comment-reply {
    margin-top: 30px;
    position: relative;
    height: 200px;
}

.article-comment-reply-btn {
    position: absolute;
    top: 85px;
    right: 0px;
}
</style>