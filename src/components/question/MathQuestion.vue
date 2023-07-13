<template>
  <div class="q-pa-lg q-mx-auto" style="max-width: 720px;">
    <q-card>
      <div>
        <q-badge :color="diffTag.color" floating>{{ diffTag.label }}</q-badge>
      </div>
      <q-card-section>
        <div class="q-px-md" style="display: block;">
          <span class="row items-center">
            <span class="q-pr-xs"> {{ questionId + "." }}</span>
            <KatexFormula v-if="!imgMod" :formula="question" />
            <img v-else :src="question" />
          </span>
        </div>
      </q-card-section>
      <q-separator inset />

      <q-card-section class="q-pb-xs">
        <q-option-group v-model="group" :options="options" color="primary">
          <template v-slot:label="opt">
            <span class="row items-center">
              <span :class="['q-pr-xs', {
                'text-green': check && opt.value == answerIndex,
                'text-red': check && opt.value != answerIndex && opt.value == group
              }]">{{ String.fromCharCode("A".charCodeAt(0) + opt['index']) + "." }}</span>
              <KatexFormula v-if="!imgMod" :class="{
                'text-green': check && opt.value == answerIndex,
                'text-red': check && opt.value != answerIndex && opt.value == group
              }" :formula="opt.label" />
              <img v-else :src="opt.label" />
            </span>
          </template>
        </q-option-group>
      </q-card-section>

      <q-card-section class="q-py-xs">
        <q-slide-transition>
          <div v-show="check">
            解析：
            <KatexFormula v-if="!imgMod" :formula="hint" />
            <img v-else :src="hint" />
          </div>
        </q-slide-transition>
      </q-card-section>

      <q-card-section class="row justify-center q-pt-sm">
        <q-btn-group push class="full-width">
          <q-btn push class="full-width" label="上一题" icon="keyboard_arrow_left" @click="goto(-1)" />
          <q-btn push style="border-left: 1px solid rgba(0, 0, 0, 0.15);border-right: 1px solid rgba(0, 0, 0, 0.15)"
            class="full-width" label="答案解析" icon="done" :color="check ? 'primary' : 'white'"
            :text-color="check ? 'white' : 'black'" @click="() => { check = !check }" />
          <q-btn push class="full-width" label="下一题" icon="keyboard_arrow_right" @click="goto(1)" />
        </q-btn-group>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import KatexFormula from '../katex/KatexFormula.vue';
import { shuffle } from '../../utils/array'
import { useRouter } from 'vue-router';
const router = useRouter();

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
  const opts = props.choices
    .map((choice, index) => {
      return {
        value: index,
        index: 0,
        label: choice,
        color: !check.value ? "primary" : (index == props.answerIndex ? "green" : "red")
      }
    })
  return opts
    .map((opt, index) => opts[map[index]])
    .map((opt, index) => {
      opt.index = index;
      return opt
    });
});

const group = ref();
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

const goto = (offset: number) => {

  const currentPath = router.currentRoute.value.path
  const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
  const lastPath = currentPath.substring(currentPath.lastIndexOf('/') + 1)
  router.push(parentPath + '/' + (parseInt(lastPath) + offset));
}

</script>

<style scoped>
img {
  max-width: 100%;
}
</style>