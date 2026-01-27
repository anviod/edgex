<template>
  <v-app class="app-background">
    <!-- Navigation Drawer -->
    <v-navigation-drawer 
        v-if="!isLoginPage"
        app 
        permanent 
        class="glass-drawer" 
        :rail="drawerRail"
        width="260"
    >
        <div class="d-flex align-center justify-center pa-4" style="height: 64px;">
            <v-icon icon="mdi-hexagon-multiple" size="32" color="primary"></v-icon>
            <span v-if="!drawerRail" class="text-h6 font-weight-bold ml-2 text-primary text-truncate">Edge Gateway</span>
        </div>
        
        <v-list nav class="bg-transparent">
            <v-list-item 
                prepend-icon="mdi-view-dashboard" 
                title="首页监控" 
                to="/"
                active-class="v-list-item--active"
                rounded="xl"
            ></v-list-item>
            <v-list-item 
                prepend-icon="mdi-lan-connect" 
                title="采集通道" 
                to="/channels"
                active-class="v-list-item--active"
                rounded="xl"
            ></v-list-item>
            <v-list-item 
                prepend-icon="mdi-memory" 
                title="边缘计算" 
                to="/edge-compute"
                active-class="v-list-item--active"
                rounded="xl"
            ></v-list-item>
            <v-list-item 
                prepend-icon="mdi-cloud-upload" 
                title="北向上报" 
                to="/northbound"
                active-class="v-list-item--active"
                rounded="xl"
            ></v-list-item>
            <v-list-item 
                prepend-icon="mdi-cog" 
                title="系统设置" 
                to="/system"
                active-class="v-list-item--active"
                rounded="xl"
            ></v-list-item>
        </v-list>

        <template v-slot:append>
            <div class="pa-2">
                <v-btn 
                    block 
                    variant="text" 
                    :icon="drawerRail ? 'mdi-chevron-right' : undefined"
                    @click="drawerRail = !drawerRail"
                >
                    <v-icon v-if="drawerRail">mdi-chevron-right</v-icon>
                    <span v-else class="d-flex align-center">
                        <v-icon start>mdi-chevron-left</v-icon> 收起菜单
                    </span>
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar v-if="!isLoginPage" app class="glass-app-bar" elevation="0">
        <v-app-bar-title class="font-weight-bold text-h6 text-primary">
            边缘计算网关
            <span v-if="$route.meta.title" class="text-grey-darken-1 font-weight-light">
                / {{ $route.meta.title }}
            </span>
            <span v-if="globalState.navTitle" class="text-grey-darken-1 font-weight-light">
                / {{ globalState.navTitle }}
            </span>
        </v-app-bar-title>
        <template v-slot:append>
            <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                    <v-btn
                        variant="text"
                        v-bind="props"
                        class="text-capitalize"
                    >
                        <v-avatar color="primary" size="32" class="mr-2">
                            <span class="text-caption font-weight-bold text-white">{{ userInitials }}</span>
                        </v-avatar>
                        <span class="text-subtitle-2 font-weight-medium">{{ user.username || 'Admin' }}</span>
                        <v-icon end>mdi-chevron-down</v-icon>
                    </v-btn>
                </template>
                <v-list class="glass-menu mt-2" width="200" density="compact" rounded="lg">
                    <v-list-item @click="openChangePassword" link>
                        <template v-slot:prepend>
                            <v-icon icon="mdi-lock-reset" class="mr-2" size="small"></v-icon>
                        </template>
                        <v-list-item-title>修改密码</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-1"></v-divider>
                    <v-list-item @click="handleRestart" link>
                        <template v-slot:prepend>
                            <v-icon icon="mdi-restart" color="warning" class="mr-2" size="small"></v-icon>
                        </template>
                        <v-list-item-title class="text-warning">软件重启</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleLogout" link>
                        <template v-slot:prepend>
                            <v-icon icon="mdi-logout" color="error" class="mr-2" size="small"></v-icon>
                        </template>
                        <v-list-item-title class="text-error">退出登录</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
        <v-container fluid :class="isLoginPage ? 'pa-0' : 'pa-6'">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" :key="$route.fullPath" />
                </transition>
            </router-view>
        </v-container>
    </v-main>

    <!-- Dialogs -->
    <change-password-dialog ref="changePwdRef" />

    <!-- Global Snackbar -->
    <v-snackbar 
        v-model="snackbar.show" 
        :color="snackbar.color" 
        location="top right"
        timeout="3000"
    >
        {{ snackbar.text }}
        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar.show = false">关闭</v-btn>
        </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalState, showMessage } from './composables/useGlobalState'
import { userStore } from '@/stores/user'
import LoginApi from '@/api/login'
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue'

const route = useRoute()
const router = useRouter()
const drawerRail = ref(false)
const snackbar = globalState.snackbar
const wsStatus = globalState.wsStatus
const user = userStore()
const changePwdRef = ref(null)

const isLoginPage = computed(() => {
    return route.path === '/login'
})

const userInitials = computed(() => {
    return (user.username || 'A').charAt(0).toUpperCase()
})

onMounted(() => {
    // Restore user info from localStorage if not present
    if (!user.username) {
        try {
            const loginInfo = localStorage.getItem('loginInfo')
            if (loginInfo) {
                const parsed = JSON.parse(loginInfo)
                // parsed is the storeData from Login.vue, which has 'username' (lowercase)
                if (parsed && parsed.username) {
                    user.setLoginInfo({ userName: parsed.username }, parsed.permissions || [], parsed.token || '')
                }
            }
        } catch (e) {
            console.error('Failed to restore user info', e)
        }
    }
})

const openChangePassword = () => {
    changePwdRef.value?.open()
}

const handleLogout = async () => {
    try {
        await LoginApi.logout()
    } catch (e) {
        console.error(e)
    }
    localStorage.removeItem('loginInfo')
    // Keep 'rememberedAccount'
    user.setLoginInfo({}, [], '')
    router.push('/login')
    showMessage('已退出登录')
}

const handleRestart = () => {
    if (confirm('确定要重启系统吗？服务将暂时不可用。')) {
        LoginApi.restartSystem().then(() => {
            showMessage('系统正在重启...', 'warning')
            // Wait a bit then reload to show login page or error (since server is down)
            setTimeout(() => {
                window.location.reload()
            }, 5000)
        }).catch(e => {
            showMessage('重启指令发送失败: ' + e.message, 'error')
        })
    }
}
</script>

<style>
.glass-menu {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

:root {
    /* Fonts */
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    
    /* Colors */
    --color-gray-50: #f9fafb;
    --color-gray-900: #111827;
    --color-blue-50: #eff6ff;
    --color-purple-50: #faf5ff;
    
    /* Spacing & Radius */
    --spacing: 0.25rem;
    --radius-2xl: 1rem;
    
    /* Animations */
    --animate-float: float 6s ease-in-out infinite;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

.blink {
    animation: blink 1s linear infinite;
}

body {
    font-family: var(--font-sans);
    margin: 0;
    overflow: hidden;
    color: var(--color-gray-900);
}

.app-background {
    /* Fallback for browsers not supporting complex gradients */
    background: linear-gradient(135deg, var(--color-gray-50), var(--color-blue-50), var(--color-purple-50));
    background-size: cover;
    background-attachment: fixed;
    min-height: 100vh;
}

.glass-card {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: var(--radius-2xl) !important;
    
    /* Shadow */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    
    /* 3D Transform removed to fix blurry text */
    /* transform-style: preserve-3d; */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    /* transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1); */
    transform: translateZ(0); /* Hardware acceleration without 3D side effects */
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.glass-card:not(.no-hover):hover {
    transform: scale(1.01);
    box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3) !important;
}

.glass-app-bar {
    background: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(10px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.glass-drawer {
    background: rgba(255, 255, 255, 0.4) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.05);
}

.v-list-item--active {
    background: rgba(79, 70, 229, 0.1) !important;
    color: #4f46e5 !important;
    font-weight: bold;
}

.v-table {
    background: transparent !important;
}

.v-table .v-table__wrapper > table > thead > tr > th {
    background: rgba(255, 255, 255, 0.3) !important;
    color: #333 !important;
    font-weight: 600 !important;
}

.v-table .v-table__wrapper > table > tbody > tr:hover td {
    background: rgba(255, 255, 255, 0.2) !important;
}

.channel-icon {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    padding: 12px;
    display: inline-flex;
    margin-bottom: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Custom Text Colors to match theme */
.text-primary {
    color: #4f46e5 !important; /* Indigo-600-ish */
}
</style>
