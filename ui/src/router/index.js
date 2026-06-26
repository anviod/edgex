import { createRouter, createWebHashHistory } from 'vue-router'
import { globalState } from '../composables/useGlobalState'
import { configStore } from '../stores/app.js'

import Dashboard from '../views/Dashboard.vue'
import ChannelList from '../views/ChannelList.vue'
import DeviceList from '../views/DeviceList.vue'
import PointList from '../views/PointList.vue'
import Northbound from '../views/Northbound.vue'
import VirtualShadowDevices from '../views/VirtualShadowDevices.vue'
import EdgeCompute from '../views/EdgeCompute.vue'
import EdgeComputeMetrics from '../views/EdgeComputeMetrics.vue'
import SystemSettings from '../views/SystemSettings.vue'
import LogViewer from '../views/LogViewer.vue'
import Login from '../views/Login.vue'
import NodeSync from '../views/NodeSync.vue'
import Install from '../views/Install.vue'

const routes = [
    {
        path: '/install',
        component: Install,
        meta: { title: '系统安装配置' }
    },
    {
        path: '/login',
        component: Login,
        meta: { title: '登录' }
    },
    { 
        path: '/', 
        component: Dashboard,
        meta: { title: '首页监控' }
    },
    { 
        path: '/logs', 
        component: LogViewer,
        meta: { title: '系统日志' }
    },
    { 
        path: '/system', 
        component: SystemSettings,
        meta: { title: '系统设置' }
    },
    { 
        path: '/channels', 
        component: ChannelList,
        meta: { title: '采集通道' }
    },
    { 
        path: '/edge-compute', 
        component: EdgeCompute,
        meta: { title: '边缘计算' }
    },
    { 
        path: '/channels/:channelId/devices', 
        component: DeviceList,
        meta: { title: '设备列表' } 
    },
    { 
        path: '/channels/:channelId/devices/:deviceId/points', 
        component: PointList,
        meta: { title: '点位数据' }
    },
    { 
        path: '/virtual-shadows', 
        component: VirtualShadowDevices,
        meta: { title: '虚拟设备' }
    },
    { 
        path: '/northbound', 
        component: Northbound,
        meta: { title: '北向上报' }
    },
    { 
        path: '/node-sync', 
        component: NodeSync,
        meta: { title: '节点同步' }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    globalState.navTitle = '';

    const publicPages = ['/login', '/install'];
    const authRequired = !publicPages.includes(to.path);

    const config = configStore()

    const installed = await config.checkInstallStatus()

    if (!installed && to.path !== '/install') {
        return next('/install');
    }

    if (installed && to.path === '/install') {
        return next('/login');
    }

    let hasValidToken = false
    const stored = localStorage.getItem('loginInfo')
    if (stored) {
        try {
            const parsed = JSON.parse(stored)
            if (parsed && parsed.token) {
                hasValidToken = true
            } else {
                localStorage.removeItem('loginInfo')
            }
        } catch (e) {
            localStorage.removeItem('loginInfo')
        }
    }

    if (authRequired && !hasValidToken) {
        return next('/login');
    }

    next();
})

export default router
