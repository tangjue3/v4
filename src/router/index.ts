import { createRouter, createWebHistory } from 'vue-router'
import { getAuthSession } from '@/lib/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/home',
      name: 'welcome',
      component: () => import('@/views/Welcome.vue'),
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/dialogue',
      name: 'dialogue',
      component: () => import('@/views/DialoguePage.vue'),
    },
    {
      path: '/chat',
      redirect: '/dialogue',
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
    },
    {
      path: '/learning-path',
      name: 'learning-path',
      component: () => import('@/views/LearningPath.vue'),
    },
    {
      path: '/evaluation',
      name: 'evaluation',
      component: () => import('@/views/Evaluation.vue'),
    },
    {
      path: '/reverse-evaluation',
      name: 'reverse-evaluation',
      component: () => import('@/views/ReverseEvaluation.vue'),
    },
    {
      path: '/knowledge-base',
      redirect: '/reverse-evaluation',
    },
    {
      path: '/tutoring',
      name: 'tutoring',
      component: () => import('@/views/Tutoring.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
    },
    {
      path: '/edu-mind',
      name: 'edu-mind',
      component: () => import('@/views/EduMind.vue'),
    },
    {
      path: '/resources',
      name: 'Resources',
      component: () => import('@/views/EduMind.vue'),
    },
    {
      path: '/universe',
      redirect: '/learning-path',
    },
    {
      path: '/trainflow',
      name: 'trainflow',
      component: () => import('@/views/TrainFlow.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const session = getAuthSession()

  if (to.meta.public) {
    if (!session) return true
    return session.role === 'admin' ? '/admin' : '/home'
  }

  if (!session) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && session.role !== 'admin') {
    return '/home'
  }

  return true
})

export default router
