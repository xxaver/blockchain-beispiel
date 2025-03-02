import {FC, PropsWithChildren, useMemo, useState} from "react";
import {MempoolContext, SignedTransaction} from "./MempoolContext.ts";
import {useEvent} from "../Realtime/RealtimeContext.ts";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {parseJSON, sortedIndex} from "../../util.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {useLastBlock} from "../Blockchain/BlockchainContext.ts";

export const Mempool: FC<PropsWithChildren> = ({children}) => {
    const [mempool, setMempool] = useState<SignedTransaction[]>([]);
    const block = useLastBlock();
    
    useEvent("transaction", (signed: Signed) => {
        verify<Transaction>(signed).then(valid => {
            const transaction = parseJSON(signed.data);
            setMempool(mempool => {
                if(mempool.some(e => e.transaction.id === transaction.id && e.transaction.from === transaction.from)) return mempool;
                const newMempool = [...mempool];
                const index = sortedIndex(newMempool.map(t => t.transaction.fee), transaction.fee, false);
                newMempool.splice(index, 0, {transaction, signed, isSigned: !!valid});
                return newMempool;
            })
        });
    }, true)

    const notSigned = mempool.filter(e => !e.isSigned);
    const {double, overspent, valid, invalid} = useMemo(() => {
        const signed = mempool.filter(e => e.isSigned);
        const allTransactions = [...block.pastTransactions];
        console.log(allTransactions, block)
        const balances = {...block.balances};
        const valid: SignedTransaction[] = [], double: SignedTransaction[] = [], overspent: SignedTransaction[] = [], invalid: SignedTransaction[] = [];
        for(const t of signed) {
            const {transaction} = t;
            if(transaction.fee < 0 || transaction.amount < 0) invalid.push(t);
            else if(allTransactions.some(t => t.id === transaction.id && t.from === transaction.from)) double.push(t);
            else if((balances[transaction.from] || 0) < transaction.amount + transaction.fee) overspent.push(t);
            else valid.push(t);
            balances[transaction.from] = (balances[transaction.from] || 0) - transaction.amount - transaction.fee;
            allTransactions.push(transaction);
        }
        return {valid, double, overspent, invalid};
    }, [block, mempool]);

    return <MempoolContext.Provider
        value={{mempool, notSigned, valid, overspent, double, invalid}}
    >
        {children}
    </MempoolContext.Provider>
}