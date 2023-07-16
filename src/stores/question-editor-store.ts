import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import delay from '../utils/time';

const dev = import.meta.env.VITE_ENV == 'development';
export const useEditorStore = defineStore('editor-source', {
  state: () => ({
    questionData: {
      question: 'loading',
      choices: ['loading', 'loading', 'loading', 'loading'],
      hint: 'loading',
    },
    formula: {
      question: 'loading',
      choices: ['loading', 'loading', 'loading', 'loading'],
      hint: 'loading',
    },
    password: '',
  }),
  getters: {},
  actions: {
    async fetchQuestion(db: string, chapter: number, sn: number) {
      this.questionData.question = 'loading';
      this.questionData.choices[0] = 'loading';
      this.questionData.choices[1] = 'loading';
      this.questionData.choices[2] = 'loading';
      this.questionData.choices[3] = 'loading';
      this.questionData.hint = 'loading';
      this.formula.question = 'loading';
      this.formula.choices[0] = 'loading';
      this.formula.choices[1] = 'loading';
      this.formula.choices[2] = 'loading';
      this.formula.choices[3] = 'loading';
      this.formula.hint = 'loading';

      const body = await api.get(`/api/get/${db}/CH/${chapter}/SN/${sn}`);
      if (dev) await delay(500);
      if (body.data.success) {
        const data = body.data.data;
        this.questionData.question = data.IMG0;
        this.questionData.choices[0] = data.IMG1;
        this.questionData.choices[1] = data.IMG2;
        this.questionData.choices[2] = data.IMG3;
        this.questionData.choices[3] = data.IMG4;
        this.questionData.hint = data.IMG5;

        const nullCheck = (val: any) => {
          if (val) return val;
          return '';
        };

        this.formula.question = nullCheck(data.question);
        this.formula.choices[0] = nullCheck(data.choices[0]);
        this.formula.choices[1] = nullCheck(data.choices[1]);
        this.formula.choices[2] = nullCheck(data.choices[2]);
        this.formula.choices[3] = nullCheck(data.choices[3]);
        this.formula.hint = nullCheck(data.hint);
      }
    },
    async submitFormula(db: string, chapter: number, sn: number) {
      const body = await api.post(`/api/put/${db}/CH/${chapter}/SN/${sn}`, {
        key: this.password,
        QUESTION: this.questionData.question,
        CHIOCE1: this.questionData.choices[0],
        CHIOCE2: this.questionData.choices[1],
        CHIOCE3: this.questionData.choices[2],
        CHIOCE4: this.questionData.choices[3],
        HINT: this.questionData.hint,
      });
      if (body.data.success) {
        const data = body.data;
        console.log(data);
      } else {
        console.log(body.data);
      }
    },
  },
});
