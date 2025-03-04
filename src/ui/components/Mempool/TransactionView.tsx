import {FC, useContext} from "react";
import {MempoolContext, SignedTransaction} from "../../handlers/Mempool/MempoolContext.ts";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {MinusCircle, PlusCircle} from "lucide-react";

export const TransactionView: FC<{transaction: SignedTransaction}> = ({transaction}) => {
    const {chosen, setChosen, auto} = useContext(MempoolContext)!;
    const included = chosen.includes(transaction);
    
    return <>
        <TransactionTitle withFee transaction={transaction.transaction} />
        {!auto && <button onClick={() => setChosen(chosen => {
            console.log(chosen)
            if (chosen.includes(transaction)) return chosen.filter(e => e !== transaction);
            return [...chosen, transaction];
        })}>
            {included ? <MinusCircle/> : <PlusCircle/>}
        </button>}
    </>
}