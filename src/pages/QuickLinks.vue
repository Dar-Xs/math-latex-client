<template>
  <div class="q-ma-md q-gutter-md">
    <q-btn push no-caps color="white" text-color="black" label="Math question demo" @click="router.push('/question/GS/9/1')"/>
    <q-btn push no-caps color="white" text-color="black" label="Latex editor demo" @click="router.push('/demo/katex')"/>
    <q-btn push no-caps color="white" text-color="black" label="catalogue demo" @click="router.push('/demo/catalogue')"/>
    
    <q-btn-dropdown push no-caps color="white" text-color="black" label="note demo">
      <q-list>
        <q-item clickable v-close-popup @click="router.push('/demo/note/editor')">
          <q-item-section>
            <q-item-label>editor</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="router.push('/demo/note/gpt')">
          <q-item-section>
            <q-item-label>gpt</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
  
</script>
