export interface Game {
    id: number;
    title: string;
    requirements: Requirements;
    genre: number;
    price: number;
}

export interface Requirements {
    cpu: string;
    mem: string;
    disk: string;
}

export interface Genre {
    id: number;
    name: string;
}