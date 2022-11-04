<script setup lang="ts">
import { ref, computed } from 'vue'

import TheUserHeader from '@/components/TheUserHeader.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import AppTextDifference from '@/components/AppTextDifference.vue';
import { ArticleEntry, getAirtableService, getSubmission } from '@/services/airtable';
import { useRouteParams, useRouteQuery } from '@vueuse/router'
import { getParagraphs } from '@/services/paragraphs';

const loading = ref(true)
const error = ref<string | null>(null)

const articleId = useRouteParams('articleId', '')
const key = useRouteQuery('k')
const submission = ref<ArticleEntry>()

const displayMode = ref('changes')

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

const paragraphs = computed<{ original: string[], proofed: string[] }>(() => {
    if (submission.value) {
        return {
            original: getParagraphs(submission.value.original),
            proofed: getParagraphs(submission.value.proofed)
        }
    }
    return {
        proofed: [],
        original: []
    }
})

</script>

<template>
    <AppSpinner v-if="loading">Loading article..</AppSpinner>
    <div v-else>
        <TheUserHeader></TheUserHeader>
        <div class="page-container">
            <div v-if="error">
                <h1>Failed</h1>
                <p>
                    Sorry, we failed to find or load your article. Please check the URL and try again.
                </p>
                <p>
                    If it still doesn't work <a href="mailto:ddikman@gmail.com">send us an email.</a>
                </p>
            </div>
            <div class="content" v-else>
                <h1>Your submission</h1>
                <fieldset>
                    <legend>
                        <label><input value="changes" v-model="displayMode" type="radio" />With changes</label>
                        <label><input value="submission" v-model="displayMode" type="radio" />Your submission</label>
                        <label><input value="proofed" v-model="displayMode" type="radio" />Proof-read version</label>
                    </legend>
                    <div v-if="displayMode === 'changes'">
                        <AppTextDifference v-for="original, index in paragraphs.original"  :original="original" :edited="paragraphs.proofed[index]" />
                    </div>
                    <div v-else-if="displayMode === 'submission'">
                        <p v-for="paragraph in paragraphs.original">{{ paragraph }}</p>
                    </div>
                    <div v-else>
                        <p v-for="paragraph in paragraphs.proofed">{{ paragraph }}</p>
                    </div>
                </fieldset>
                <h2>Comment from reviewer</h2>
                <p class="with-whitespace">
                    {{ submission.comment }}
                </p>
                <hr/>
                <p>
                    <a href="https://retha921.softr.app/your-articles">« Back to your list of articles</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>

.with-whitespace {
    white-space: pre;
}

.content {
    text-align: left
}

fieldset {
    border: 1px solid #ccc;
    padding: 1.0em;
    margin: 1em 0;
}

fieldset label {
    margin-right: 1em;
}

input[type='radio'] {
    margin-right: 0.5em;
}

</style>