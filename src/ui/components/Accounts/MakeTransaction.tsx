import {FC, useContext, useRef, useState} from "react";
import {OwnUser, UsersContext} from "../../handlers/Users/UsersContext.tsx";
import {HandCoins} from "lucide-react";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {sign} from "../../../blockchain/Signed.ts";
import {SuggestionInput} from "../SuggestionInput.tsx";
import {Transaction} from "../../../blockchain/Transaction.ts";

export const MakeTransaction: FC<{ user: OwnUser }> = ({user}) => {
    const {send} = useContext(RealtimeContext)!;
    const {knownUsers} = useContext(UsersContext)!;

    const to = useRef("")
    const [amount, setAmount] = useState("0");
    const [fee, setFee] = useState("0");
    const toOk = !!to;
    const amountOk = !isNaN(parseFloat(amount))
    const feeOk = !isNaN(parseFloat(fee))

    return <>
        <table>
            <tbody>
            <tr>
                <td>Empfänger:</td>
                <td className="py-2">
                    <SuggestionInput suggestions={knownUsers.map(user => ({element: user.name, searchable: [user.publicKey, user.name]}))}
                                     placeholder="Public Key" className={"w-full " + (toOk ? "" : " invalid")}
                                     type="text" ref={to}/>
                </td>
            </tr>
            <tr>
                <td>Betrag:</td>
                <td className="py-2">
                    <input className={"w-full " + (amountOk ? "" : " invalid")} type="number" value={amount}
                           onChange={e => setAmount(e.target.value)}/>
                </td>
            </tr>
            <tr>
                <td>Gebühr:</td>
                <td className="py-2">
                    <input className={"w-full " + (feeOk ? "" : " invalid")} type="number" value={fee}
                           onChange={e => setFee(e.target.value)}/>
                </td>
            </tr>
            </tbody>
        </table>
        <div className="flex">
            <div className="grow"></div>
            <button
                disabled={!feeOk || !amountOk || !toOk}
                className="primary flex items-center gap-2"
                onClick={async () => {
                    const amountFloat = parseFloat(amount);
                    const feeFloat = parseFloat(fee);
                    if (isNaN(amountFloat) || isNaN(feeFloat)) return;

                    send("transaction", await sign(JSON.stringify({
                        to: to.current,
                        from: user.publicKey,
                        amount: amountFloat,
                        fee: feeFloat,
                        id: Date.now()
                    } as Transaction), user.publicKey, user.privateKey))
                }}
            >
                <HandCoins/>
                Transaktion durchführen
            </button>
        </div>
    </>
}