import { createRouter, createWebHistory } from 'vue-router'

import ProofreadPage from '@/usecases/proofread/ProofreadPage.vue'
import ReviewPage from '@/usecases/review/ReviewPage.vue'
import DemoPage from '@/usecases/demo/DemoPage.vue'
import NotFoundPage from '@/usecases/not-found/NotFoundPage.vue'
import IndexPage from '@/usecases/home/IndexPage.vue'

const routes = [
    { path: '/', component: IndexPage },
    { path: '/proof-read', component: ProofreadPage },
    { path: '/review/:articleId', component: ReviewPage },
    { path: '/demo', component: DemoPage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
  
export default router