import {FC} from "react";
import {useLastBlock} from "../../handlers/Blockchain/BlockchainContext.ts";
import {TransactionListItem} from "../Transactions/TransactionDetails.tsx";

export const AccountTransactions: FC<{ publicKey: string }> = ({publicKey}) => {
    const block = useLastBlock();
    const belonging = block.pastTransactions.filter(t => t.from === publicKey || t.to === publicKey);

    return <>
        {!belonging.length && <div className="text-center my-5">
            Keine Transaktionen
        </div>}
        {belonging.map((transaction) => <TransactionListItem
            transaction={transaction}
            color={transaction.to === publicKey ? "text-green-700 bg-green-200" : "text-red-600 bg-red-200"}
            key={`${transaction.amount}:${transaction.id}`}/>
        )}
    </>
}