<template>
  <div class="q-pa-sm q-mx-auto q-mt-lg" style="max-width: 1440px">
    <q-input
      class="q-mb-md"
      v-model="password"
      filled
      type="password"
      hint="Password"
    />
    <KatexFormulaEditerRow
      label="题目"
      :img="editorStore.questionData.question"
      v-model:formula="question"
      class="q-mb-md"
    />
    <KatexFormulaEditerRow
      label="选项1"
      :img="editorStore.questionData.choices[0]"
      v-model:formula="choice1"
      class="q-mb-md"
      dense
    />
    <KatexFormulaEditerRow
      label="选项2"
      :img="editorStore.questionData.choices[1]"
      v-model:formula="choice2"
      class="q-mb-md"
      dense
    />
    <KatexFormulaEditerRow
      label="选项3"
      :img="editorStore.questionData.choices[2]"
      v-model:formula="choice3"
      class="q-mb-md"
      dense
    />
    <KatexFormulaEditerRow
      label="选项4"
      :img="editorStore.questionData.choices[3]"
      v-model:formula="choice4"
      class="q-mb-md"
      dense
    />
    <KatexFormulaEditerRow
      label="解析"
      :img="editorStore.questionData.hint"
      v-model:formula="hint"
      class="q-mb-md"
    />
  </div>
  <div class="q-mx-auto"></div>
  <div class="q-pa-sm q-mx-auto q-mt-lg" style="max-width: 720px">
    <q-btn-group push class="full-width">
      <q-btn
        push
        class="full-width"
        label="上一题"
        icon="keyboard_arrow_left"
        @click="goto(-1)"
      />
      <q-btn
        push
        style="border: 1px solid rgba(0, 0, 0, 0.15); border-width: 0 1px"
        class="full-width"
        label="更改"
        icon="done"
        @click="submit"
      />
      <q-btn
        push
        class="full-width"
        label="下一题"
        icon="keyboard_arrow_right"
        @click="goto(1)"
      />
    </q-btn-group>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import KatexFormulaEditerRow from './KatexFormulaEditerRow.vue';
import { useEditorStore } from 'stores/question-editor-store';
import { useRouter } from 'vue-router';
const router = useRouter();
const editorStore = useEditorStore();

const password = computed({
  get: () => editorStore.password,
  set: (newValue) => {
    editorStore.password = newValue;
  },
});

const question = computed({
  get: () => editorStore.formula.question,
  set: (newValue) => {
    editorStore.formula.question = newValue;
  },
});
const choice1 = computed({
  get: () => editorStore.formula.choices[0],
  set: (newValue) => {
    editorStore.formula.choices[0] = newValue;
  },
});
const choice2 = computed({
  get: () => editorStore.formula.choices[1],
  set: (newValue) => {
    editorStore.formula.choices[1] = newValue;
  },
});
const choice3 = computed({
  get: () => editorStore.formula.choices[2],
  set: (newValue) => {
    editorStore.formula.choices[2] = newValue;
  },
});
const choice4 = computed({
  get: () => editorStore.formula.choices[3],
  set: (newValue) => {
    editorStore.formula.choices[3] = newValue;
  },
});
const hint = computed({
  get: () => editorStore.formula.hint,
  set: (newValue) => {
    editorStore.formula.hint = newValue;
  },
});

const submit = () => {
  editorStore.submitFormula(
    'GS',
    parseInt(router.currentRoute.value.params.chapter as string),
    parseInt(router.currentRoute.value.params.sn as string)
  );
};

onMounted(() => {
  editorStore.fetchQuestion(
    'GS',
    parseInt(router.currentRoute.value.params.chapter as string),
    parseInt(router.currentRoute.value.params.sn as string)
  );
});

watch(
  () => router.currentRoute.value.params,
  (newVal) => {
    editorStore.fetchQuestion(
      newVal.db as string,
      parseInt(newVal.chapter as string),
      parseInt(newVal.sn as string)
    );
  }
);

const goto = (offset: number) => {
  router.replace({
    name: 'question-latex-editor',
    params: {
      ...router.currentRoute.value.params,
      sn: parseInt(router.currentRoute.value.params.sn as string) + offset,
    },
  });
};
</script>
