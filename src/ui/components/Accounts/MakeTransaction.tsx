import {FC, useContext, useState} from "react";
import {OwnUser} from "../../handlers/Users/UsersContext.tsx";
import {HandCoins} from "lucide-react";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {sign} from "../../../blockchain/Signed.ts";

export const MakeTransaction: FC<{ user: OwnUser }> = ({user}) => {
    const {send} = useContext(RealtimeContext)!;

    const [to, setTo] = useState("");
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
                    <input placeholder="Public Key" className={"w-full " + (toOk ? "" : " invalid")} type="text"
                           value={to} onChange={e => setTo(e.target.value)}/>
                </td>
            </tr>
            <tr>
                <td>Anzahl:</td>
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
                        to,
                        amount: amountFloat,
                        fee: feeFloat
                    }), user.publicKey, user.privateKey))
                }}
            >
                <HandCoins/>
                Transaktion durchführen
            </button>
        </div>
    </>
}