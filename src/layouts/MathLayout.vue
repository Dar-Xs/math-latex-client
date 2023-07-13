<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Math <KatexFormula formula="$\LaTeX$"/>
        </q-toolbar-title>

        <div>by DarXs</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import KatexFormula from 'src/components/katex/KatexFormula.vue';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Github',
    caption: 'Dar-Xs/math-latex-client',
    icon: 'code',
    link: 'https://github.com/Dar-Xs/math-latex-client'
  },
  {
    title: 'Telegram Chat Group',
    caption: 'DarXs_Math_LaTeX',
    icon: 'chat',
    link: 'https://t.me/DarXs_Math_LaTeX'
  }
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
