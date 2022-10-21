<script setup lang="ts">

import { ref } from 'vue'
import Airtable from 'airtable'

import Text from './components/Text.vue';

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
if (articleId && apiKey) {
  
  loading.value = true
  const base = new Airtable({apiKey: apiKey}).base('appro7gNKkQZdEoXZ');
  base('Submissions').find(articleId, function(err: any, record: any) {
    if(err) {
      console.error(err)
      return
    }
    english.value = record['fields']['English']
    original.value = record['fields']['Japanese']
    proofed.value = record['fields']['Japanese (Reviewed)'] || original.value
    loading.value = false
  })
}

</script>

<template>
  <div v-if="loading">
    Just a sec, I'm loading your article now..
  </div>
  <div v-else class="parts">
    <Text :text="english" :selectedParagraph="selectedParagraph"></Text>
    <Text :text="proofed" :original="original" :selectedParagraph="selectedParagraph"></Text>
    <Text :text="proofed" v-on:updated="updated" v-on:selected="selectParagraph"></Text>
  </div>
</template>

<style scoped>
.parts {
  display: flex;
  flex-direction: row;
  gap: 32px;
}

</style>
