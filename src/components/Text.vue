<script setup lang="ts">
import { ref, computed } from 'vue'
import { diffChars } from 'diff'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  original: {
    type: String,
    required: false
  },
  selectedParagraph: {
    type: Number,
    required: false
  }
})

const paragraphs = computed<any[]>(() => {
  const ps = props.text.split('\n\n')
  if (props.original) {
    const originalPs = props.original.split('\n\n')
    const newPs = new Array<string>()
    for (let l = 0; l < ps.length; ++l) {
      const diff = diffChars(originalPs[l], ps[l])
      newPs.push(diff)
    }
    return newPs
  }
  return ps
})

function isString(obj: any): boolean {
  return typeof obj === 'string'
}

function getClass(part: any) : string {
  if (part.removed) {
    return 'removed'
  } else if (part.added) {
    return 'added'
  }
  return 'null'
}

const emit = defineEmits({
  selected: (index: number) => true,
  updated: (text: string) => true
})

function bindValue(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  const text = [ ...paragraphs.value ]
  text[index] = target.innerText
  emit('selected', -1)
  emit('updated', text.join('\n\n'))
}

const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(props.text)
  copied.value = true 
  setTimeout(() => {
    copied.value = false
  }, 500)
}

const noChanges = computed(() => {
  return props.original && props.original === props.text
})

</script>

<template>
  <div class="text-block">
    <h2>{{ title }}</h2>
    <div class="alert" v-if="noChanges">
      No changes
    </div>
    <p v-for="content, index of paragraphs" v-bind:class="{ 'selected': selectedParagraph === index, 'copied': copied }" v:key="content" contenteditable="true" v-on:focus="emit('selected', index)" v-on:blur="bindValue($event, index)">
      <span v-if="isString(content)">{{ content }}</span>
      <div v-else>
        <span v-for="part of content" v:key="part.value" :class="getClass(part)">{{ part.value }}</span>
      </div>
    </p>
    <button v-on:click="copy" :disabled="copied">{{ copied ? 'copied..' : 'copy' }}</button>
  </div>
</template>

<style scoped>

.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.text-block p {
  text-align: left;
  padding: 4px 8px;
}

@keyframes copied {
  0% {
    color: auto;
    transform: translateY(0px);
  }
  25% {
    transform: translateY(5px);
  }
  50% {
    color: rgb(224, 69, 69); 
    transform: translateY(0px);
  }
  75% {
    transform: translateY(-5px);
  }
  100% {
    color: auto;
    transform: translateY(0px);
  }
}

.text-block p.copied {
  animation: copied 0.180s;
}

.text-block p:focus, .text-block p.selected {
  outline: none;
  background: rgb(242, 244, 255);
}

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
