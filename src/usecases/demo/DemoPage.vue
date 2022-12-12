<script setup lang="ts">

import AppButton from '@/components/AppButton.vue';
import { saveTrial } from '@/services/airtable';
import { getParagraphs } from '@/services/paragraphs';
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const SELECTED_DEMO_KEY = 'demo-selected-example';
const WRITING_KEY = 'demo-writing';
const EMAIL_KEY = 'demo-email';

const router = useRouter();

const selectedExample = ref<string | null>(null);

const examples = new Map<string, string>([
    ['Where I live and what I like', `I am twenty-four years old, and I live in Japan.

I like to read Manga and watch Anime. I also like Japanese food.

I am studying Japanese so that I can make friends in Japan.

Thank you for reading.`],
    ['Last night at the restaurant', `Yesterday I met my friends, and we went to a restaurant.

The restaurant was near Shinjuku station, and it was very busy.

We had to queue for one hour before we could get in.

But the food was very good. We ate sashimi and drank beer until late in the night.`],
    ['I want to go to Japan', `I have always wanted to go to Japan. But it is very expensive.

I am now working at a supermarket every evening after school and every weekend so that I may save money.

Next year I hope that I will have enough to visit Japan.`]
])

const correct = new Map<string, string>([
    [ 'Where I live and what I like', `私は24才で、日本に住んでいます。

まんがを読むことと、アニメを見ることが好きです。日本食も好きです。

日本で友達を作るために、日本語を勉強しています。

お読みいただきありがとうございます。` ],
    [ 'Last night at the restaurant', `昨日友達に会って、レストランに行きました。

レストランは新宿駅の近くで、とても混んでました。

中に入るのに1時間も待ちました。

でも、とてもおいしかったです。夜遅くまでお刺身を食べて、ビールを飲みました。`],
    [ 'I want to go to Japan', `私は24才で、日本に住んでいます。

まんがを読むことと、アニメを見ることが好きです。日本食も好きです。

日本で友達を作るために、日本語を勉強しています。

お読みいただきありがとうございます。`]
])

const paragraphs = ref<string[]>([])
const translation = ref<string[]>([]);
const email = ref<string>('')

const getTranslationKey = (example: string) => WRITING_KEY + '-' + example.replace(/ /g, '-');
const getStoredTranslation = (example: string): string[] | null => {
    const storedTranslation = localStorage.getItem(getTranslationKey(example));
    return storedTranslation ? JSON.parse(storedTranslation) as string[] : null;
}

const update = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement;
    translation.value[index] = target.innerText;
    if (selectedExample.value) {
        localStorage.setItem(getTranslationKey(selectedExample.value), JSON.stringify(translation.value));
    }
}

watch(() => selectedExample.value, (newValue) => {
    if (newValue) {
        localStorage.setItem(SELECTED_DEMO_KEY, newValue)
        paragraphs.value = getParagraphs(examples.get(newValue) || '')
        translation.value = getStoredTranslation(newValue) || paragraphs.value.map(() => 'translate..')
    } else {
        localStorage.removeItem(SELECTED_DEMO_KEY)
        paragraphs.value = []
        translation.value = []
    }
})

onMounted(() => {
    selectedExample.value = localStorage.getItem(SELECTED_DEMO_KEY) || null
    email.value = localStorage.getItem(EMAIL_KEY) || ''
})

const working = ref(false)
const error = ref<string | null>()

const submit = async () => {
    try {
        working.value = true;
        localStorage.setItem(EMAIL_KEY, email.value)
        const submissionId = await saveTrial({
            english: examples.get(selectedExample.value!) || '',
            translation: translation.value.join('\n\n'),
            example: selectedExample.value!,
            expected: correct.get(selectedExample.value!) || '',
            }
        )

        router.replace(`/review/${submissionId}`)
    } catch (err) {
        error.value = 'Something went wrong, please try again'
        working.value = false;
        console.error(err)
    }
}

</script>

<template>
    <div class="page-container">
        <h1>
            Test your skills
        </h1>
        <p>
            Before signing up, you can test out our service to get a feel for how it works. This is completely free and after you have submitted a translation, you will be sent a link to where you can review the results.
        </p>

        <div v-if="selectedExample">
            <p>You have chosen to translate our example text <b>{{ selectedExample }}</b> you can <a href="#" @click="selectedExample = null">select another</a> if you want to</p>

            <div class="parts">
                <table>
                    <thead>
                        <th>
                            <h2>English</h2>
                            <small>Example to translate</small>
                        </th>
                        <th>
                            <h2>Translation</h2>
                            <small>Add your translation here</small>
                        </th>
                    </thead>
                    <tbody>
                        <tr v-for="paragraph, index in paragraphs">
                            <td>
                                <p>{{ paragraph }}</p>
                            </td>
                            <td>
                                <p contenteditable="true" v-on:blur="update($event, index)">{{ translation[index] }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <AppButton :disabled="true" v-if="working">Submitting..</AppButton>
                <AppButton v-else-if="!error" @click="submit">Submit</AppButton>
                <p class="error" v-else>{{ error }}</p>
            </div>
        </div>
        <div v-else>
            <p>
                Select an example:
            </p>
            <AppButton v-for="key in examples.keys()" :key="key" @click="selectedExample = key">{{ key }}</AppButton>
        </div>
    </div>
</template>

<style>

.error {
    color: red;
}

button {
    margin-top: 1rem;
}

button:not(:last-child) {
    margin-right: 1rem;
}

input[type="email"] {
    max-width: 90%;
    margin-right: 1rem;
    padding: 10px 10px;
    border-radius: 5px;
    border: 1px solid var(--primary-weak-color);
    font-size: 16px;
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
  width: 100%;
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

</style>