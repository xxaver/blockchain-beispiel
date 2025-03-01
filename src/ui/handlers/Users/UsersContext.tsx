import {createContext} from "react";

export interface KnownUser {
    name: string;
    publicKey: string;
}

export const UsersContext = createContext<null | { knownUsers: KnownUser[] }>(null)