import {FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {AssignedTransactionState, isGenerallyValid, MempoolContext, SignedTransaction} from "./MempoolContext.ts";
import {useEvent} from "../Realtime/RealtimeContext.ts";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {parseJSON, sortedIndex} from "../../util.ts";
import {Transaction, TransactionState} from "../../../blockchain/Transaction.ts";
import {useLastBlock} from "../Blockchain/BlockchainContext.ts";
import {maxTransactions} from "../../config.ts";
import {applyTransactions} from "../../../blockchain/BlockChain.ts";

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
    const isDouble = (transaction: Transaction, transactions = block.pastTransactions) => transactions.some(e => e.id === transaction.id && e.from === transaction.from)
    const notSigned = mempool.filter(e => !e.isSigned);

    const autoSelected = useMemo(() => {
        const selected: SignedTransaction[] = [];
        const balances = {...block.balances};
        const allTransactions = [...block.pastTransactions];
        for (const t of mempool) {
            const {transaction} = t;
            if (!isGenerallyValid(t)) continue;
            if (selected.length >= maxTransactions) break;
            if ((balances[transaction.from] || 0) < transaction.amount + transaction.fee || isDouble(transaction, allTransactions)) continue;
            applyTransactions(balances, [transaction]);
            allTransactions.push(transaction);
            selected.push(t);
        }

        return selected;
    }, [mempool, block]);
    useEffect(() => {
        if (auto) setChosen(autoSelected);
    }, [autoSelected, auto]);
    const selected = auto ? autoSelected : chosen;

    const {double, overspent, valid, invalid} = useMemo(() => {
        const signed = mempool.filter(e => e.isSigned);
        const newTransactions = selected.filter(isGenerallyValid).map(e => e.transaction)
        const balances = applyTransactions({...block.balances}, newTransactions);

        const valid: SignedTransaction[] = [], double: SignedTransaction[] = [], overspent: SignedTransaction[] = [],
            invalid: SignedTransaction[] = [];
        for (const t of signed) {
            // if(selected.includes(t)) continue;
            const {transaction} = t;
            if (transaction.fee < 0 || transaction.amount < 0) invalid.push(t);
            else if (
                block.pastTransactions.some(t => t.id === transaction.id && t.from === transaction.from)
                || newTransactions.filter(t => t.id === transaction.id && t.from === transaction.from).length >= 2) double.push(t);
            else if ((balances[transaction.from] || 0) < transaction.amount + transaction.fee) overspent.push(t);
            else valid.push(t);
        }
        return {valid, double, overspent, invalid};
    }, [block, mempool, selected]);

    const chosenStatus = useMemo(() => {
        const balances = {...block.balances};
        const allTransactions = [...block.pastTransactions];
        const status: AssignedTransactionState[] = [];

        for (const t of selected) {
            const {transaction} = t;
            let state = TransactionState.Valid;
            if (transaction.fee < 0 || transaction.amount < 0) state = TransactionState.Invalid;
            else if (!t.isSigned) state = TransactionState.NotSigned
            else if (isDouble(transaction, allTransactions)) state = state = TransactionState.Double
            else if ((balances[transaction.from] || 0) < transaction.amount + transaction.fee) state = state = TransactionState.Overspent
            else {
                applyTransactions(balances, [transaction]);
                allTransactions.push(transaction);
            }
            status.push({transaction: t, state})
        }
        return status;
    }, [selected, block]);
    return <MempoolContext.Provider
        value={{
            mempool,
            notSigned,
            valid: [...valid, ...selected.filter(a => !valid.includes(a) && !chosenStatus.some(b => b.transaction === a))],
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