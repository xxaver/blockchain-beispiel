import {FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {KnownUser, OwnUser, removePrivateKey, UsersContext} from "./UsersContext.tsx";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {useParams} from "react-router";
import {MiningHandler} from "./MiningHandler.tsx";

export const Users: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!
    const [knownUsers, setKnownUsers] = useState<KnownUser[]>([]);
    const [ownUsers, setOwnUsers] = useState<OwnUser[]>([]);
    const {url} = useParams()!
    
    const sendUsers = (users: OwnUser[]) => users.forEach(user => send("join", removePrivateKey(user)));

    useEvent("join", (data: KnownUser) => {
        setKnownUsers(users => {
            if (users.some(user => user.publicKey === data.publicKey)) return users.map(user => user.publicKey === data.publicKey ? data : user);
            return [...users, data]
        })
    })
    useEvent("discover", () => sendUsers(ownUsers))
    useEffect(() => {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem(`users:${url}`) as string);
            sendUsers(users);
        } catch { /* empty */
        }
        setOwnUsers(users as OwnUser[]);
    }, [url]);
    useEffect(() => {
        localStorage.setItem(`users:${url}`, JSON.stringify(ownUsers))
    }, [ownUsers]);

    return <UsersContext.Provider value={{knownUsers: [...ownUsers, ...knownUsers], ownUsers, setOwnUsers}}>
        <MiningHandler />
        {children}
    </UsersContext.Provider>
}

