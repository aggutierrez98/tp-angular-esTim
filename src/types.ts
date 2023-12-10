export interface Game {
    id: number;
    title: string;
    description: string;
    requirements: Requirements;
    genre: number;
    price: number;
    imageUrl?: string | null,
    fields: {
        id: number
        name: string
        type: "text" | "number"
        value: string;
    }[]
    isDlc: boolean
    originalGame?: string | null

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

export enum Role {
    User = 'User',
    Admin = 'Admin',
}

export interface User {
    id: number,
    name: string,
    email: string
    password: string
    role: Role,
    games?: number[],
    borrowedGames?: { gameId: number, userId: number }[]
}

export type LogInRequest = Omit<User, 'id' | 'role' | 'name'>
export type RegisterRequest = Omit<User, 'id' | 'role'>

export type SafeUser = Omit<
    User,
    'password'
>

export function exclude<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends Record<string, any>,
    K extends keyof T
>(
    obj: T,
    keys: K[],
): Omit<T, K> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key as K))
    ) as Omit<T, K>;
}