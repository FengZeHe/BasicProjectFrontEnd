<template>
    <!-- 顶部导航栏 -->
    <div class="header-content clearfix">
        <div class="header-content-name">
            <router-link to="/">
                <span class="logo-text">论坛首页</span>
            </router-link>
        </div>

        <div class="headercontent-middle"></div>

        <div class="hader-content-user-info">
            <el-avatar size="small" :src="avatarUrl" class="hader-content-user-info-avatar"></el-avatar>
            <el-dropdown split-button class="hader-content-user-info-dropdown">
                <span class="el-dropdown-link">
                    <span>{{ userName }} </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-switch v-model="darkMode" active-text="Dark" class="hader-content-user-info-themeswitch"
                @change="themeSwitch">

            </el-switch>
        </div>
    </div>

</template>

<script>
import axios from "@/axios"
export default {
    data() {
        return {
            userName: "Admin",
            avatarUrl: require("@/assets/avatar.png"),
            darkMode: true
        }
    },
    methods: {
        themeSwitch(data) {
            var mode = ''
            if (data === true) {
                this.$store.commit('theme/SET_THEME', 'dark')
                mode = 'dark'
            } else {
                this.$store.commit('theme/SET_THEME', 'light')
                mode = 'light'
            }
            this.$store.dispatch('theme/syncTheme', mode)
        },

    },
    created() {
        if (this.$store.state.theme.theme === 'light') {
            this.darkMode = false
            this.$store.commit('theme/SET_THEME', 'light')
        } else {
            this.darkMode = true
            this.$store.commit('theme/SET_THEME', 'dark')
        }
    },

}
</script>

<style lang="less" scoped>
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
}

.header-content {
    height: 60px;
}

html::-webkit-scrollbar {
    display: none;
}

.logo-text {
    position: relative;
    float: left;
    left: 30px;
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}


.header-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;

    .header-content-name {
        width: 100px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .headercontent-middle {
        display: flex;
        flex: 1;
    }

    .hader-content-user-info {
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;

        .hader-content-user-info-avatar {
            margin-right: 10px;
        }

        .hader-content-user-info-themeswitch {
            margin-left: 10px;
        }
    }




}
</style>