import {FC, PropsWithChildren, useContext, useState} from "react";
import {KnownUser, OwnUser, UsersContext} from "./UsersContext.tsx";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {produce} from "immer";

export const Users: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!
    const [knownUsers, setKnownUsers] = useState<KnownUser[]>([]);
    const [ownUsers, setOwnUsers] = useState<OwnUser[]>([]);

    useEvent("join", (data: KnownUser) => {
        setKnownUsers(users => produce(users, draft => {
            const user = draft.find(e => e.publicKey === data.publicKey)
            if (user) user.name = data.name;
            else draft.push(data);
        }))
    })
    useEvent("discover", () => {
        ownUsers.forEach(user => send("join", {
            publicKey: user.publicKey,
            name: user.name
        }))
    })

    return <UsersContext.Provider value={{knownUsers, ownUsers, setOwnUsers}}>
        {children}
    </UsersContext.Provider>
}