<script setup lang="ts">

import { ref } from 'vue'

import AppSpinner from '@/components/AppSpinner.vue'
import Text from '@/components/Text.vue';
import AppButton from '@/components/AppButton.vue';
import { AirtableService, getAirtableService, getSubmission, saveSubmission, ArticleEntry } from '@/services/airtable';

const english = ref(`Furikake every morning

I eat rice every day since I moved to Japan. Rice and miso soup. I think this is very normal.

However, if it is just rice, I feel a bit sad. Rice is tasty, but I want a bit more flavour.

For this reason, we eat furikake on top of the rice. Furikake is something you put on top of the rice. There are many different types of furikake, but my preference is Mishima furikake. This furikake is made from sesame seeds, dried eggs and fish.

I think rice and miso soup is a very healthy breakfast. Please give it a try.`)

const original = ref(`毎朝のふりかけ

私は日本に引っ越してから毎日お米を食べます。お米と味噌汁。これはとても普通と思います。

しかし、お米だけだと、ちょっと寂しいです。お米は美味しいですが、もうちょっと味が欲しいですね。

そのために、お米の上にふりかけをかけて食べます。ふりかけはご飯の上に乗せるものです。ふりかけは色々な種類がありますが、私のお好みはMishimaのふりかけです。このふりかけはごま、乾いた卵と魚で作られています。

お米と味噌汁はとても健康な朝ご飯だと思います。ぜひ試してみてください。`)

const proofed = ref(`毎朝のふりかけ

私は日本に引っ越してから毎日お米を食べます。お米と味噌汁。これはとても普通だと思います。

しかし、お米だけだと、ちょっと寂しいです。お米は美味しいですが、もうちょっと味が欲しいですね。

なので、お米の上にふりかけをかけて食べます。ふりかけはご飯の上に乗せるものです。ふりかけは色々な種類がありますが、私のお好みはMishimaのふりかけです。このふりかけは、ごま、乾燥させた卵と魚で作られています。

お米と味噌汁はとても健康的な朝ご飯だと思います。ぜひ試してみてください。`)

const selectedParagraph = ref(-1)

function updated(text: string) {
  proofed.value = text
}

function selectParagraph(index: number) {
  selectedParagraph.value = index
}

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

function send() {
  alert('Thank you! The author will now be notified that their article has been proof-read.')
}

</script>

<template>
  <AppSpinner v-if="loading">
    Just a sec, I'm loading your article now..
  </AppSpinner>
  <div v-else>
    <div class="page-container">
      <div class="parts">
        <Text :editable="true" title="Edit here" :text="proofed" v-on:updated="updated" v-on:selected="selectParagraph"></Text>
        <Text title="Submitted with changes" :text="proofed" :original="original" :selectedParagraph="selectedParagraph"></Text>
        <Text title="English text" :text="english" :selectedParagraph="selectedParagraph"></Text>
      </div>
    </div>
    <div class="footer" v-if="canSave">
      <div class="left-align" v-if="false">
        <AppButton type="destructive" @click="reset">Reset</AppButton>
      </div>
      <div class="right-align">
        <AppButton type="secondary" :disabled="saving" @click="save">{{ saving ? 'Saving..' : 'Save' }}</AppButton>
        <AppButton type="primary" v-if="false" @click="send">Send</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

.loader {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
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
