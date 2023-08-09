<template>
  <q-input
    class="q-mb-md"
    v-model="password"
    filled
    type="password"
    hint="Password"
  />
  <q-btn push label="fetch" @click="fetchAPI" />
  <KatexFormula :formula="formula" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import KatexFormula from '../katex/KatexFormula.vue';

const password = ref('');
const formula = ref('');

const fetchAPI = async () => {
  const response = await fetch('/api/GPT/answer', {
    method: 'POST',
    body: JSON.stringify({
      key: password.value,
      question:
        '设$f(x)$可导，且$\\underset{x \\to +\\infty}{\\lim} f(x)=1, \\underset{x \\to +\\infty}{\\lim}\\int_{x}^{x+2} t\\sin \\frac3tf(t)\\mathrm{d}t=(\\ ).$',
      hint: '由积分中值定理知,存在$\\xi \\in [x,x+2]$，使 \n$$\n\\int_{x}^{x+2} t\\sin \\frac3tf(t)\\mathrm{d}t=\n\\xi\\sin \\frac3\\xi f(\\xi)(x+2-x),\n$$\n带入原式得：\n$$\n\\begin{align*}\n&\\ \\lim_{x \\to +\\infty}\\int_{x}^{x+2} t\\sin \\frac3tf(t)\\mathrm{d}t\\\\\n= &\\ 2\\lim_{x \\to +\\infty}\\xi\\sin \\frac3\\xi f(\\xi) \\\\\n= &\\ 2\\lim_{x \\to +\\infty}3f(\\xi)\\\\\n= &\\ 6\n\\end{align*}\n$$',
      answer:
        '由积分中值定理知,存在$\\xi \\in [x,x+2]$，使 \n$$\n\\int_{x}^{x+2} t\\sin \\frac3tf(t)\\mathrm{d}t=\n\\xi\\sin \\frac3\\xi f(\\xi)(x+2-x),\n$$\n带入原式得：\n$$\n\\begin{align*}\n&\\ \\lim_{x \\to +\\infty}\\int_{x}^{x+2} t\\sin \\frac3tf(t)\\mathrm{d}t\\\\\n= &\\ 2\\lim_{x \\to +\\infty}\\xi\\sin \\frac3\\xi f(\\xi) \\\\\n= &\\ 2\\lim_{x \\to +\\infty}3f(\\xi)\\\\\n= &\\ 0\n\\end{align*}\n$$',
    }),
  });
  if (!response.body) {
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  const handler = (str: string) => {
    console.log(str);
    if (str === 'data: [DONE]') {
      return;
    }
    formula.value =
      formula.value +
      JSON.parse(str.substring(6))
        .choices.map((x: { delta: { content: string } }) => x.delta.content)
        .join('');
  };
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const data = decoder.decode(value, { stream: true });
    buffer += data;
    if (buffer.startsWith('{')) {
      console.log(buffer);
      break;
    }
    if (buffer.includes('\n\n')) {
      const chunks = buffer.split('\n\n');
      for (let i = 0; i < chunks.length - 1; ++i) {
        handler(chunks[i]);
      }
      buffer = chunks[chunks.length - 1];
    }
  }
  decoder.decode();
};
</script>
