<script setup lang="ts">

defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

</script>

<template>
    <button :disabled="disabled" :class="type" @click="$emit('click')"><slot></slot></button>
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

button:disabled {
    opacity: 0.4;
    cursor: default;
}

button.primary {
  background-color: var(--primary-color);
  color: white;
}

button.primary:hover {
  background-color: var(--primary-weak-color);
  color: white;
  transition: ease-in-out 0.05s;
}

button.secondary {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background-color: white;
}

button.secondary:hover {
  color: var(--primary-weak-color);
  border: 1px solid var(--primary-weak-color);
  background-color: white;
  transition: ease-in-out 0.05s;
}

button.destructive {
  background-color: var(--destructive-color);
  color: white;
  transition: ease-in-out 0.05s;
}

button.destructive:hover {
  background-color: var(--destructive-weak-color);
}

</style>