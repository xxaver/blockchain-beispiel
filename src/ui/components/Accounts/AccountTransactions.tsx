import {FC, useContext} from "react";
import {BlockchainContext, useLastBlock} from "../../handlers/Blockchain/BlockchainContext.ts";
import {TransactionListItem} from "../Transactions/TransactionDetails.tsx";
import {Accordeon} from "../Accordeon.tsx";
import {transactionStateItemMapping} from "../Transactions/TransactionStateItemMapping.tsx";
import {TransactionState} from "../../../blockchain/Transaction.ts";
import {getTransactionProcessedState} from "../../../blockchain/BlockChain.ts";
import {Pickaxe} from "lucide-react";
import {MempoolContext} from "../../handlers/Mempool/MempoolContext.ts";

export const AccountTransactions: FC<{ publicKey: string }> = ({publicKey}) => {
    const {currentChain} = useContext(BlockchainContext)!;
    const {valid} = useContext(MempoolContext)!;
    const block = useLastBlock();
    const processed = block.pastTransactions.filter(t => t.from === publicKey || t.to === publicKey);
    const withState = processed.map(transaction => ({
        state: getTransactionProcessedState(currentChain, transaction)[0],
        transaction
    }));
    const categories = [
        {
            title: <>{transactionStateItemMapping[TransactionState.Final]} Finale Transaktionen</>,
            content: withState.filter(e => e.state === TransactionState.Final)
        },
        {
            title: <>{transactionStateItemMapping[TransactionState.Processed]} Bearbeitete Transaktionen</>,
            content: withState.filter(e => e.state === TransactionState.Processed)
        },
        {
            title: <><Pickaxe className="text-red-600"/> Ausstehende Transaktionen</>,
            content: valid.filter(e => e.transaction.from === publicKey || e.transaction.to === publicKey)
        }
    ]

    return categories.map(({title, content}, i) => <Accordeon noPadding key={i} title={<>
        {title}
        <div className="grow"></div>
        <div className="circle">{content.length}</div>
    </>}>
        {!content.length && <div className="text-center py-2 text-gray-400">
            Keine Transaktionen
        </div>}
        {content.map(({transaction}) => <TransactionListItem
            transaction={transaction}
            color={transaction.to === publicKey ? "text-green-700 bg-green-200" : "text-red-600 bg-red-200"}
            key={`${transaction.amount}:${transaction.id}`}/>)}
    </Accordeon>)
}