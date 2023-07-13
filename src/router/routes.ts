import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/demo',
    component: () => import('layouts/MathLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'katex',
        component: () => import('components/katex/KatexFormulaDemo.vue'),
      },
      {
        path: 'question',
        component: () => import('components/question/QuestionDemo.vue'),
      },
    ],
  },
  {
    path: '/quasar/demo',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
