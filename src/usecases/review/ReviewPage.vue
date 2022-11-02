<script setup lang="ts">
import { ref } from 'vue'

import AppSpinner from '@/components/AppSpinner.vue'
import { ArticleEntry, getAirtableService, getSubmission } from '@/services/airtable';
import { useRouteParams, useRouteQuery } from '@vueuse/router'

const loading = ref(true)
const error = ref<string | null>(null)

const articleId = useRouteParams('articleId', '')
const key = useRouteQuery('k')
const submission = ref<ArticleEntry>()

async function loadArticle() {
    try {
        const service = getAirtableService(key.value as string)
        submission.value = await getSubmission(service, articleId.value as string)
    } catch (err : any) {
        console.error(err)
        error.value = err.toString()
    } finally {
        loading.value = false
    }
    
}

loadArticle()

</script>

<template>
    <AppSpinner v-if="loading">Loading article..</AppSpinner>
    <div v-else>
        <div v-if="error">
            <h1>Failed</h1>
            <p>
                Sorry, we failed to find or load your article. Please check the URL and try again.
            </p>
            <p>
                If it still doesn't work <a href="mailto:ddikman@gmail.com">send us an email.</a>
            </p>
        </div>
        <div v-else>
            <h1>Your submission</h1>
            <p>{{ submission.english }}</p>
        </div>
    </div>
</template>