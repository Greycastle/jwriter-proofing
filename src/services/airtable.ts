import Airtable from "airtable";

export abstract class ArticleEntry {
    english: string;
    original: string;
    proofed: string;
    comment: string;

    constructor(english: string, original: string, proofed: string, comment: string) {
        this.english = english
        this.original = original
        this.proofed = proofed
        this.comment = comment
    }
}

export abstract class TrialEntry {
    english: string;
    translation: string;
    example: string;
    expected: string;

    constructor(english: string, translation: string, example: string, expected: string) {
        this.english = english
        this.translation = translation
        this.example = example
        this.expected = expected
    }
}

function getSubmissionsBase() {
    console.log(import.meta.env)
    const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_TOKEN }).base(import.meta.env.VITE_AIRTABLE_BASE_ID);
    return base(import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Submissions')
}

export async function getSubmission(articleId: string) : Promise<ArticleEntry> {
    return new Promise((resolve, reject) => {
        getSubmissionsBase().find(articleId, function(err: any, record: any) {
            if (err) {
                reject(err)
            } else {
                const original = record['fields']['Japanese']
                resolve({
                    english: record['fields']['English'],
                    original: original,
                    proofed: record['fields']['Japanese (Reviewed)'] || original,
                    comment: record['fields']['Comments to submitter']
                })
            }
        })
    })
}

export async function submitComment(articleId: string, comment: string) {
    await getSubmissionsBase().update(articleId, {
        'Comments to submitter': comment,
        'Status': 'Accepted'
    })
}

export async function saveSubmission(articleId: string, proofreadText: string) {
    await getSubmissionsBase().update(articleId, {
        'Japanese (Reviewed)': proofreadText
    })
}

export async function saveTrial(trial: TrialEntry) {
    const response = await getSubmissionsBase().create({
        'English': trial.english,
        'Japanese': trial.translation,
        'Japanese (Reviewed)': trial.expected,
    })

    return response.id
}