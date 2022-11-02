import { createRouter, createWebHistory } from 'vue-router'

import ProofreadPage from './usecases/proofread/ProofreadPage.vue'

const routes = [
    { path: '/', component: ProofreadPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
  
export default router