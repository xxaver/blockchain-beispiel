import {Cpu, RefreshCw} from "lucide-react";
import {FC, useContext, useEffect, useReducer, useState} from "react";
import {OwnUser, removePrivateKey, UsersContext, useUser} from "../../handlers/Users/UsersContext.tsx";
import {produce, WritableDraft} from "immer";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";

export const MiningView: FC<{publicKey: string}> = ({publicKey}) => {
    const {send} = useContext(RealtimeContext)!;
    const {setOwnUsers} = useContext(UsersContext)!;
    const user = useUser(publicKey)
    const [, forceUpdate] = useReducer(x => x + 1, 0);

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
    }, [user?.computationalPower]);
    
    if (!user) return null;
    const own = "privateKey" in user
    
    return <>
        <div className="flex items-center gap-2">
            <Cpu/>
            <span className="text-nowrap">Hashes/s</span>
            <div className="grow"></div>
            {own ? <input type="text"
                          value={computationalPower}
                          onChange={e => {
                              setComputationalPower(e.target.value)
                          }}
                          onBlur={() => {
                              const int = parseFloat(computationalPower) || 0;
                              update((u) => {
                                  u.computationalPower = int;
                              });
                          }}
            /> : user.computationalPower}
        </div>
        {own && <div>
            <div className="flex items-center gap-2 p-2">
                Aktuelle Versuche: 
                <div>{user.workingOn?.mined?.proofOfWork || "N/A"}</div>
            </div>
        </div>}
    </>
}