<template>
  <div class="q-pa-lg q-mx-auto" style="max-width: 720px">
    <q-card>
      <div v-if="!loading">
        <q-badge :color="diffTag.color" floating>{{ diffTag.label }}</q-badge>
      </div>
      <q-card-section>
        <div class="q-px-md" style="display: block">
          <span class="row items-center">
            <span class="q-pr-xs"> {{ questionId + '.' }}</span>
            <q-skeleton
              v-if="loading"
              type="rect"
              style="width: 80%; height: 2rem"
            />
            <q-intersection v-else transition="jump-right" once>
              <img v-if="question.startsWith('data:image')" :src="question" />
              <KatexFormula v-else :formula="question" />
            </q-intersection>
          </span>
        </div>
      </q-card-section>
      <q-separator inset />

      <q-card-section class="q-pb-xs">
        <q-option-group v-model="group" :options="options" color="primary">
          <template v-slot:label="opt">
            <span class="row items-center">
              <span
                :class="[
                  'q-pr-xs',
                  {
                    'text-green': check && opt.value == answerIndex,
                    'text-red':
                      check && opt.value != answerIndex && opt.value == group,
                  },
                ]"
                >{{
                  String.fromCharCode('A'.charCodeAt(0) + opt['index']) + '.'
                }}</span
              >

              <q-skeleton
                v-if="loading"
                type="rect"
                style="width: 200px; height: 1.5rem"
              />
              <q-intersection v-else transition="jump-right" once>
                <div
                  v-if="opt.label.startsWith('data:image')"
                  :class="[
                    'bg-black',
                    {
                      'bg-green': check && opt.value == answerIndex,
                      'bg-red':
                        check && opt.value != answerIndex && opt.value == group,
                    },
                  ]"
                  style="display: inline-flex"
                >
                  <div style="display: inline-flex; margin: -1px">
                    <img :src="opt.label" style="mix-blend-mode: screen" />
                  </div>
                </div>
                <KatexFormula
                  v-else
                  :class="{
                    'text-green': check && opt.value == answerIndex,
                    'text-red':
                      check && opt.value != answerIndex && opt.value == group,
                  }"
                  :formula="opt.label"
                />
              </q-intersection>
            </span>
          </template>
        </q-option-group>
      </q-card-section>

      <q-card-section class="q-py-xs">
        <q-slide-transition>
          <div v-show="check" v-if="!loading" class="row items-start">
            解析：
            <img v-if="hint.startsWith('data:image')" :src="hint" />
            <KatexFormula v-else :formula="hint" />
          </div>
        </q-slide-transition>
      </q-card-section>

      <q-card-section class="row justify-center q-pt-sm">
        <q-btn-group push class="full-width">
          <q-btn
            push
            class="full-width"
            label="上一题"
            icon="keyboard_arrow_left"
            @click="goto(-1)"
          />
          <PushButton
            style="border: 1px solid rgba(0, 0, 0, 0.15); border-width: 0 1px"
            class="full-width"
            label="答案解析"
            icon="done"
            v-model:pushed="check"
          />
          <q-btn
            push
            class="full-width"
            label="下一题"
            icon="keyboard_arrow_right"
            @click="goto(1)"
          />
        </q-btn-group>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, toRef } from 'vue';
import KatexFormula from '../katex/KatexFormula.vue';
import { shuffle } from '../../utils/array';
import PushButton from '../PushButton.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps<{
  question: string;
  choices: string[];
  answerIndex: number;
  hint: string;
  random?: boolean;
  difficulty: number;
  questionId: number;
  loading?: boolean;
}>();

// 判断是否渲染latex
const imgMod = computed(() => {
  return props.question.startsWith('data:image');
});

//重置选项位置
const map: number[] = [];
for (let i = 0; i < props.choices.length; i++) {
  map.push(i);
}
let label = toRef(props, 'loading');
watch(label, () => {
  shuffle(map);
});

const options = computed(() => {
  const opts = props.choices.map((choice, index) => {
    return {
      value: index,
      index: 0,
      label: choice,
      color: !check.value
        ? 'primary'
        : index == props.answerIndex
        ? 'green'
        : 'red',
    };
  });
  return opts
    .map((opt, index) => opts[map[index]])
    .map((opt, index) => {
      opt.index = index;
      return opt;
    });
});

const group = ref();
const check = ref(false);

const diffTag = computed(() => {
  let ans = { label: '', color: '' };
  switch (props.difficulty) {
    case 0:
      ans = { label: '简单', color: 'green' };
      break;
    case 1:
      ans = { label: '中等', color: 'orange' };
      break;
    case 2:
      ans = { label: '困难', color: 'red' };
  }
  return ans;
});



const goto = (offset: number) => {
  router.push({name: 'single-question',params:{...router.currentRoute.value.params,sn:props.questionId+offset}});
};
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
