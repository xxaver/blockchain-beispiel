import {createContext, Dispatch, SetStateAction, useContext} from "react";
import {Block} from "../../../blockchain/Block.ts";

export interface KnownUser {
    name: string;
    publicKey: string;
    computationalPower: number;
}
export interface OwnUser extends KnownUser {
    privateKey: string;
    workingOn?: Block
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
export const useUsername = (publicKey: string) => {
    const {knownUsers} = useContext(UsersContext)!;
    const user = knownUsers.find(e => e.publicKey === publicKey);
    return user?.name || publicKey.slice(15) + "...";
}

export const removePrivateKey = (user: OwnUser) => {
    const copy = {...user}
    delete (copy as Partial<OwnUser>).privateKey;
    delete (copy as Partial<OwnUser>).workingOn;
    return copy;
}