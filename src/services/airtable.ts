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

export async function saveSubmission(service: AirtableService, articleId: string, proofreadText: string) {
    await getSubmissionsBase(service).update(articleId, {
        'Japanese (Reviewed)': proofreadText
    })
}