export interface Game {
    id: number;
    title: string;
    requirements: Requirements;
    genre: number;
    price: number;
    fields: {
        id: number
        name: string
        type: "text" | "number"
        value: string;
    }[]
}

export interface Requirements {
    cpu: string;
    mem: string;
    disk: string;
}

export interface Genre {
    id: number;
    name: string;
    fields: { id: number, name: string, type: "text" | "number" }[]
}