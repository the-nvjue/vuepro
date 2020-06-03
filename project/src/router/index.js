import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home";
import Categories from "../views/Categories";
import Cart from "../views/Cart";
import My from "../views/My";
import Search from "../views/Search";

Vue.use(VueRouter)

  const routes = [
      {
          path:'/',
          redirect:{
              name:'Home'
          }
      },
      {
          path:'/home',
          component:Home,
          name:'Home'
      },
      {
          path:'/categories',
          component:Categories,
          name:'Categories',
          meta:{
              flag:true
          }
      },
      {
          path:'/cart',
          component:Cart,
          name:'Cart'
      },
      {
          path:'/my',
          component:My,
          name:'My'
      },
      {
          path:'/search',
          component:Search,
          name:'Search'
      }

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
