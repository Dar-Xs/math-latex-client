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
          v-if="GPTAnswer != ''"
          class="rounded-borders q-mx-lg q-mt-sm"
          style="overflow: hidden"
        >
          <q-card-section>
            <KatexFormula :formula="GPTAnswer" no-error />
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding style="display: flex; flex-direction: column">
        <div class="row q-gutter-md" style="flex: 0 1 auto">
          <q-input
            class="col"
            v-model="password"
            outlined
            type="password"
            label="Access Key"
          />
          <q-input class="col" v-model="jsonData" label="data" />
          <q-btn
            class="self-center"
            push
            label="Try"
            no-caps
            @click="fetchAPI"
          />
          <q-btn
            class="self-center"
            push
            label="Clear"
            no-caps
            @click="clearCanvas"
          />
        </div>
        <div style="margin-top: 1rem"></div>
        <div ref="canvasWrapper" class="canvas-wrapper" style="flex: 1 1 auto">
          <canvas
            ref="canvas"
            style="border: 1px solid rgba(0, 0, 0, 0.24); border-radius: 0.5rem"
          ></canvas>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { fabric } from 'fabric';
import KatexFormula from 'src/components/katex/KatexFormula.vue';
import MathQuestion from '../question/MathQuestion.vue';
import axios from 'axios';
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
const jsonData = computed({
  get: () => JSON.stringify(data.value),
  set: (newVal) => {
    data.value = JSON.parse(newVal);
  },
});

let canvas: any = ref(null);
let canvasWrapper = ref();

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});

// 初始化画板
function initCanvas() {
  if (canvasWrapper.value) {
    canvas.value = new fabric.Canvas(
      canvasWrapper.value.children[0] as HTMLCanvasElement,
      {
        isDrawingMode: true,
        backgroundColor: 'white', // 设置背景色为白色
      }
    );
    canvas.value.freeDrawingBrush.width = 5; // 设置线宽
    canvas.value.freeDrawingBrush.color = 'black'; // 设置画笔颜色为黑色

    resizeCanvas();
  }
}

// 画板大小自适应容器
function resizeCanvas() {
  if (canvas.value && canvasWrapper.value) {
    canvas.value.setWidth(canvasWrapper.value.clientWidth);
    canvas.value.setHeight(canvasWrapper.value.clientHeight);
    canvas.value.renderAll();
  }
}

watch(canvasWrapper, (newValue) => {
  if (newValue) {
    resizeCanvas();
  }
});

const clearCanvas = () => {
  if (!canvas.value) return;
  canvas.value.clear().renderAll(); // 清除画板
  canvas.value.backgroundColor = 'white'; // 重新设置背景色为白色
};

const canvasOCR = async () => {
  if (!canvas.value) return;
  const imageURL = canvas.value.toDataURL({ format: 'png' });
  // Create a FormData instance
  const formData = new FormData();
    formData.append('image', dataURLtoBlob(imageURL));

    // Submit using axios
    try {
      const response = await axios.post('https://server.simpletex.cn/api/latex_ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': import.meta.env.VITE_Simpletex_API_Key
        }
      });
      return response.data.res.latex;
    } catch (error) {
      console.error("Error submitting the image:", error);
    }
};

// Convert DataURL to Blob for FormData
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const matchResult = arr[0].match(/:(.*?);/);
  
  if (!matchResult) {
    throw new Error('Invalid DataURL format');
  }

  const mime = matchResult[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}


const GPTAnswer = ref('');
const fetchAPI = async () => {
  const userAnswer = await canvasOCR();

  const response = await fetch('/api/GPT/answer', {
    method: 'POST',
    body: JSON.stringify({
      key: password.value,
      question: data.value.question,
      hint: data.value.hint,
      answer: userAnswer,
    }),
  });
  if (!response.body) {
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  const handler = (str: string) => {
    if (str === 'data: [DONE]') {
      console.debug('GPT API done');
      return;
    }
    GPTAnswer.value =
      GPTAnswer.value +
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
