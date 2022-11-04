import { createRouter, createWebHistory } from 'vue-router'

import ProofreadPage from '@/usecases/proofread/ProofreadPage.vue'
import ReviewPage from '@/usecases/review/ReviewPage.vue'
import NotFoundPage from '@/usecases/not-found/NotFoundPage.vue'

const routes = [
    { path: '/', component: ProofreadPage },
    { path: '/review/:articleId', component: ReviewPage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
  
export default router