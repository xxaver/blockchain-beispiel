import {FC, useContext} from "react";
import {OwnUser, removePrivateKey, UsersContext, useUser} from "../../handlers/Users/UsersContext.tsx";
import {AccountTitle} from "./AccountTitle.tsx";
import {ArrowLeftRight, HandCoins, LockKeyhole, LockKeyholeOpen, Pencil, Pickaxe, Trash2} from "lucide-react";
import {Accordeon} from "../Accordeon.tsx";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {produce, WritableDraft} from "immer";
import {MakeTransaction} from "./MakeTransaction.tsx";
import {MiningView} from "./MiningView.tsx";
import {AccountTransactions} from "./AccountTransactions.tsx";

export const AccountView: FC<{ publicKey: string }> = ({publicKey}) => {
    const {send} = useContext(RealtimeContext)!;
    const {setOwnUsers} = useContext(UsersContext)!;
    const user = useUser(publicKey)

    const update = (handler: (draft: WritableDraft<OwnUser>) => void) => {
        setOwnUsers(users =>
            users.map(u => {
                if (u.publicKey !== publicKey) return u;
                const result = produce(u, handler);
                send("join", removePrivateKey(result))
                return result;
            })
        )
    }

    if (!user) return null;
    const own = "privateKey" in user

    return <>
        <div className="p-2 flex items-center gap-2">
            <AccountTitle publicKey={publicKey}/>
            {own && <>
                <button
                    onClick={() => {
                        const newName = prompt("Neuer name?");
                        if (!newName) return;
                        update((u) => {
                            u.name = newName
                        });
                    }}>
                    <Pencil/>
                </button>
                <button
                    className="text-red-600"
                    onClick={() => {
                        if (!confirm("Wirklich löschen?")) return;
                        setOwnUsers(users => users.filter(user => user.publicKey !== publicKey));
                        send("join", {...removePrivateKey(user), computationalPower: 0})
                    }}>
                    <Trash2/>
                </button>
            </>}
        </div>
        <Accordeon title={<><LockKeyholeOpen/> Public Key</>}>
            <textarea rows={10} readOnly value={user.publicKey}/>
        </Accordeon>
        {own && <Accordeon title={<><LockKeyhole/> Private Key</>}>
            <textarea rows={10} readOnly value={user.privateKey}/>
        </Accordeon>}
        {own && <Accordeon open title={<><HandCoins/> Überweisen</>}>
            <MakeTransaction user={user}/>
        </Accordeon>}
        <Accordeon noPadding open title={<><Pickaxe/> Mining</>}>
            <MiningView publicKey={publicKey}/>
        </Accordeon>
        <Accordeon noPadding title={<><ArrowLeftRight/> Transaktionen</>}>
            <AccountTransactions publicKey={publicKey}/>
        </Accordeon>
    </>
}

export const GlAccountView: FC<{ state: string }> = ({state}) => {
    return <AccountView publicKey={state}/>
}