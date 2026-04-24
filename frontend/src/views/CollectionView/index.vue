<template>
    <div class="collection">
        <div class="content">
            <el-card v-for="item in collectList" class="homeview-content-card" :key="item.id"
                @click.native="handleCardClick(item.aid)">
                <div class="homeview-content-card-title">{{ item.title }}</div>
                <div class="homeview-content-card-author clearfix">
                    <img class="homeview-card-avatar" src="@/assets/bruce.jpg" alt="">
                    <div class="homeview-card-authorName">{{ item.author }}</div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import axios from "@/axios";

export default {
    name: "CollectionView",
    data() {
        return {
            collectList: []
        }
    },
    methods: {
        async getCollection(pageIndex, pageSize) {
            const fd = new FormData();
            fd.append('pageIndex', pageIndex);
            fd.append('pageSize', pageSize);
            await axios.get('/interactive/collection', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                this.collectList = res.data.data.collectList;
            }).catch((err) => {});
        },
        handleCardClick(item) {
            this.$router.push({
                name: 'article',
                query: {
                    article: JSON.stringify(item),
                }
            }).catch(() => {});
        }
    },
    created() {
        this.getCollection();
    }
};
</script>

<style scoped>
.collection {
    padding: 20px;
}

.homeview-content-card {
    margin-top: 1rem;
}

.homeview-content-card-author {
    display: flex;
    align-items: center;
    height: auto;
    padding: 10px;
}

.homeview-card-avatar {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    float: none;
}

.homeview-card-authorName {
    font-size: 12px;
    color: #868686;
    margin: 0;
}

.homeview-content-card-title {
    padding: 10px 15px 5px;
    font-size: 14px;
    color: #646464;
    font-weight: bold;
    text-align: left;
}

.clearfix::after {
    content: "";
    display: block;
    clear: both;
}
</style>
