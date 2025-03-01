import {FC, useContext} from "react";
import {Plus, UserSearch} from "lucide-react";
import {UsersContext} from "../../handlers/Users/UsersContext.tsx";
import {produce} from "immer";
import {generateKeyPair} from "../../../blockchain/crypto.ts";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {CurrentCoins} from "./CurrentCoins.tsx";

export const AccountList: FC = () => {
    const {send} = useContext(RealtimeContext)!;
    const {knownUsers, ownUsers, setOwnUsers} = useContext(UsersContext)!;
    const otherUsers = knownUsers.filter(user => !ownUsers.some(own => own.publicKey === user.publicKey));

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <UserSearch/>
            <h1>Konten</h1>
            <div className="grow"></div>
            <button onClick={async () => {
                const name = prompt("Name (nur zur Übersichtlichkeit)");
                if (!name) return;
                const {publicKey, privateKey} = await generateKeyPair();

                send("join", {name, publicKey});
                setOwnUsers(users => produce(users, draft => {
                    draft.push({name, publicKey, privateKey})
                }))
            }}>
                <Plus/>
            </button>
        </div>
        <div
            className="grow relative min-h-0">
            <h2 className="p-2">Deine Konten</h2>
            {!ownUsers.length && <div className="p-2 text-center py-10 text-gray-400">Noch kein Konto angelegt!</div>}
            {ownUsers.map(user => <div className="p-2 item bg-white flex items-center gap-2" key={user.publicKey}>
                <div className="cursor-pointer">
                    <div>{user.name}</div>
                </div>
                <div className="grow"></div>
                <CurrentCoins publicKey={user.publicKey} />
            </div>)}
            <h2 className="p-2">Andere Konten</h2>
            {!otherUsers.length && <div className="p-2 text-center py-10 text-gray-400">Keine anderen Benutzer</div>}
            {otherUsers.map(user => <div className="p-2 item bg-white flex items-center gap-2" key={user.publicKey}>
                <div>
                    <div>{user.name}</div>
                </div>
                <div className="grow"></div>
                <CurrentCoins publicKey={user.publicKey} />
            </div>)}
        </div>
    </>
}