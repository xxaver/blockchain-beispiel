import {FC, PropsWithChildren, useState} from "react";
import {KnownUser, UsersContext} from "./UsersContext.tsx";
import {useEvent} from "../Realtime/RealtimeContext.ts";
import {produce} from "immer";

export const Users: FC<PropsWithChildren> = ({children}) => {
    const [knownUsers, setKnownUsers] = useState<KnownUser[]>([]);

    useEvent("join", (data: KnownUser) => {
        setKnownUsers(users => produce(users, draft => {
            const user = draft.find(e => e.publicKey === data.publicKey)
            if (user) user.name = data.name;
            else draft.push(data);
        }))
    })

    return <UsersContext.Provider value={{knownUsers}}>
        {children}
    </UsersContext.Provider>
}