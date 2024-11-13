import Vue from 'vue'
import VueRouter from 'vue-lang-router'
//import store from '../store'

import NProgress from 'nprogress'
import store from "../store"

import translations from '../lang/translations'
import localizedURLs from '../lang/localized-urls'

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter, {
  defaultLanguage: 'fr',
  translations,
  localizedURLs,
});

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/admin/dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register.vue')
  },

  /**************************** ADMIN ****************************/

  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/moderation',
    name: 'admin-moderation',
    component: () => import('../views/admin/moderation.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/simulation',
    name: 'admin-simulation',
    component: () => import('../views/admin/simulation.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/blockchain',
    name: 'blockchain',
    component: () => import('../views/admin/blockchain.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/:entityType?',
    name: 'admin-table',
    component: () => import('../views/admin/table.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/create-entity/:entityType/:entityId?',
    name: 'admin-virtual-form',
    component: () => import('../views/admin/virtual-form.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/import/:entityType?',
    name: 'admin-import',
    component: () => import('../views/admin/import.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/report-offer/:offerId',
    name: 'report-offer',
    component: () => import('../views/confirm/report-offer.vue'),
    meta: { requiresAuth: true }
  },

  /**************************** CUSTOM ****************************/

  {
    path: '/confirm-email/:userId/:emailToken',
    name: 'confirm-email',
    component: () => import('../views/confirm/confirm-email.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/confirm-register',
    name: 'confirm-register',
    component: () => import('../views/confirm/confirm-register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('../views/account/change-password.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password-init',
    component: () => import('../views/account/reset-password-init.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password/:userId/:pwdToken',
    name: 'reset-password-form',
    component: () => import('../views/account/reset-password-form.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/change-email',
    name: 'change-email',
    component: () => import('../views/account/change-email.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/delete-account',
    name: 'delete-account',
    component: () => import('../views/account/delete-account.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('../views/custom/profil.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/private/:userId',
    name: 'private',
    component: () => import('../views/custom/private.vue'),
    meta: { requiresAuth: false }
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
  setTimeout(()=>{
    window.scrollTo(0, 0)
  }, 200)
  
})

//avant chaque changement de route (url dans le navitateur)
router.beforeEach(async (to, from, next) => {
  if(to.meta != null //si cette route nécessite une authentification 
  && to.meta.requiresAuth == true){
    //vérifie que le user est connecté
    await store.dispatch('auth/checkAuth', null, { root: true })

    if(store.state.auth.isLogin) {//si le user est connecté
      if(to.meta != null //si cette route nécessite d'être admin
        && to.meta.requiresAdmin == true){
        if(store.getters['auth/isAdmin']) return next()//soit il est admin, et il peut y aller
        else return next('/login') //soit il est pas admin, il doit se logguer
      }else return next()
    }//si il n'est pas connecté, il doit se logguer
    else return next('/login')
  }else{//si la route n'a pas besoin d'authentification, il peut y aller
    return next()
  }
})


export default router
