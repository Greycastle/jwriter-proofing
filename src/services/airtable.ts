import Airtable from "airtable";

abstract class AirtableService {
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

    constructor(english: string, original: string, proofed: string) {
        this.english = english
        this.original = original
        this.proofed = proofed
    }
}

export async function getSubmission(service: AirtableService, articleId: string) : Promise<ArticleEntry> {
    const base = new Airtable({apiKey: service.apiKey}).base('appro7gNKkQZdEoXZ');
    return new Promise((resolve, reject) => {
        base('Submissions').find(articleId, function(err: any, record: any) {
            if (err) {
                reject(err)
            } else {
                const original = record['fields']['Japanese']
                resolve({
                    english: record['fields']['English'],
                    original: original,
                    proofed: record['fields']['Japanese (Reviewed)'] || original
                })
            }
        })
    })
}