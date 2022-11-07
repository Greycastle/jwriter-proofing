<script setup lang="ts">

import AppButton from './AppButton.vue';

defineProps({
    closeLabel: {
        type: String,
        default: 'Close',
    }
})

const emit = defineEmits(['close', 'cancel'])

function close() {
    emit('close')
}

function cancel() {
    emit('cancel')
}

</script>

<template>
    <div class="modal-overlay" @click="cancel">
        <div class="modal" @click.stop>
            <slot></slot>
            <div class="buttons">
                <AppButton type="secondary" @click="cancel">Cancel</AppButton>
                <AppButton @click="close">{{ closeLabel }}</AppButton>
            </div>
        </div>
    </div>
</template>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  background-color: white;
  min-width: 400px;
  margin-top: 10%;
  padding: 16px 32px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons {
    margin-top: 1em;
    display: flex;
    flex-direction: row;
    gap: 12px;
}
</style>