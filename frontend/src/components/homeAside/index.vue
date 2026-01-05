<template>
    <div>
        <el-aside v-if="!$route.meta.noMenu" width="200px" class="home-aside">
            <el-menu :default-active="$route.path" class="el-menu-vertical" background-color="#304156"
                text-color="#bfcbd9" active-text-color="#409EFF">
                <el-menu-item v-for="menuItem in menuList" :key="menuItem.id" :index="menuItem.path"
                    @click="goPages(menuItem.path)">
                    <div class="menu-item" slot="title">{{ menuItem.name }}</div>
                </el-menu-item>
            </el-menu>
        </el-aside>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            menuList: [],
        }
    },
    methods: {
        getMenu() {
            const token = this.getToken()
            if (token) {
                axios.get("http://127.0.0.1:8088/v2/menus/list", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    this.menuList = JSON.parse(JSON.stringify(res.data.data))
                })
            }
        },
        // 获取用户的token
        getToken() {
            const token = localStorage.getItem('userToken')
            return token;
        },
        goAbout() {
            this.$router.push("/about").catch(() => {
            })
        },
        goViewArticles() {
            this.$router.push("/viewArticles").catch(() => {
            })
        },
        goPages(url) {
            this.$router.push(url).catch(() => {
            })
        },
    },
    created() {
        this.getMenu()
    }
}
</script>

<style lang="less" scoped>
.home-aside {
    border-radius: 5px;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    height: 100%;
}

.home-aside::-webkit-scrollbar {
    display: none;
}

.el-menu-vertical {
    width: 200px;
    height: 100%;
}
</style>