import {createContext, Dispatch, SetStateAction, useContext} from "react";

export interface KnownUser {
    name: string;
    publicKey: string;
    computationalPower: number;
}
export interface OwnUser extends KnownUser {
    privateKey: string;
}

export const UsersContext = createContext<null | { 
    knownUsers: (KnownUser | OwnUser)[]; 
    ownUsers: OwnUser[];
    setOwnUsers: Dispatch<SetStateAction<OwnUser[]>>;
}>(null)
export const useUser = (publicKey: string) => {
    const {knownUsers} = useContext(UsersContext)!;
    return knownUsers.find(e => e.publicKey === publicKey);
}

export const removePrivateKey = (user: OwnUser) => {
    const copy = {...user}
    delete (copy as Partial<OwnUser>).privateKey;
    return copy;
}