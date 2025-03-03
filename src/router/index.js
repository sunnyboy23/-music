import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view/index.vue'

const routes = [
  {
    path: '/',
    name: 'root',
    component: HomeView,
    redirect:"/m"
  },
  {
    path: '/m',
    name: 'home',
    component:HomeView, //首页
    redirect:"/m/recommend",
    children:[
      {
        path:"recommend",
        name:"recommend",
        component:()=>import("@/views/home-view/components/Recommend")
      },
      {
        path:"singer",
        name:"singer",
        component:()=>import("@/views/home-view/components/Singer")
      },
      {
        path:"ranking",
        name:"ranking",
        component:()=>import("@/views/home-view/components/Ranking")
      },
      {
        path:"search",
        name:"search",
        component:()=>import("@/views/home-view/components/Search")
      }
    ]
  },
  {
    path: '/m/playList/:id',
    name: 'playList',
    component: () => import ("@/views/PlayList.vue") // 歌单详情页
  },
  {
    path: '/m/SingerDetail/:id',
    name: 'SingerDetail',
    component: () => import ("@/views/SingerDetail.vue") // 歌手详情页
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
