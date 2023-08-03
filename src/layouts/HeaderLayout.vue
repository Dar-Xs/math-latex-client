<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>
            <KatexFormula formula="Math $\LaTeX$" />
          </q-toolbar-title>
          <div>by DarXs</div>
        </q-toolbar>
        <q-ajax-bar color="secondary" size="0.4rem" />
      </q-header>
  
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup lang="ts">
  import KatexFormula from 'src/components/katex/KatexFormula.vue';
  </script>
  