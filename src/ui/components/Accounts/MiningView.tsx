import {Cpu} from "lucide-react";
import {FC, useContext, useEffect, useState} from "react";
import {OwnUser, removePrivateKey, UsersContext, useUser} from "../../handlers/Users/UsersContext.tsx";
import {produce, WritableDraft} from "immer";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {parseJSON} from "../../util.ts";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {Signed} from "../../../blockchain/Signed.ts";

export const MiningView: FC<{ publicKey: string }> = ({publicKey}) => {
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

    const [computationalPower, setComputationalPower] = useState(`${user?.computationalPower || 0}`)
    useEffect(() => {
        setComputationalPower(`${user?.computationalPower || 0}`)
    }, [user?.computationalPower]);

    if (!user) return null;
    const own = "privateKey" in user
    const transactions = own ? parseJSON(user.workingOn?.data || "[]") : [];

    return <>
        <div className="p-2">
            <table>
                <tbody>
                <tr>
                    <td className="p-1">
                        <div className="flex items-center gap-1 h-full">
                            <Cpu/>
                            <span className="text-nowrap">Hashes/s</span>
                        </div>
                    </td>
                    <td className="p-1">
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
                    </td>
                </tr>
                {own && <tr>
                    <td className="p-1">Aktuelle Versuche:</td>
                    <td className="p-1">{user.workingOn?.mined?.proofOfWork || "N/A"}</td>
                </tr>
                }
                </tbody>
            </table>
        </div>
        {own && <div>
            <div className="mt-1 p-3">Enthaltene Transaktionen</div>
            {transactions
                .map((e: Signed, i: number) => <div
                    className="bg-yellow-600/20 flex items-center gap-2 p-2 text-yellow-600">
                    <TransactionTitle key={i} withFee transaction={parseJSON(e.data)}/>
                </div>)}
            {!transactions.length && <div className="text-center py-5 text-gray-400">
                Keine Transaktionen
            </div>}
        </div>}
    </>
}