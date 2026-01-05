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
            <el-dropdown split-button>
                <span class="el-dropdown-link">
                    <span>{{ userName }} </span>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            userName: "Admin",
            avatarUrl: require("@/assets/avatar.png")
        }
    }
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
        width: 15%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;

        .hader-content-user-info-avatar{
            margin-right: 10px;
        }
    }




}
</style>