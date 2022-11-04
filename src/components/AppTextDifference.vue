<script setup lang="ts">

import { computed } from 'vue'
import { diffChars } from 'diff'

const props = defineProps({
    edited: {
        type: String,
        required: true
    },
    original: {
        type: String,
        required: false
    }
})

function getClass(part: any) : string {
  if (part.removed) {
    return 'removed'
  } else if (part.added) {
    return 'added'
  }
  return 'null'
}

const content = computed<any[]>(() => {
  return diffChars(props.original, props.edited)
})

</script>

<template>
    <p>
      <span v-for="part of content" v:key="part.value" :class="getClass(part)">{{ part.value }}</span>
    </p>
</template>

<style scoped>
.removed {
  color: rgb(215, 57, 57);
  padding: 0 4px;
  opacity: 0.5;
  text-decoration: line-through;
}

.added {
  background-color: rgb(182, 255, 182);
  padding: 0 4px;
}
</style>