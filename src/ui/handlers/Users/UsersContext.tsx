import {createContext, Dispatch, SetStateAction} from "react";

export interface KnownUser {
    name: string;
    publicKey: string;
}
export interface OwnUser {
    name: string;
    publicKey: string;
    privateKey: string;
}

export const UsersContext = createContext<null | { 
    knownUsers: KnownUser[]; 
    ownUsers: OwnUser[];
    setOwnUsers: Dispatch<SetStateAction<OwnUser[]>>;
}>(null)