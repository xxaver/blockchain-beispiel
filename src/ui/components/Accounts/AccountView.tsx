import {FC, useContext, useEffect, useState} from "react";
import {OwnUser, removePrivateKey, UsersContext, useUser} from "../../handlers/Users/UsersContext.tsx";
import {AccountTitle} from "./AccountTitle.tsx";
import {LockKeyhole, LockKeyholeOpen, Pencil, Pickaxe, Trash2} from "lucide-react";
import {Accordeon} from "../Accordeon.tsx";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {produce, WritableDraft} from "immer";

export const AccountView: FC<{ publicKey: string }> = ({publicKey}) => {
    const {send} = useContext(RealtimeContext)!;
    const {setOwnUsers} = useContext(UsersContext)!;
    const user = useUser(publicKey)
    
    const update = (handler: (draft: WritableDraft<OwnUser>) => void) => {
        setOwnUsers(users => 
            users.map(u => {
                if(u.publicKey !== publicKey) return u;
                const result = produce(u, handler);
                send("join", removePrivateKey(result))
                return result;
            })
        )
    }

    const [computationalPower, setComputationalPower] = useState(`${user?.computationalPower || 0}`)
    useEffect(() => {
        setComputationalPower(`${user?.computationalPower || 0}`)
    }, [user]);

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
                        if(!confirm("Wirklich löschen?")) return;
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
        <div className="flex items-center gap-2 p-2">
            <Pickaxe/>
            Hashes/s
            <div className="grow"></div>
            {own ? <input type="text"
                          value={computationalPower}
                          onChange={e => {
                              setComputationalPower(e.target.value)
                          }}
                          onBlur={() => {
                              const int = parseFloat(computationalPower);
                              if (!isNaN(int)) update((u) => {
                                  u.computationalPower = int;
                              });
                          }}
            /> : user.computationalPower}
        </div>
    </>
}