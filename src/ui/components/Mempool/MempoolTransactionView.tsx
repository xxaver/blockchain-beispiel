import {FC, useContext} from "react";
import {MempoolContext, SignedTransaction} from "../../handlers/Mempool/MempoolContext.ts";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {Coins, MinusCircle, PlusCircle} from "lucide-react";

import {transactionStateItemMapping} from "../Transactions/TransactionStateItemMapping.tsx";

export const MempoolTransactionView: FC<{ transaction: SignedTransaction; withValid?: boolean }> =
    ({transaction, withValid}) => {
        const {chosen, setChosen, auto, chosenStatus} = useContext(MempoolContext)!;
        const included = chosen.includes(transaction);
        const state = chosenStatus.find(e => e.transaction === transaction);

        return <>
            {withValid && state && transactionStateItemMapping[state.state]}
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