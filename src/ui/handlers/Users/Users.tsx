import {FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {KnownUser, OwnUser, UsersContext} from "./UsersContext.tsx";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {produce} from "immer";
import {useParams} from "react-router";

export const Users: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!
    const [knownUsers, setKnownUsers] = useState<KnownUser[]>([]);
    const [ownUsers, setOwnUsers] = useState<OwnUser[]>([]);
    const {url} = useParams()!

    useEvent("join", (data: KnownUser) => {
        setKnownUsers(users => produce(users, draft => {
            const user = draft.find(e => e.publicKey === data.publicKey)
            if (user) user.name = data.name;
            else draft.push(data);
        }))
    })
    useEvent("discover", () => {
        ownUsers.forEach(user => send("join", {
            name: user.name,
            publicKey: user.publicKey
        }))
    })
    useEffect(() => {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem(`users:${url}`) as string)
        } catch { /* empty */ }
        setOwnUsers(users as OwnUser[]);
    }, [url]);
    useEffect(() => {
        localStorage.setItem(`users:${url}`, JSON.stringify(ownUsers))
    }, [ownUsers]);

    return <UsersContext.Provider value={{knownUsers, ownUsers, setOwnUsers}}>
        {children}
    </UsersContext.Provider>
}