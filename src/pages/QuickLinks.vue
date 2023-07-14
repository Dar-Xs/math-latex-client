<template>
  <div class="q-ma-md q-gutter-md">
    <q-btn push color="white" text-color="black" label="Math question demo" @click="router.push('/demo/question/9/1')"/>
    <q-btn push color="white" text-color="black" label="Latex editor demo" @click="router.push('/demo/katex')"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
  
</script>
