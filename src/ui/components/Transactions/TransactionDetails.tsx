import {FC, PropsWithChildren, useContext} from "react";
import {LayoutProps} from "../../layout/LayoutContext.tsx";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {useUsername} from "../../handlers/Users/UsersContext.tsx";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";
import {DragOpener} from "../../layout/DragOpener.tsx";
import {Accordeon} from "../Accordeon.tsx";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";
import {getTransactionProcessedState} from "../../../blockchain/BlockChain.ts";
import {finality} from "../../config.ts";
import {transactionStateItemMapping, transactionStateTextMapping} from "./TransactionStateItemMapping.tsx";
import {Pickaxe} from "lucide-react";

export const TransactionListItem: FC<PropsWithChildren<{ transaction: Transaction; color?: string }>> =
    ({transaction, color, children}) => {
        const from = useUsername(transaction.from);
        const to = useUsername(transaction.to);

        return <DragOpener containerType="Mempool"
                           config={{
                               type: "component",
                               componentType: "Transaktion",
                               componentState: transaction,
                               title: `(${transaction.amount}$) ${from} an ${to}`
                           }}>
            <div className="item">
                <div
                    className={`flex items-center gap-2 p-2  ${color || "bg-yellow-600/20 text-yellow-600"}`}>
                    {children || <TransactionTitle withFee transaction={transaction}/>}
                </div>
            </div>
        </DragOpener>
    }
export const TransactionDetails: FC<LayoutProps<Transaction>> = ({props: transaction}) => {
    const {currentChain} = useContext(BlockchainContext)!
    const [state, depth] = getTransactionProcessedState(currentChain, transaction);

    const from = useUsername(transaction.from)
    const to = useUsername(transaction.to)

    return <div>
        <Accordeon title={<>Von: <div className="grow"/> {from}</>}>
            <textarea rows={10} readOnly value={transaction.from}/>
        </Accordeon>
        <Accordeon title={<>An: <div className="grow"/> {to}</>}>
            <textarea rows={10} readOnly value={transaction.to}/>
        </Accordeon>
        <div className="flex items-center p-2">
            <div className="grow">Betrag:</div>
            <CurrentCoins coins={transaction.amount}/>
        </div>
        <div className="flex items-center p-2">
            <div className="grow">Gebühr:</div>
            <CurrentCoins coins={transaction.fee}/>
        </div>
        <div className="flex items-center p-2">
            <div className="grow">Nonce:</div>
            {transaction.id}
        </div>
        <div className="flex items-center p-2">
            <div className="grow">Nachricht:</div>
            {transaction.message}
        </div>
        <div className="flex items-center p-2">
            <div className="grow">Status:</div>
            <div className="flex items-center gap-2">
                {state !== null ? <>
                    {transactionStateItemMapping[state]}
                    {transactionStateTextMapping[state]}
                </> : <>
                    <Pickaxe className="text-red-600"/>
                    Wird verarbeitet
                </>}
            </div>
        </div>
        {state !== null && <div className="flex items-center p-2">
            <div className="grow">Blocktiefe:</div>
            <div className="flex items-center gap-2">
                {depth} / {finality}
            </div>
        </div>}
    </div>
}