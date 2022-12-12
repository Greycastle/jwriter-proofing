<script setup lang="ts">

import AppButton from '@/components/AppButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

function goto(path: string) {
    router.push(path);
}

</script>

<template>
    <div class="page-container">
        <h1>Japanese proof-reading</h1>
        <p>This site holds proof-reading tools and review tools for Japanese texts.</p>
        <p>It was built as a part of a service called JWriter which later got closed due to a lack of usage.</p>
        <p>For now, this tool is still possible to use though, we have a few example articles you can try proof-reading and you may also want to check the proof-reader editor inteface.</p>
        <div class="buttons">
            <AppButton @click="goto('/demo')">Demo</AppButton>
            <AppButton @click="goto('/proof-read')">Proof-reading</AppButton>
        </div>
        <p>
            You may also be interested in the full source code for this project at <a href="https://github.com/Greycastle/jwriter-proofing">GitHub</a>
        </p>
    </div>
</template>

<style scoped>
.buttons {
    display: flex;
    flex-direction: row;
    gap: 32px;
    justify-content: center;
}
</style>