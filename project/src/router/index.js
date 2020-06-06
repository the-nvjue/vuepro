import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import User from "../components/user/User";
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/Categories'
Vue.use(VueRouter)

  const routes = [
      {path:'/',redirect:"/login"},
      {path:'/login',component:Login},
      {
          path:'/home',
          component:Home,
          redirect:'/welcome',
          children:[
              {path:'/welcome',component:Welcome},
              {path:'/users',component:User},
              {path:'/rights',component:Rights},
              {path:'/roles',component:Roles},
              {path:'/categories',component:Categories}
          ]},

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{
    if(to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
})

export default router
