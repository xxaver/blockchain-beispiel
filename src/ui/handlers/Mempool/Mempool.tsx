import {FC, PropsWithChildren, useState} from "react";
import {MempoolContext} from "./MempoolContext.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {useEvent} from "../Realtime/RealtimeContext.ts";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {sortedIndex} from "../../util.ts";

export const Mempool: FC<PropsWithChildren> = ({children}) => {
    const [mempool, setMempool] = useState<Transaction[]>([]);
    useEvent("transaction", (signed: Signed) => {
        verify<Transaction>(signed).then(transaction => {
            if(!transaction) return;
            setMempool(mempool => {
                if(mempool.some(e => e.id === transaction.id && e.from === transaction.from)) return mempool;
                const newMempool = [...mempool];
                const index = sortedIndex(newMempool, transaction.fee, (t) => t.fee, false);
                newMempool.splice(index, 0, transaction);
                return newMempool;
            })
        });
    }, true)

    return <MempoolContext.Provider
        value={{mempool}}
    >
        {children}
    </MempoolContext.Provider>
}