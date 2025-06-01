import AccessEnum from '@/access/accessEnum'
import type { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/user',
    name: '用户',
    meta: {
      isHidden: true,
      title: '用户',
    },
    children: [
      {
        path: '',
        redirect: '登录',
        name: '重定向',
        meta: {
          title: '重定向',
        },
      },
      {
        path: 'login',
        name: '登录',
        component: () => import('@/views/user/UserLoginView.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'register',
        name: '注册',
        component: () => import('@/views/user/UserRegisterView.vue'),
        meta: {
          title: '注册',
        },
      },
    ],
  },
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/IndexView.vue'),
    meta: {
      title: '首页',
    },
  },

  {
    path: '/questionBank',
    name: '题库',
    component: () => import('@/views/QuestionBankView.vue'),
    meta: {
      access: AccessEnum.NOT_LOGIN,
      title: '题库',
    },
  },

  {
    path: '/competition',
    name: '竞赛',
    component: () => import('@/views/CompetitionView.vue'),
    meta: {
      access: AccessEnum.NOT_LOGIN,
      title: '竞赛',
    },
  },
  {
    path: '/rankingList',
    name: '排行榜',
    component: () => import('@/views/RankingListView.vue'),
    meta: {
      access: AccessEnum.NOT_LOGIN,
      title: '排行榜',
    },
  },
  {
    path: '/management',
    name: '后台管理',
    meta: {
      access: AccessEnum.ADMIN,
      title: '后台管理',
    },
    component: () => import('@/layouts/ManagementLayouts.vue'),
    children: [
      {
        path: '',
        redirect: '/management/index',
        name: 'managementRed',
        meta: {
          title: '后台管理首页',
        },
      },
      {
        path: 'competition',
        name: 'competitionManagement',
        component: () => import('@/views/management/CompetitionManagement.vue'),
        meta: {
          title: '竞赛管理',
        },
      },
      {
        path: 'index',
        name: 'managementIndex',
        component: () => import('@/views/management/IndexView.vue'),
        meta: {
          title: '后台首页',
        },
      },
      {
        path: 'loginLog',
        name: 'managementloginLog',
        component: () => import('@/views/management/LoginLogView.vue'),
        meta: {
          title: '登录日志',
        },
      },
      {
        path: 'user',
        name: 'managementUser',
        component: () => import('@/views/management/UserView.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'question',
        name: 'managementQuestion',
        component: () => import('@/views/management/QuestionView.vue'),
        meta: {
          title: '题目管理',
        },
      },
      {
        path: 'questionSubmit',
        name: 'managementQuestionSubmit',
        component: () => import('@/views/management/QuestionSubmitView.vue'),
        meta: {
          title: '提交记录',
        },
      },
      {
        path: 'tag',
        name: 'managementTag',
        component: () => import('@/views/management/TagView.vue'),
        meta: {
          title: '标签管理',
        },
      },
      {
        path: 'question/put',
        name: 'managementQuestionPut',
        component: () => import('@/views/management/question/QuestionPutView.vue'),
        meta: {
          title: '添加题目',
        },
      },
      {
        path: 'question/edit/:id',
        name: 'managementQuestionEdit',
        component: () => import('@/views/management/question/QuestionEditView.vue'),
        meta: {
          title: '编辑题目',
        },
      },
    ],
  },
  {
    path: '/personalCenter',
    name: '个人中心',
    meta: {
      isHidden: true,
    },
    component: () => import('@/views/PersonalCenterView.vue'),
  },
  {
    path: '/competitionInfo/:id',
    name: '竞赛详情',
    meta: {
      isHidden: true,
    },
    component: () => import('@/views/CompetitionInfo.vue'),
  },
  {
    path: '/competitionQuestion/:competitionId/:questionId?',
    name: '竞赛题目',
    meta: {
      isHidden: true,
      access: AccessEnum.USER,
    },
    component: () => import('@/views/question/CompetitionQuestionView.vue'),
  },
  {
    path: '/questionView/:id',
    name: '题目作答页',
    component: () => import('@/views/question/QuestionSubmitView.vue'),
    meta: {
      isHidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NoFind',
    meta: {
      isHidden: true,
    },
    component: () => import('@/views/NoFindView.vue'),
  },
]

export default routes
