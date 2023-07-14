<template>
  <q-btn push :label="label" icon="done" :color="pushed ? trueColor : falseColor"
    :text-color="pushed ? trueTextColor : falseTextColor" @click="updateValue()" />
</template>

<script setup lang="ts">

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  trueColor: {
    type: String,
    default: 'primary'
  },
  falseColor: {
    type: String,
    default: 'white'
  },
  trueTextColor: {
    type: String,
    default: 'white'
  },
  falseTextColor: {
    type: String,
    default: 'black'
  },
  pushed: {
    type: Boolean,
    required: true
  },
});

const emit = defineEmits(['update:pushed'])

function updateValue() {
  emit('update:pushed', !props.pushed);
  console.log(123);
  
}

</script>