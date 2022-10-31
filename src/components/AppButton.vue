<script setup lang="ts">

defineProps({
  type: {
    type: String,
    default: 'primary'
  }
})

defineEmits(['click'])

</script>

<template>
    <button :class="type" @click="$emit('click')"><slot></slot></button>
</template>

<style scoped>

button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

button:focus {
  outline: none;
}

button.primary {
  background-color: #2F80ED;
  color: white;
}

button.primary:hover {
  background-color: #74b0ff;
  color: white;
  transition: ease-in-out 0.05s;
}

button.secondary {
  color: #2F80ED;
  border: 1px solid #2F80ED;
  background-color: white;
}

button.secondary:hover {
  color: #74b0ff;
  border: 1px solid #74b0ff;
  background-color: white;
  transition: ease-in-out 0.05s;
}

button.destructive {
  background-color: #EB5757;
  color: white;
  transition: ease-in-out 0.05s;
}

button.destructive:hover {
  background-color: #e88b8b;
}

</style>