import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MathLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('components/catalogue/ChapterCatalogue.vue'),
      },
    ],
  },
  {
    path: '/editor/:db/:chapter/:sn',
    name: 'question-latex-editor',
    component: () => import('components/katex/KatexFormulaEditer.vue')
  },
  {
    path: '/question',
    component: () => import('layouts/MathLayout.vue'),
    children: [
      { path: '', component: () => import('pages/QuickLinks.vue') },
      {
        path: ':db/:chapter/:sn',
        name: 'single-question',
        component: () => import('components/question/QuestionDemo.vue'),
      },
      {
        path: 'catalogue',
        component: () => import('components/catalogue/ChapterCatalogue.vue'),
      },
    ],
  },
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
        path: 'question/:chapter/:sn',
        component: () => import('components/question/QuestionDemo.vue'),
      },
      {
        path: 'catalogue',
        component: () => import('components/catalogue/ChapterCatalogue.vue'),
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
