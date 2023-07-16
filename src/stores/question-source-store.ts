import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import delay from '../utils/time';

const dev = import.meta.env.VITE_ENV == 'development';
export const useQuestionStore = defineStore('question-source', {
  state: () => ({
    fetchState: {
      loading: true,
      alert: false,
      alertMessage: '',
    },
    questionData: {
      question: String.raw`$f(x)=\cos x-\sin 2x+3\sin 3x$的最小正周期为$( )$.`,
      choices: [
        '最小正周期为$2\\pi$',
        '最小正周期为$\\pi$',
        '最小正周期为$\\frac12\\pi$',
        '无法判断最小正周期',
      ],
      answer: 0,
      difficulty: 0,
      hint: String.raw`因$\sin x$、$\sin 2x$、$\sin 3x$最小正周期分别是: $$2\pi,\pi,\frac{2\pi}{3}$$故$f(x)$的最小正周期为$2\pi$.`,
    },
  }),
  getters: {},
  actions: {
    
    async fetchQuestion(db: string, chapter: number, sn: number ) {
      this.fetchState.loading = true;
      const body = await api.get(
        `/api/${db}/CH/${chapter}/SN/${sn}`
      );
      if (dev) await delay(500);
      if (body.data.success) {
        const data = body.data.data;
        this.questionData.question = data.question;
        this.questionData.choices = data.choices;
        this.questionData.hint = data.hint;
        this.questionData.difficulty = data.difficulty;
        this.fetchState.loading = false;
      } else {
        this.router.back();
        this.fetchState.alertMessage = body.data.message;
        this.fetchState.alert = true;
      }
    },
    setAlert(showAlert: boolean) {
      this.fetchState.alert = showAlert;
    },
  },
});
