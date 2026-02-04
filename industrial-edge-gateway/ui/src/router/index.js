import { createRouter, createWebHashHistory } from 'vue-router'
import { globalState } from '../composables/useGlobalState'

import Dashboard from '../views/Dashboard.vue'
import ChannelList from '../views/ChannelList.vue'
import DeviceList from '../views/DeviceList.vue'
import PointList from '../views/PointList.vue'
import Northbound from '../views/Northbound.vue'
import EdgeCompute from '../views/EdgeCompute.vue'
import EdgeComputeMetrics from '../views/EdgeComputeMetrics.vue'
import SystemSettings from '../views/SystemSettings.vue'
import LogViewer from '../views/LogViewer.vue'
import Login from '../views/Login.vue'

const routes = [
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
        path: '/northbound', 
        component: Northbound,
        meta: { title: '北向数据上报' }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // Clear custom nav title on route change
    globalState.navTitle = '';

    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);

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
