import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home' // � 當使用者訪問根目錄時，自動跳轉到 /home
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Dashboard.vue'),
    },

    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path:'/OnLoginSuccess',
      name:'LoginSuccess',
      component: () => import('../views/LoginStatusView.vue'),

      props: route =>({token:route.query.token})

    },
    {
      path:'/OnErrorOccur',
      name:'OnErrorOccur',
      component: () => import('../views/ErrorView.vue'),


    },
    {
      path:'/OnNewUser',
      name:'OnNewUser',
      component: () => import('../views/NewUserView.vue'),

      props: route =>({token:route.query.token})

    },
    {
      path:'/product',
      name:'product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path:'/shopinfo',
      name:'shopinfo',
      component: () => import('../views/ShopInfoView.vue')
    }
    ,{
      path:'/shop',
      name:'shop',
      component: () => import('../views/ShopView.vue')
    }
    ,{
      path:'/productInfo',
      name:'productInfo',
      component: () => import('../views/ProductInfoView.vue')
    },
    {
      path:'/cart',
      name:'cart',
      component: () => import('../views/CartView.vue')

    },
    {
      path:'/orderInfo',
      name:'orderInfo',
      component: () => import('../views/OrderInfoView.vue')
    },
    {
      path:'/order',
      name:'order',
      component: () => import('../views/OrderView.vue')
    },

  ],
})

export default router
