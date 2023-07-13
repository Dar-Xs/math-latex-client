<template>
  <span v-html="elementArr"></span>
</template>

<script setup lang="ts">
import katex from 'katex';
import { computed } from 'vue';

const props = defineProps<{ 
  formula: string
}>();

const elementArr = computed(() => {
  const elements = props.formula.split('$$');
  const length = elements.length;
  const buffer = [];
  for (let i = 0; i < length; ++i) {
    if (i % 2 != 0) {// block
      buffer.push(renderMath(elements[i], true));
      continue;
    }
    if (!elements[i].includes("$")) {//text
      buffer.push(elements[i]);
      continue;
    }
    const inlineEles = elements[i].split('$');
    const length2 = inlineEles.length;
    for (let j = 0; j < length2; ++j) {
      if (j % 2 != 0) {
        buffer.push(" " + renderMath(inlineEles[j]) + " ");
      } else {
        buffer.push(inlineEles[j]);
      }
    }
  }
  return buffer.join('').replace(/ *[,] */g, ", ");
});

function renderMath(formula: string, block = false) {
  return katex.renderToString(formula, {
    throwOnError: false,
    displayMode: block
  })
}
</script>

