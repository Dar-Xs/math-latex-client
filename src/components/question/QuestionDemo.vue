<template>
  <Question
    :question="questionStore.questionData.question"
    :choices="questionStore.questionData.choices"
    :answer-index="questionStore.questionData.answer"
    :hint="questionStore.questionData.hint"
    :difficulty="questionStore.questionData.difficulty"
    :questionId="questionId"
    :loading="questionStore.fetchState.loading"
    random
  />

  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">出错了</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ questionStore.fetchState.alertMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import Question from './MathQuestion.vue';
import { watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

import { useQuestionStore } from 'stores/question-source-store';
const questionStore = useQuestionStore();

const questionId = computed(() => parseInt(route.params.sn as string));
const alert = computed({
  get: () => questionStore.$state.fetchState.alert,
  set: (value) => questionStore.setAlert(value),
});

watch(
  () => route.params,
  (newVal) => {
    questionStore.fetchQuestion(
      newVal.db as string,
      parseInt(newVal.chapter as string),
      parseInt(newVal.sn as string)
    );
  }
);

onMounted(() => {
  questionStore.fetchQuestion(
    route.params.db as string,
    parseInt(route.params.chapter as string),
    parseInt(route.params.sn as string)
  );
});
</script>
