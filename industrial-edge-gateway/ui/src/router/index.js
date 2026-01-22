import { createRouter, createWebHashHistory } from 'vue-router'
import { globalState } from '../composables/useGlobalState'

import ChannelList from '../views/ChannelList.vue'
import DeviceList from '../views/DeviceList.vue'
import PointList from '../views/PointList.vue'
import Northbound from '../views/Northbound.vue'

const routes = [
    { 
        path: '/', 
        component: ChannelList,
        meta: { title: '采集通道' }
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
    next();
})

export default router
