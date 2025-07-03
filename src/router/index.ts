import { createRouter, createWebHistory } from 'vue-router'
import MatchView from '../views/MatchView.vue'
import ListView from '../views/ListView.vue'
import RankingView from '../views/RankingView.vue'
import ConfView from '../views/ConfView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'match',
      component: MatchView,
    },
    {
      path: '/list',
      name: 'list',
      component: ListView,
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: RankingView,
    },
    {
      path: '/conf',
      name: 'conf',
      component: ConfView,
    },
  ],
})

export default router
