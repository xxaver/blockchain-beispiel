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

    const sendUsers = (users: OwnUser[], silent = false) => users.forEach(user => send("join", removePrivateKey(user)), silent);

    useEvent("join", (data: KnownUser) => {
        setKnownUsers(users => {
            if (users.some(user => user.publicKey === data.publicKey)) return users.map(user => user.publicKey === data.publicKey ? data : user);
            return [...users, data]
        })
    })
    useEvent("discover", () => sendUsers(ownUsers, true))
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
    
    return <UsersContext.Provider value={{
        knownUsers: [...ownUsers, ...knownUsers.filter(e => !ownUsers.some(o => o.publicKey === e.publicKey))],
        ownUsers,
        setOwnUsers
    }}>
        {ownUsers.map(user => <MiningHandler user={user} key={user.publicKey}/>)}
        {children}
    </UsersContext.Provider>
}

