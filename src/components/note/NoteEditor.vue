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
      <q-page padding>
        <q-card>
          <q-card-section>
            <div class="row q-gutter-md">
              <q-input class="col" v-model="jsonData" label="data" />

              <q-btn
                id="copy-demo-editor-json-data"
                class="self-center"
                push
                label="copy"
                no-caps
                :data-clipboard-text="jsonData"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md">
          <q-card-section>
            <div class="row q-gutter-md">
              <q-input
                class="col"
                v-model.number="data.questionId"
                type="number"
                label="SN"
              />

              <q-btn-toggle
                class="self-center"
                v-model="data.difficulty"
                push
                :toggle-color="['green', 'orange', 'red'][data.difficulty]"
                :options="[
                  { label: '简单', value: 0 },
                  { label: '中等', value: 1 },
                  { label: '困难', value: 2 },
                ]"
              />
            </div>
            <q-input autogrow v-model="data.question" label="Question" />
            <div v-for="(choice, index) in data.choices" :key="index">
              <q-input
                v-if="index == 0"
                autogrow
                v-model="data.choices[index]"
                :label="'Chioce 1 (answer)'"
              />
              <q-input
                v-else
                autogrow
                v-model="data.choices[index]"
                :label="'Chioce ' + (index + 1)"
              />
            </div>
            <q-input autogrow v-model="data.hint" label="Hint" />
          </q-card-section>
        </q-card>
        
        <q-card
          v-for="(step, index) in data.steps"
          :key="step.id"
          class="q-mt-md"
        >
          <q-card-section>
            <div class="row q-mb-sm">
              Step {{ index + 1 }}
              <q-space />
              <q-btn
                round
                flat
                color="primary"
                icon="close"
                size="sm"
                @click="removeStep(step.id)"
              />
            </div>
            <q-separator />
            <q-input v-model="data.steps[index].label" label="label" />
            <q-input v-model="data.steps[index].caption" label="caption" />
            <q-input
              autogrow
              v-model="data.steps[index].content"
              label="content"
            />
          </q-card-section>
        </q-card>
        <q-btn class="q-mt-md" no-caps push label="Add step" @click="addStep" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Clipboard from 'clipboard';
import { computed, onMounted, ref } from 'vue';
import KatexFormula from 'src/components/katex/KatexFormula.vue';
import MathQuestion from '../question/MathQuestion.vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();
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
  step_next_id: 2,
});

const addStep = () => {
  data.value.steps.push({
    id: data.value.step_next_id++,
    label: 'label',
    caption: 'caption',
    content: '$\\LaTeX$content',
  });
};
const removeStep = (id: number) => {
  data.value.steps = data.value.steps.filter((item) => item.id !== id);
};

const jsonData = computed({
  get: () => JSON.stringify(data.value),
  set: (newVal) => {
    data.value = JSON.parse(newVal);
  },
});

onMounted(() => {
  const clipboard = new Clipboard('#copy-demo-editor-json-data');
  clipboard.on('success', (e) => {
    
    $q.notify({
        progress: true,
        type: 'positive',
        message: 'Copied',
        icon: 'check_circle',
        color: 'white',
        textColor: 'primary',
        position: 'top-right',
      });
    e.clearSelection();
  });
  clipboard.on('error', (e) => {

    $q.notify({
        progress: true,
        type: 'warning',
        message: e.text,
        icon: 'warning',
        color: 'white',
        textColor: 'red',
        position: 'top-right',
      });
  });
});
</script>
