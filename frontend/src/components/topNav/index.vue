<template>
    <!-- 顶部导航栏 -->
    <div class="header-content">
        <div class="header-content-name">
            <router-link to="/" class="logo-link">
                <div class="logo-icon">🌐</div>
                <span class="logo-text">论坛首页</span>
            </router-link>
        </div>

        <div class="header-content-middle"></div>

        <div class="header-content-user-info">
            <!-- 主题切换 -->
            <div class="theme-toggle-wrapper">
                <span class="theme-icon">{{ darkMode ? '🌙' : '☀️' }}</span>
                <el-switch
                    v-model="darkMode"
                    class="theme-switch"
                    @change="themeSwitch"
                ></el-switch>
            </div>

            <!-- 用户区域 -->
            <div class="user-dropdown-wrapper">
                <el-avatar :size="32" :src="avatarUrl" class="user-avatar"></el-avatar>
                <el-dropdown trigger="click" class="user-dropdown">
                    <div class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <i class="el-icon-arrow-down dropdown-icon"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
                        <el-dropdown-item class="dropdown-item" @click.native="toAbout">
                            <i class="el-icon-user"></i>
                            <span>个人信息</span>
                        </el-dropdown-item>
                        <el-dropdown-item class="dropdown-item">
                            <i class="el-icon-lock"></i>
                            <span>修改密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item class="dropdown-item logout-item" divided @click.native="logout">
                            <i class="el-icon-switch-button"></i>
                            <span>退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import request from '@/axios';

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
        toAbout(){
            this.$router.push("/about");
        },
        logout() {
            localStorage.removeItem('userToken');
            this.$router.push('/login');
        }
    },
    created() {
        if (this.$store.state.theme.theme === 'light') {
            this.darkMode = false
            this.$store.commit('theme/SET_THEME', 'light')
        } else {
            this.darkMode = true
            this.$store.commit('theme/SET_THEME', 'dark')
        }

        // 请求用户信息
        request.post('http://127.0.0.1:8088/v2/sys/userProfile')
            .then(res => {
                if (res.data && res.data.data && res.data.data.nickName) {
                    this.userName = res.data.data.nickName;
                }
            })
            .catch(err => {
                console.error('获取用户信息失败:', err);
            });
    },
}
</script>

<style lang="less" scoped>
.header-content {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    z-index: 100;
}

// Logo 区域
.header-content-name {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .logo-link {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        transition: transform 0.2s ease;

        &:hover {
            transform: translateY(-1px);
        }

        .logo-icon {
            font-size: 26px;
            line-height: 1;
        }

        .logo-text {
            font-size: 17px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }
    }
}

.header-content-middle {
    flex: 1;
}

// 用户信息区域
.header-content-user-info {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
}

// 主题切换
.theme-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;

    .theme-icon {
        font-size: 17px;
        line-height: 1;
    }

    .theme-switch {
        /deep/ .el-switch__core {
            background-color: #dcdfe6;
            border-color: #dcdfe6;

            &:after {
                transition: all 0.3s ease;
            }
        }

        /deep/ .el-switch.is-checked .el-switch__core {
            background-color: #409eff;
            border-color: #409eff;
        }
    }
}

// 用户下拉区域
.user-dropdown-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 10px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }

    .user-avatar {
        border: 2px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 6px;

        .user-name {
            font-size: 14px;
            font-weight: 500;
        }

        .dropdown-icon {
            font-size: 12px;
            color: #909399;
            transition: transform 0.2s ease;
        }
    }
}

// 下拉菜单样式
/deep/ .custom-dropdown-menu {
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    padding: 6px;
    margin-top: 8px;
    min-width: 160px;

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;

        i {
            font-size: 16px;
            color: #909399;
        }

        &:hover {
            background-color: #409eff;
            color: #fff;

            i {
                color: #fff;
            }
        }

        &.logout-item {
            color: #f56c6c;

            i {
                color: #f56c6c;
            }

            &:hover {
                background-color: #fef0f0;
                color: #f56c6c;

                i {
                    color: #f56c6c;
                }
            }
        }
    }
}
</style>
