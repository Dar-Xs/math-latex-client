<template>
  <div class="row no-wrap q-col-gutter-md">
    <div class="col-4">
      <q-card class="full-height">
        <q-card-section v-if="!dense"> {{ label }} </q-card-section>
        <q-separator v-if="!dense" inset />
        <q-card-section>
          <img v-if="img.startsWith('data')" :src="img" />
          <q-skeleton v-else type="QToolbar" />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-4">
      <q-card class="full-height">
      <q-card-section v-if="!dense"> 渲染公式 </q-card-section>
      <q-separator v-if="!dense" inset />
      <q-card-section>
        <KatexFormula :formula="formula" />
      </q-card-section>
    </q-card>
    </div>

    <div class="col-4">
      <q-card class="full-height">
      <q-card-section>
        <q-input
          class="col"
          v-model="value"
          label="latex 公式"
          placeholder="在这里输入公式"
          autogrow
        />
      </q-card-section>
    </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import KatexFormula from './KatexFormula.vue';

const props = defineProps<{
  label: string;
  formula: string;
  img: string;
  dense?: boolean;
}>();

const emits = defineEmits(['update:formula']);
const value = computed({
  get: () => props.formula,
  set: (newValue) => {
    emits('update:formula', newValue);
  },
});
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
