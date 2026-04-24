<template>
    <div>
        <el-aside v-if="!$route.meta.noMenu" :width="isCollapsed ? '64px' : '220px'" class="home-aside" :class="{ 'is-collapsed': isCollapsed }">
            <div class="aside-header">
                <div class="header-decoration"></div>
            </div>
            <el-menu
                :default-active="$route.path"
                class="el-menu-vertical"
                :unique-opened="true"
                menu-trigger="hover"
                :collapse="isCollapsed"
                :collapse-transition="false"
            >
                <el-menu-item
                    v-for="menuItem in menuList"
                    :key="menuItem.id"
                    :index="menuItem.path"
                    @click="goPages(menuItem.path)"
                    class="custom-menu-item"
                >
                    <div class="menu-item-content">
                        <span class="menu-text">{{ menuItem.name }}</span>
                    </div>
                </el-menu-item>
            </el-menu>
            <div class="aside-footer">
                <div class="toggle-btn" @click="toggleCollapse">
                    <i :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
                </div>
            </div>
        </el-aside>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            menuList: [],
            isCollapsed: false,
        }
    },
    methods: {
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        },
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
        getToken() {
            const token = localStorage.getItem('userToken')
            return token;
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
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    position: relative;
    transition: width 0.3s ease;

    &.is-collapsed {
        .menu-text {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }

        .custom-menu-item.el-menu-item {
            padding: 0 16px !important;
            justify-content: center;
        }
    }
}

.aside-header {
    height: 20px;
    flex-shrink: 0;
    position: relative;

    .header-decoration {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(64, 158, 255, 0.1) 100%);
    }
}

.el-menu-vertical {
    width: 100%;
    flex: 1;
    border: none;
    background-color: transparent !important;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 12px;
    transition: padding 0.3s ease;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
}

.custom-menu-item {
    margin: 4px 0;
    border-radius: 10px;
    height: 48px;
    line-height: 48px;
    transition: all 0.3s ease;

    &.el-menu-item {
        color: #94a3b8;
        padding: 0 12px !important;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;

        &:hover {
            background-color: rgba(64, 158, 255, 0.1) !important;
            color: #e2e8f0;
        }

        &.is-active {
            background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.05) 100%) !important;
            color: #409eff;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 3px;
                height: 24px;
                background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
                border-radius: 0 3px 3px 0;
            }
        }
    }

    .menu-item-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;

        .menu-text {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
            white-space: nowrap;
            transition: opacity 0.2s ease, width 0.3s ease;
        }
    }
}

.aside-footer {
    height: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;

    .toggle-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #94a3b8;
        background-color: rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;

        &:hover {
            background-color: rgba(64, 158, 255, 0.15);
            color: #409eff;
        }

        i {
            font-size: 20px;
        }
    }
}

// 针对深色主题下的侧边栏样式增强
[data-theme="dark"] .home-aside {
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
}
</style>
