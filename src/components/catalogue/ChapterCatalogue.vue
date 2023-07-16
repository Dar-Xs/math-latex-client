<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="GS"
      node-key="label"
      label-key="name"
    >
      <template v-slot:default-header="prop">
        <q-btn
          v-if="!prop.node.children"
          align="left"
          class="full-width"
          flat
          dense
          size="md"
          color="white"
          text-color="black"
          :label="prop.node.name"
          @click="show(prop.node)"
        />
        <div v-else>
          {{ prop.node.name }}
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import catalogue from 'assets/catalogue/catalogue.json';
const GS = catalogue[0].catalogue;

interface Leaf {
  name: string;
  label: string;
  selectable?: boolean;
  children?: Leaf[];
}

const router = useRouter();

const show = (target: Leaf) => {
  if (target.children) return;

  router.replace({
    name: 'single-question',
    params: { db: 'GS', chapter: target.label, sn: '1' },
  });
};
</script>
