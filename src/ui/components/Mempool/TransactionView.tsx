import {FC, useContext} from "react";
import {MempoolContext, SignedTransaction} from "../../handlers/Mempool/MempoolContext.ts";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {Check, Coins, MinusCircle, PlusCircle} from "lucide-react";

export const TransactionView: FC<{ transaction: SignedTransaction; withValid?: boolean }> = 
    ({transaction, withValid}) => {
    const {chosen, setChosen, auto, chosenStatus} = useContext(MempoolContext)!;
    const included = chosen.includes(transaction);

    return <>
        {withValid && (chosenStatus.find(e => e.transaction === transaction)?.icon ||
            <Check className="text-green-600"/>)}
        <Coins/>
        <TransactionTitle withFee transaction={transaction.transaction}/>
        {!auto && <button onClick={() => setChosen(chosen => {
            if (chosen.includes(transaction)) return chosen.filter(e => e !== transaction);
            return [...chosen, transaction];
        })}>
            {included ? <MinusCircle/> : <PlusCircle/>}
        </button>}
    </>
}