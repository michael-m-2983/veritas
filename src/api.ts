import { createClient } from '@supabase/supabase-js'

export type SetID = string;


export interface Card {
    term: string;
    definition: string;

    //TODO: images
    //TODO: extra information for question type
    //          e.g. content
}

export interface Set {
    id: SetID;

    title: string;
    description: string;

    cards: Card[];

    created_at: number;
    updated_at: number;
}

export interface Backend {
    createSet(title: string): Promise<SetID>;
    readSet(setId: SetID): Promise<Set | undefined>;
    updateSet(set: Set): Promise<void>;
    listSets(): Promise<[string, string, SetID][]> // title, description, id
}

/**
 * This backend is intended to be used for testing.
 */
export class FakeBackend implements Backend {

    sets: Map<SetID, Set>;

    constructor() {
        this.sets = new Map<SetID, Set>();


        let set1: Set = {
            id: "set1",
            title: "US Government Legislation Test Review",
            description: "This set contains review flashcards for my upcoming test in US Government. It covers some of the officers of the senate and some other things too.",
            cards: [
                {
                    term: "Number of years in a session",
                    definition: "2"
                },
                {
                    term: "President Pro Tem",
                    definition: "Chuck Grassley"
                }
            ],
            created_at: Date.now(),
            updated_at: Date.now()
        };
        this.sets.set(set1.id, set1);
    }

    generateRandomSetID() {
        return (Math.floor(Math.random() * 100000)).toString();
    }

    async createSet(title: string) {
        let setId = this.generateRandomSetID();

        this.sets.set(setId, {
            id: setId,
            title: title,
            cards: [],
            created_at: Date.now(),
            updated_at: Date.now(),
            description: ""
        });

        return setId;
    }
    async readSet(setId: SetID) {
        return this.sets.get(setId);
    }

    async updateSet(set: Set) {
        if (!this.sets.has(set.id)) {
            throw Error("Set does not exist!");
        }
        this.sets.set(set.id, set);
    }

    async listSets(): Promise<[string, string, SetID][]> {
        let result: [string, string, SetID][] = [];


        for(let set of this.sets.values()) {
            result.push([set.title, set.description, set.id]);
        }

        return result;
    }

}

export class SupabaseBackend implements Backend {
    url: string;
    apiKey: string;

    constructor() {
        this.url = import.meta.env.VITE_BACKEND_URL;
        this.apiKey = import.meta.env.VITE_BACKEND_KEY;
    }

    connect() {
        return createClient(this.url, this.apiKey);
    }

    async createSet(title: string): Promise<SetID> {
        let client = this.connect();

        const { data, error } = await client.from("sets").insert({
            title: title,
        }).select();

        if (!data) throw new Error("data from set creation request is null! " + error.details);

        return data[0].id as SetID;
    }

    async readSet(setId: SetID): Promise<Set | undefined> {
        let client = this.connect();

        const { data, error } = await client.from("sets").select().eq("id", setId);

        if (!data) throw Error("Data from set read request is null! " + error.details);

        if(data.length == 0) throw Error(`Set with id ${setId} does not exist!`);

        return data[0] as Set;
    }

    async updateSet(set: Set): Promise<void> {
        let client = this.connect();

        await client.from("sets").update(set).eq("id", set.id);
    }

    async listSets(): Promise<[string, string, SetID][]> {
        let client = this.connect();

        const {data, error} = await client.from("sets").select("id,title,description");

        if(!data) throw Error("Got no data when requesting set list! " + error.details);

        return data.map(({id, title, description}) => [title, description, id]);
    }
}