<template>
  <Question :question="question" :choices="choices" :answer-index="answer" :hint="hint" random :difficulty="difficulty" :questionId="parseInt(questionId)" />
</template>

<script setup lang="ts">
import Question from './MathQuestion.vue';
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';

const route = useRoute();
const chapterId = route.params.chapter;
const questionId = route.params.sn as string;

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

onMounted(async () => {
  const body = await api.get(`/GS/CH/${chapterId}/SN/${questionId}`);
  if(body.data.success) {
    const data = body.data.data;
    question.value = data.question
    choices.value = data.choices
    hint.value = data.hint
    difficulty.value = data.difficulty
  } else {
    console.log(body.data);
    
  }
})



</script>

