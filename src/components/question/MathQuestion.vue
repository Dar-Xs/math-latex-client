<template>
  <div class="q-pa-lg q-mx-auto" style="max-width: 720px;">
    <q-card>
      <q-card-section>
        <KatexFormula class="q-pa-md" :formula="question" />
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-option-group v-model="group" :options="options" color="primary">
          <template v-slot:label="opt">
            <KatexFormula :formula="opt.label" />
          </template>
        </q-option-group>
      </q-card-section>

      <q-expansion-item
      icon="manage_search"
      label="查看答案"
    >
      <q-card>
        <q-card-section>
          <KatexFormula :formula="hint" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import KatexFormula from '../katex/KatexFormula.vue';
import { shuffle } from '../../utils/array'

const props = defineProps<{
  question: string
  choices: string[]
  answerIndex: number
  hint: string
  random?: boolean
}>();

const options = computed(() => {
  const opts = props.choices.map((choice, index) => {
    return {
      value: index,
      label: choice
    }
  })
  if (props.random) {
    shuffle(opts);
  }
  return opts;
});

const group = ref();

</script>

