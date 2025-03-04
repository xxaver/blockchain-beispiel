import {FC, PropsWithChildren, ReactNode, useEffect, useMemo, useState} from "react";
import {isGenerallyValid, MempoolContext, SignedTransaction, TransactionStatus} from "./MempoolContext.ts";
import {useEvent} from "../Realtime/RealtimeContext.ts";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {parseJSON, sortedIndex} from "../../util.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {useLastBlock} from "../Blockchain/BlockchainContext.ts";
import {maxTransactions} from "../../config.ts";
import {applyTransactions} from "../../../blockchain/BlockChain.ts";
import {PiggyBank, ShieldX, Signature} from "lucide-react";

export const Mempool: FC<PropsWithChildren> = ({children}) => {
    const [mempool, setMempool] = useState<SignedTransaction[]>([]);
    const [chosen, setChosen] = useState<SignedTransaction[]>([]);
    const [auto, setAuto] = useState(true);
    const block = useLastBlock();
    useEvent("transaction", (signed: Signed) => {
        verify<Transaction>(signed).then(valid => {
            const transaction = parseJSON(signed.data);
            setMempool(mempool => {
                const newMempool = [...mempool];
                const index = sortedIndex(newMempool.map(t => t.transaction.fee), transaction.fee, false);
                newMempool.splice(index, 0, {transaction, signed, isSigned: !!valid, random: Date.now()});
                return newMempool;
            })
        });
    }, true)

    const notSigned = mempool.filter(e => !e.isSigned);

    const autoSelected = useMemo(() => {
        const selected: SignedTransaction[] = [];
        const balances = {...block.balances};
        for(const t of mempool) {
            const {transaction} = t;
            if(!isGenerallyValid(t)) continue;
            if(selected.length >= maxTransactions) break;
            if(balances[transaction.from] < transaction.amount + transaction.fee) continue;
            applyTransactions(balances, [transaction]);
            selected.push(t);
        }

        return selected;
    }, [mempool, block]);
    useEffect(() => {
        if(auto) setChosen(autoSelected);
    }, [autoSelected, auto]);
    const selected = auto ? autoSelected : chosen;
    
    const {double, overspent, valid, invalid} = useMemo(() => {
        const signed = mempool.filter(e => e.isSigned);
        const allTransactions = [...block.pastTransactions, ...selected.filter(isGenerallyValid).map(e => e.transaction)];
        const balances = applyTransactions({...block.balances}, allTransactions);
        
        const valid: SignedTransaction[] = [], double: SignedTransaction[] = [], overspent: SignedTransaction[] = [],
            invalid: SignedTransaction[] = [];
        
        for (const t of signed) {
            if(selected.includes(t)) continue;
            const {transaction} = t;
            if (transaction.fee < 0 || transaction.amount < 0) invalid.push(t);
            else if (allTransactions.some(t => t.id === transaction.id && t.from === transaction.from)) double.push(t);
            else if ((balances[transaction.from] || 0) < transaction.amount + transaction.fee) overspent.push(t);
            else valid.push(t);
        }
        return {valid, double, overspent, invalid};
    }, [block, mempool, selected]);
    

    const chosenStatus = useMemo(() => {
        const balances = {...block.balances};
        const status: TransactionStatus[] = [];

        for (const t of selected) {
            const {transaction} = t;
            let icon: ReactNode;
            if(transaction.fee < 0 || transaction.amount < 0) icon = <ShieldX className="text-red-600" />;
            else if(!t.isSigned) icon = <Signature className="text-red-600" />
            else if(balances[transaction.from] < transaction.amount + transaction.fee) icon = <PiggyBank className="text-red-600" />
            else applyTransactions(balances, [transaction]);
            if(icon) status.push({transaction: t, icon})
        }
        return status;
    }, [selected, block]);

    return <MempoolContext.Provider
        value={{
            mempool,
            notSigned,
            valid: [...valid, ...selected.filter(a => !chosenStatus.some(b => b.transaction === a))],
            overspent,
            double,
            invalid,
            auto,
            chosen: selected,
            chosenStatus,
            setChosen,
            setAuto
        }}
    >
        {children}
    </MempoolContext.Provider>
}