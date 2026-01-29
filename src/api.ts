import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type SetID = string;
export type UserID = string; // uuid


export interface Card {
    term: string;
    definition: string;

    //TODO: images
    //TODO: extra information for question type
    //          e.g. content
}

export interface Set {
    id: SetID;

    user: UserID;

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

export class SupabaseBackend implements Backend {
    client: SupabaseClient;

    constructor() {
        this.client = createClient(
            import.meta.env.VITE_BACKEND_URL, 
            import.meta.env.VITE_BACKEND_KEY
        );
    }

    async createSet(title: string): Promise<SetID> {
        const { data, error } = await this.client.from("sets").insert({
            title: title,
            user: (await this.client.auth.getUser()).data.user?.id
        }).select();

        if (!data) throw new Error("data from set creation request is null! " + error.details);

        return data[0].id as SetID;
    }

    async readSet(setId: SetID): Promise<Set | undefined> {
        const { data, error } = await this.client.from("sets").select().eq("id", setId);

        if (!data) throw Error("Data from set read request is null! " + error.details);

        if (data.length == 0) throw Error(`Set with id ${setId} does not exist!`);

        return data[0] as Set;
    }

    async updateSet(set: Set): Promise<void> {
        await this.client.from("sets").update(set).eq("id", set.id);
    }

    async listSets(): Promise<[string, string, SetID][]> {
        const { data, error } = await this.client.from("sets").select("user,id,title,description").filter("user", "eq", (await this.client.auth.getUser()).data.user?.id);

        if (!data) throw Error("Got no data when requesting set list! " + error.details);

        return data.map(({ id, title, description }) => [title, description, id]);
    }
}