<template>
  <Question :question="question" :choices="choices" :answer-index="answer" :hint="hint" random :difficulty="difficulty"
    :questionId="parseInt(questionId as string)" :loading="loading" />


  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">出错了</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ alertMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import Question from './MathQuestion.vue';
import { watch, onMounted, ref, computed } from "vue";
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import delay from '../../utils/time'

const route = useRoute();
let chapterId = computed(() => route.params.chapter);
let questionId = computed(() => route.params.sn);

// question data example
const question = ref(String.raw`$f(x)=\cos x-\sin 2x+3\sin 3x$的最小正周期为$( )$.`);
const choices = ref([
  "最小正周期为$2\\pi$",
  "最小正周期为$\\pi$",
  "最小正周期为$\\frac12\\pi$",
  "无法判断最小正周期"
]);
const answer = ref(0);
const difficulty = ref(0);
const hint = ref(String.raw`因$\sin x$、$\sin 2x$、$\sin 3x$最小正周期分别是: $$2\pi,\pi,\frac{2\pi}{3}$$故$f(x)$的最小正周期为$2\pi$.`);

const alert= ref(false)
const alertMessage= ref("")
const dev = import.meta.env.VITE_ENV == "development"
const loading = ref(true);
const fetchQuestionData = async () => {
  loading.value = true;
  const body = await api.get(`/api/GS/CH/${chapterId.value}/SN/${questionId.value}`);
  if (dev) await delay(1000);

  if (body.data.success) {
    const data = body.data.data;
    question.value = data.question
    choices.value = data.choices
    hint.value = data.hint
    difficulty.value = data.difficulty
    loading.value = false;
  } else {
    alertMessage.value = body.data.message
    alert.value = true;
  }
};

onMounted(fetchQuestionData)
watch(() => route.params, fetchQuestionData);

</script>

