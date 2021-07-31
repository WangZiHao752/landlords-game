import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: ()=>import('../views/Login.vue')
  },
  {
    path:"/home",
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    children:[{
      path:'/home/beforeRoom',
      component: () => import(/* webpackChunkName: "about" */ '../views/BeforeRoom.vue'),
    },{
      path:"/home",
      redirect:"/home/beforeRoom"
    }]
  },
  {
    path:"/room",
    component: () => import(/* webpackChunkName: "about" */ '../views/Room.vue'),
  },
  {
    path:"/",
    redirect:"/login",
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
