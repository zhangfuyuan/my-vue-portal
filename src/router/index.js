import Vue from 'vue'
import Router from 'vue-router'

// import Home from '@/components/home/Home'
// import Error from '@/components/Error'
// import Guardian from "@/components/guardian/Guardian"
// import VoucherView from '@/components/voucher_center/VoucherView'
// import Personal from '@/components/personal_center/Personal'
// import bbs from '@/components/bbs/Bbs'
// import langoMain from '@/components/lango/Main'
import langoMainHome from '@/components/lango/MainHome'
import langoMainView from '@/components/lango/MainView'

Vue.use(Router)

export default new Router({
  //  mode: "history",
  routes: [{
      path: '/',
      name: 'home',
      component: langoMainHome
    },
    // {
    //   path: '/apm',
    //   name: 'apm',
    //   component: langoMain
    // },
    // {
    //   path: '/guard',
    //   name: 'guard',
    //   component: langoMain
    // },
    {
      path: '/view',
      name: 'view',
      component: langoMainView
    },
    {
      path: '*',
      name: '404',
      component: langoMainHome
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
