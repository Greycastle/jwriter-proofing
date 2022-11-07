<script setup lang="ts">

import { ref, computed } from 'vue'

import AppSpinner from '@/components/AppSpinner.vue'
import AppTextDifference from '@/components/AppTextDifference.vue';
import AppButton from '@/components/AppButton.vue';
import AppModal from '@/components/AppModal.vue';
import { AirtableService, getAirtableService, getSubmission, saveSubmission, submitComment, ArticleEntry } from '@/services/airtable';
import { getParagraphs } from '@/services/paragraphs';
import { example } from '@/services/example';

const english = ref(example.english)
const original = ref(example.original)
const proofed = ref(example.proofed)
const comment = ref('')

const loading = ref(false)

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('articleId')
const apiKey = urlParams.get('apiKey')

let airtable: AirtableService | null = null
const canSave = ref(false)
if (apiKey) {
  airtable = getAirtableService(apiKey)
  canSave.value = true
}

if (articleId && apiKey) {
  loading.value = true
  getSubmission(getAirtableService(apiKey), articleId).then((article: ArticleEntry) => {
    english.value = article.english
    original.value = article.original
    proofed.value = article.proofed
    comment.value = article.comment
  }).catch((error: any) => {
    console.error(error)
  }).finally(() => {
    loading.value = false
  })
}

function reset() {
  alert('Resetting the proof-read to the original text, this has not been saved yet.')
  proofed.value = original.value
}

const saving = ref(false)
async function save() {
  if (airtable && articleId) {
    saving.value = true
    await saveSubmission(airtable, articleId, proofed.value)
    alert('Changes have been saved.')
    saving.value = false
  } else {
    console.error('No valid article or API key are set.')
  }
}

const showModal = ref(false)
function openSendModal() {
  showModal.value = true

}

async function sendComment() {
  if (!airtable || !articleId) {
    return
  }
  await submitComment(airtable, articleId, comment.value)
  alert('Thank you! The author will now be notified that their article has been proof-read.')
  hideModal()
}

function hideModal() {
  showModal.value = false
}

const paragraphs = computed<{ proofed: string[], original: string[], english: string[] }>(() => {
  return {
    english: getParagraphs(english.value),
    original: getParagraphs(original.value),
    proofed: getParagraphs(proofed.value)
  }
})

function bindValue(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  const updated = [ ...paragraphs.value.proofed ]
  updated[index] = target.innerText
  proofed.value = updated.join('\n\n')
}

const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(proofed.value)
  copied.value = true 
  setTimeout(() => {
    copied.value = false
  }, 500)
}

</script>

<template>
  <AppSpinner v-if="loading">
    Just a sec, I'm loading your article now..
  </AppSpinner>
  <div v-else>
    <div class="page-container">
      <div class="parts">
         <table>
          <thead>
            <tr>
              <th>
                  <h2>Proofread</h2>
                  <span>Edit this content! You will see the changes to the right once you tap outside the text.</span>
                  &nbsp;<a href="action:copy" :class="{'disabled': copied}" @click="copy">[ {{ copied ? 'copied..' : 'copy text' }} ]</a>
              </th>
              <th>
                  <h2>Changes</h2>
                  <span>See what has been changed here, strikethrough is removed and green is added.</span>
              </th>
              <th>
                  <h2>English</h2>
                  <span>Use the English translation to check what the writer actually wanted to write if the Japanese is hard to read.</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proofread, index of paragraphs.proofed">
              <td><p contenteditable="true" v-on:blur="bindValue($event, index)">{{ proofread }}</p></td>
              <td><p><AppTextDifference :original="paragraphs.original[index]" :edited="proofread"/></p></td>
              <td><p>{{ paragraphs.english[index] }}</p></td>
            </tr>
          </tbody>
         </table>
      </div>
    </div>
    <div class="footer" v-if="canSave">
      <div class="left-align" v-if="false">
        <AppButton type="destructive" @click="reset">Reset</AppButton>
      </div>
      <div class="right-align">
        <AppButton type="secondary" :disabled="saving" @click="save">{{ saving ? 'Saving..' : 'Save' }}</AppButton>
        <AppButton type="primary" @click="openSendModal">Send</AppButton>
      </div>
    </div>
  </div>
  <AppModal closeLabel="Send" v-if="showModal" @close="sendComment" @cancel="hideModal">
    <h3>Send with comment to author</h3>
    <span class="comment-help">Add a comment to explain any changes you have done or so.</span>
    <textarea v-model="comment"></textarea>
  </AppModal>
</template>

<style scoped>

textarea {
  border-radius: 8px;
  width: 100%;
  height: 200px;
  padding: 8px;
}

td p:focus {
  outline: none;
}

th span, th a {
  font-size: 0.8em;
  color: #666;
}

tbody td p {
  white-space: pre-wrap;
}

tbody tr:focus-within, tbody tr:hover {
  background-color: #f5f5f5;
}

table {
  border-spacing: 0em;  
}

thead tr th {
  border-bottom: 1px solid #ddd;
}

th, td {
  text-align: left;
  vertical-align: top;
}

th:not(:last-child), td:not(:last-child) {
  padding-right: 1em;
}

.loader {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  padding: 12px 32px;
  justify-content: space-between;
  align-items: stretch;
  background: white;
  border-top: 1px solid rgb(223, 223, 223);
}

.footer .left-align {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}

.footer .right-align {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.parts {
  display: flex;
  flex-direction: row;
  gap: 32px;
}

</style>
