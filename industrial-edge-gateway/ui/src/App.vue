<template>
  <v-app class="app-background">
    <!-- Navigation Drawer -->
    <v-navigation-drawer 
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
    <v-app-bar app class="glass-app-bar" elevation="0">
        <v-app-bar-title class="font-weight-bold text-h5 text-primary">
            边缘计算网关
            <span v-if="$route.meta.title" class="text-grey-darken-1 font-weight-light">
                / {{ $route.meta.title }}
            </span>
            <span v-if="globalState.navTitle" class="text-grey-darken-1 font-weight-light">
                / {{ globalState.navTitle }}
            </span>
        </v-app-bar-title>
        <template v-slot:append>
            <v-chip
                :color="wsStatus.connected ? 'success' : 'error'"
                variant="elevated"
                class="font-weight-medium"
            >
                <v-icon start icon="mdi-api"></v-icon>
                {{ wsStatus.connected ? '实时连接' : '断开连接' }}
            </v-chip>
        </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
        <v-container fluid class="pa-6">
            <router-view :key="$route.fullPath"></router-view>
        </v-container>
    </v-main>

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
import { ref } from 'vue'
import { globalState } from './composables/useGlobalState'

const drawerRail = ref(false)
const snackbar = globalState.snackbar
const wsStatus = globalState.wsStatus
</script>

<style>
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
