<template>
  <q-layout view="hHh Lpr LFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <KatexFormula formula="Math $\LaTeX$" />
        </q-toolbar-title>
        <div>by DarXs</div>
      </q-toolbar>
      <q-ajax-bar color="secondary" size="0.4rem" />
    </q-header>
    <q-drawer
      :width="480"
      v-model="drawerLeft"
      behavior="desktop"
      bordered
      style="display: flex; flex-direction: column"
    >
      <MathQuestion
        :question="data.question"
        :question-id="data.questionId"
        :choices="data.choices"
        :hint="data.hint"
        :difficulty="data.difficulty"
        :random="data.random"
        style="margin: 0; padding-bottom: 1rem"
      />

      <q-scroll-area class="fit">
        <q-card
          class="rounded-borders q-mx-lg q-mt-sm"
          style="overflow: hidden"
        >
          <q-expansion-item
            expand-separator
            v-for="(e, index) in data.steps"
            :key="index"
            :label="e.label"
            :caption="e.caption"
          >
            <q-card>
              <q-card-section>
                <KatexFormula :formula="e.content" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding style="display: flex; flex-direction: column">
        <div style="flex: 0 1 auto">
          <q-input
            v-model="password"
            outlined
            type="password"
            label="Access Key"
          />
        </div>
        <div style="flex: 1 1 auto; background-color: gray; margin-top: 1rem">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
          praesentium molestias a adipisci, dolore vitae odit, quidem
          consequatur optio voluptates asperiores pariatur eos numquam rerum
          delectus commodi perferendis voluptate?
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import KatexFormula from 'src/components/katex/KatexFormula.vue';
import MathQuestion from '../question/MathQuestion.vue';
const drawerLeft = ref(true);
const data = ref({
  question: 'question',
  questionId: 1,
  choices: ['choice 1 (answer)', 'choice 2', 'choice 3', 'choice 4'],
  hint: 'hint',
  difficulty: 0,
  random: true,
  steps: [
    { id: 1, label: 'label', caption: 'caption', content: '$\\LaTeX$content' },
  ],
});
const password = ref('');
</script>
