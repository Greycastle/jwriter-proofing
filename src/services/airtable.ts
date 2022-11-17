import Airtable from "airtable";

export abstract class AirtableService {
    apiKey: string
 
    constructor(apiKey: string) {
        this.apiKey = apiKey
    }
}

export function getAirtableService(apiKey: string) : AirtableService {
    return {
        apiKey
    }
}

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
    email: string;
    example: string;
    expected: string;

    constructor(english: string, translation: string, email: string, example: string, expected: string) {
        this.english = english
        this.translation = translation
        this.email = email
        this.example = example
        this.expected = expected
    }
}

function getSubmissionsBase(service: AirtableService) {
    const base = new Airtable({apiKey: service.apiKey}).base('appro7gNKkQZdEoXZ');
    return base('Submissions')
}

export async function getSubmission(service: AirtableService, articleId: string) : Promise<ArticleEntry> {
    return new Promise((resolve, reject) => {
        getSubmissionsBase(service).find(articleId, function(err: any, record: any) {
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

export async function submitComment(service: AirtableService, articleId: string, comment: string) {
    await getSubmissionsBase(service).update(articleId, {
        'Comments to submitter': comment,
        'Status': 'Accepted'
    })
}

export async function saveSubmission(service: AirtableService, articleId: string, proofreadText: string) {
    await getSubmissionsBase(service).update(articleId, {
        'Japanese (Reviewed)': proofreadText
    })
}

export async function saveTrial(service: AirtableService, trial: TrialEntry) {
    await getSubmissionsBase(service).create({
        'Name': trial.email,
        'Title': 'Trial - ' + trial.example,
        'English': trial.english,
        'Japanese': trial.translation,
        'Japanese (Reviewed)': trial.expected,
        'Title (Reviewed)': 'Trial',
        'Status': 'Accepted',
        'Time taken': '0 min',
        'Comments to submitter': 'Thank you for your trial. This is an automated response.',
        'PaymentId': 'free'
    })
}