import {FC, useContext, useState} from "react";
import {Plus, UserPen, UserSearch} from "lucide-react";
import {KnownUser, removePrivateKey, UsersContext} from "../../handlers/Users/UsersContext.tsx";
import {produce} from "immer";
import {generateKeyPair} from "../../../blockchain/crypto.ts";
import {AccountTitle} from "./AccountTitle.tsx";
import {AccountView} from "./AccountView.tsx";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {LayoutContext, openItem} from "../../layout/LayoutContext.tsx";
import {DragOpener} from "../../layout/DragOpener.tsx";

export const AccountList: FC = () => {
    const {send} = useContext(RealtimeContext)!;
    const {knownUsers, ownUsers, setOwnUsers} = useContext(UsersContext)!;
    const otherUsers = knownUsers.filter(user => !ownUsers.some(own => own.publicKey === user.publicKey));
    const [selected, setSelected] = useState<null | string>(null)
    const layout = useContext(LayoutContext);

    const openUser = (user: KnownUser) => {
        if (layout && layout.gl) {
            openItem(layout.gl, "Konten", "Konto", user.publicKey, user.name)
        } else setSelected(selected === user.publicKey ? null : user.publicKey)
    }

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <UserSearch/>
            <h1>Konten</h1>
            <div className="grow"></div>
            <button onClick={async () => {
                const name = prompt("Name (nur zur Übersichtlichkeit)");
                if (!name) return;
                const {publicKey, privateKey} = await generateKeyPair();
                const user = {name, computationalPower: 0, publicKey, privateKey}

                send("join", removePrivateKey(user));
                setOwnUsers(users => produce(users, draft => {
                    draft.push(user);
                }))
            }}>
                <Plus/>
            </button>
        </div>
        <div
            className="flex-1 relative min-h-0 overflow-auto">
            <h2 className="p-2 flex items-center gap-2"><UserPen/> Deine Konten</h2>
            {!ownUsers.length && <div className="p-2 text-center py-10 text-gray-400">Noch kein Konto angelegt!</div>}
            {ownUsers.map(user => <DragOpener key={user.publicKey} config={{
                type: "component",
                componentType: "Konto",
                componentState: user.publicKey,
                title: user.name
            }}>
                <div
                    onClick={() => openUser(user)}
                    className="select-none cursor-pointer p-2 item bg-white flex items-center gap-2"
                    key={user.publicKey}>
                    <AccountTitle publicKey={user.publicKey}/>
                </div>
            </DragOpener>)}
            <h2 className="mt-10 p-2 flex items-center gap-2 border-t border-gray-200"><UserSearch/> Andere aktive
                Benutzer</h2>
            {!otherUsers.length && <div className="p-2 text-center py-10 text-gray-400">Keine anderen Benutzer</div>}
            {otherUsers.map(user => <DragOpener key={user.publicKey} config={{
                type: "component",
                componentType: "Konto",
                componentState: user.publicKey,
                title: user.name
            }}>
                <div
                    className="cursor-pointer p-2 item bg-white flex items-center gap-2"
                    onClick={() => openUser(user)}
                    key={user.publicKey}>
                    <AccountTitle publicKey={user.publicKey}/>
                </div>
            </DragOpener>)}
        </div>
        {selected && <div className="flex-1 border-t border-gray-200 flex flex-col bg-white min-h-0 overflow-auto">
            <AccountView publicKey={selected}/>
        </div>}
    </>
}