<template>
    <div class="articles">
        <div class="article-wrapper">
            <!-- 返回按钮 -->
            <div class="back-section">
                <el-button icon="el-icon-arrow-left" @click="goBack" class="back-btn">返回</el-button>
            </div>

            <!-- 文章标题 -->
            <h1 class="articles-title">{{ article.title }}</h1>

            <!-- 作者信息 -->
            <div class="article-meta" @click="toUserProfile">
                <div class="author-info">
                    <div class="author-avatar">
                        <i class="el-icon-user"></i>
                    </div>
                    <div class="author-details">
                        <span class="author-name">{{ article.authorName }}</span>
                        <span class="publish-time">{{ formatDate(article.createdAt) }}</span>
                    </div>
                </div>

            </div>

            <!-- 文章内容 -->
            <div class="articles-content">
                <div class="content-body" v-html="renderedContent"></div>

                <!-- 互动数据 -->
                <div class="article-footer-stats">
                    <div class="footer-stat-item">
                        <i class="el-icon-view"></i>
                        <span>{{ interactiveStatus.readCount || 0 }}</span>
                    </div>
                    <div class="footer-stat-item" :class="{ active: interactiveStatus.collected == 1 }"
                        @click="handleCollect">
                        <i :class="interactiveStatus.collected == 1 ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                        <span>{{ interactiveStatus.collectCount || 0 }}</span>
                    </div>
                    <div class="footer-stat-item" :class="{ active: interactiveStatus.liked == 1 }" @click="handleLike">
                        <i :class="interactiveStatus.liked == 1 ? 'el-icon-thumb' : 'el-icon-thumb'"></i>
                        <span>{{ interactiveStatus.likeCount || 0 }}</span>
                    </div>
                </div>
            </div>

            <el-divider class="divider"></el-divider>

            <!-- 评论区 -->
            <div class="article-comment">
                <h3 class="comment-title">评论 ({{ comment.list.length }})</h3>

                <!-- 评论列表 -->
                <div class="comments-list">
                    <div class="comment-item" v-for="item in comment.list" :key="item.parent?.id">
                        <div class="comment-avatar">
                            <i class="el-icon-user"></i>
                        </div>
                        <div class="comment-content-wrapper">
                            <div class="comment-header">
                                <span class="comment-author">{{ item.parent?.authorName || '用户' }}</span>
                                <span class="comment-time">{{ formatDate(item.parent?.createdAt) }}</span>
                            </div>
                            <div class="comment-text">{{ item.parent?.content }}</div>
                            <div class="comment-actions">
                                <span class="reply-btn" @click="replyTo(item.parent?.id)">回复</span>
                            </div>

                            <!-- 子评论 -->
                            <div class="child-comments" v-if="item.child && item.child.length > 0">
                                <div class="child-comment-item" v-for="child in item.child" :key="child.id">
                                    <div class="child-avatar">
                                        <i class="el-icon-user"></i>
                                    </div>
                                    <div class="child-content-wrapper">
                                        <div class="child-header">
                                            <span class="child-author">{{ child.authorName || '用户' }}</span>
                                            <span class="child-time">{{ formatDate(child.createdAt) }}</span>
                                        </div>
                                        <div class="child-text">{{ child.content }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 发表评论 -->
                <div class="article-comment-reply">
                    <div class="reply-header">发表评论</div>
                    <el-input type="textarea" placeholder="写下你的评论..." v-model="textarea" maxlength="500" show-word-limit
                        :rows="4" class="reply-textarea"></el-input>
                    <div class="reply-footer">
                        <el-button type="primary" class="submit-btn" @click="submitComment">发表评论</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "@/axios";

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
    computed: {
        renderedContent() {
            if (!this.article.content) return '';
            // 简单处理 Markdown 换行
            return this.article.content
                .replace(/\\n/g, '\n')
                .split('\n')
                .filter(p => p.trim() !== '')
                .map(p => `<p>${p}</p>`)
                .join('');
        }
    },
    methods: {
        goBack() {
            this.$router.push('/');
        },
        toUserProfile(){
            this.$router.push({
                path: '/userprofile',
                query: { author_id: this.article.authorId }
            })
        },
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
            const req = { "id": this.article.id };
            axios.post("/article/getArticleByID", req).then(res => {
                this.article = res.data.data;
                this.paragraphs = this.article.content.split('\\n').filter(p => p.trim() !== '');
            });
            this.getArticleStatus(this.article.id);
        },
        getArticleComment() {
            const params = {
                aid: this.article.id
            };
            axios.get("/comment/", { params }).then(response => {
                this.comment.data = response.data.data;
                var pn = [];
                for (let i = 0; i < this.comment.data.length; i++) {
                    const temp = this.comment.data[i];
                    if (temp.id === temp.rid.Int64) {
                        pn.push(temp);
                    }
                }
                this.comment.parentNodes = pn;
                this.SortOutComments();
            }).catch(error => {
                console.log(error);
            });
        },
        SortOutComments() {
            for (let i = 0; i < this.comment.parentNodes.length; i++) {
                var node = {};
                var child = [];
                for (let j = 0; j < this.comment.data.length; j++) {
                    if (this.comment.parentNodes[i].id === this.comment.data[j].pid.Int64) {
                        node.parent = this.comment.parentNodes[i];
                        child.push(this.comment.data[j]);
                        node.child = [...child];
                    }
                }
                this.comment.list.push(node);
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
            await axios.post("/interactive/like", {
                "aid": this.article.id,
                "like": this.interactiveStatus.liked
            }).then((res) => {
                this.$message.success(this.interactiveStatus.liked === 1 ? '点赞成功' : '已取消点赞');
            }).catch((err) => {
                console.log(err)
            });
        },
        async addArtCollect() {
            await axios.post("/interactive/collect", {
                "aid": this.article.id,
                "collect": this.interactiveStatus.collected
            }).then((res) => {
                this.$message.success(this.interactiveStatus.collected === 1 ? '收藏成功' : '已取消收藏');
            }).catch((err) => {
                console.log(err)
            });
        },
        async getArticleStatus(aid) {
            await axios.get("/interactive/status", {
                params: {
                    "aid": aid
                }
            }).then((res) => {
                const temp = res.data.data;
                this.interactiveStatus = temp;
            }).catch((err) => {
                console.log("err", err)
            });
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        replyTo(id) {
            this.textarea = `@${id} `;
            this.$nextTick(() => {
                const textarea = document.querySelector('.reply-textarea textarea');
                if (textarea) textarea.focus();
            });
        },
        submitComment() {
            if (!this.textarea.trim()) {
                this.$message.warning('请输入评论内容');
                return;
            }
            this.$message.success('评论发表成功');
            this.textarea = '';
        }
    },
    created() {
        this.getArticleFromHomeView();
        this.getArticleDetail();
        this.getArticleComment();
    }
};
</script>

<style lang="less" scoped>
.articles {
    width: 100%;
    min-height: 100%;
    background: #f7f8fa;
}

.article-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 24px 20px 60px;
}

.back-section {
    margin-bottom: 20px;
    text-align: left;
}

.back-btn {
    border: none;
    background: transparent;
    color: #606a75;
    padding: 8px 12px;

    &:hover {
        color: #409eff;
        background: #f0f7ff;
    }
}

.articles-title {
    font-size: 30px;
    font-weight: 700;
    color: #1d2129;
    text-align: left;
    line-height: 1.4;
    margin-bottom: 20px;
}

.article-meta {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 16px 0;
    margin-bottom: 28px;
    border-top: 1px solid #f2f3f5;
    border-bottom: 1px solid #f2f3f5;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.author-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.author-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

.author-name {
    font-size: 16px;
    font-weight: 600;
    color: #1d2129;
}

.publish-time {
    font-size: 13px;
    color: #909399;
}

.articles-content {
    width: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    text-align: left;
}

.content-body {
    p {
        font-size: 16px;
        line-height: 1.9;
        color: #303133;
        margin-bottom: 18px;
        text-align: justify;
    }
}

.article-footer-stats {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #f2f3f5;
}

.footer-stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 20px;
    background: #f7f8fa;
    color: #606a75;
    cursor: pointer;
    transition: all 0.2s ease;

    i {
        font-size: 20px;
    }

    span {
        font-size: 14px;
        font-weight: 500;
    }

    &:hover {
        background: #f0f7ff;
        color: #409eff;
    }

    &.active {
        background: #f0f7ff;
        color: #409eff;
    }
}

.divider {
    margin: 32px 0;
}

.article-comment {
    background: #fff;
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    text-align: left;
}

.comment-title {
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 24px;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
}

.comment-item {
    display: flex;
    gap: 12px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f2f3f5;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
}

.comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    flex-shrink: 0;
}

.comment-content-wrapper {
    flex: 1;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.comment-author {
    font-size: 14px;
    font-weight: 600;
    color: #1d2129;
}

.comment-time {
    font-size: 12px;
    color: #c0c4cc;
}

.comment-text {
    font-size: 15px;
    line-height: 1.7;
    color: #303133;
    margin-bottom: 8px;
}

.comment-actions {
    .reply-btn {
        font-size: 13px;
        color: #909399;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
            color: #409eff;
        }
    }
}

.child-comments {
    margin-top: 16px;
    background: #f7f8fa;
    border-radius: 8px;
    padding: 16px;
}

.child-comment-item {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.child-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a8a8a8 0%, #8a8a8a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    flex-shrink: 0;
}

.child-content-wrapper {
    flex: 1;
}

.child-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
}

.child-author {
    font-size: 13px;
    font-weight: 500;
    color: #606a75;
}

.child-time {
    font-size: 11px;
    color: #c0c4cc;
}

.child-text {
    font-size: 14px;
    line-height: 1.6;
    color: #4c4d4f;
}

.article-comment-reply {
    background: #f7f8fa;
    border-radius: 10px;
    padding: 20px;
}

.reply-header {
    font-size: 15px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 16px;
}

.reply-textarea {
    margin-bottom: 12px;
}

.reply-footer {
    display: flex;
    justify-content: flex-end;
}

.submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    padding: 10px 28px;
    font-weight: 500;

    &:hover {
        opacity: 0.9;
    }
}
</style>
