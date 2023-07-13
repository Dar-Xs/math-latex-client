<template>
  <div class="q-pa-lg q-mx-auto" style="max-width: 720px;">
    <q-card>
      <div>
        <q-badge :color="diffTag.color" floating>{{ diffTag.label }}</q-badge>
      </div>
      <q-card-section>
        <div class="q-px-md" style="display: block;">
          {{ questionId }}.
          <KatexFormula v-if="!imgMod" :formula="question" />
          <img v-else :src="question" />
        </div>
      </q-card-section>
      <q-separator inset />

      <q-card-section class="q-pb-xs">
        <q-option-group v-model="group" :options="options" color="primary">
          <template v-slot:label="opt">
            <KatexFormula v-if="!imgMod" :class="{
              'text-green': check && opt.value == answerIndex,
              'text-red': check && opt.value != answerIndex && opt.value == group
            }" :formula="opt.label" />
            <img v-else :src="opt.label" />
          </template>
        </q-option-group>
      </q-card-section>

      <q-card-section class="q-py-xs">
        <q-slide-transition>
          <div v-show="visible">
            解析：
            <KatexFormula v-if="!imgMod" :formula="hint" />
            <img v-else :src="hint" />
          </div>
        </q-slide-transition>
      </q-card-section>

      <q-card-section class="row justify-center q-pt-sm">
        <q-btn-group push class="full-width">
          <q-btn push class="full-width" label="检查" icon="done" 
          :color="check ? 'primary' : 'white'" :text-color="check ? 'white' : 'black'"
            @click="() => { check = !check }" />
          <q-btn push class="full-width" label="解析" icon="manage_search" 
          :color="visible ? 'primary' : 'white'" :text-color="visible ? 'white' : 'black'"
            @click="() => { visible = !visible }" />
        </q-btn-group>
      </q-card-section>
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
  difficulty: number
  questionId: number
}>();

const imgMod = computed(() => {
  return props.question.startsWith("data:image");
});


const map: number[] = [];
for (let i = 0; i < props.choices.length; i++) {
  map.push(i);
}
shuffle(map);
const options = computed(() => {
  const opts = props.choices.map((choice, index) => {
    return {
      value: index,
      label: choice,
      color: !check.value ? "primary" : (index == props.answerIndex ? "green" : "red")
    }
  })
  return opts.map((opt, index) => opts[map[index]]);
});

const group = ref();
const visible = ref(false);
const check = ref(false);

const diffTag = computed(() => {
  let ans = { label: "", color: "" };
  switch (props.difficulty) {
    case 0:
      ans = { label: "简单", color: "green" }
      break
    case 1:
      ans = { label: "中等", color: "orange" }
      break
    case 2:
      ans = { label: "困难", color: "red" }
  }
  return ans;
})

</script>

<style scoped>
img {
  max-width: 100%;
}
</style>