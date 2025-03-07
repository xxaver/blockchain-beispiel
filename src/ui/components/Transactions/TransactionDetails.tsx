import {FC, PropsWithChildren} from "react";
import {LayoutProps} from "../../layout/LayoutContext.tsx";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {useUsername} from "../../handlers/Users/UsersContext.tsx";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";
import {DragOpener} from "../../layout/DragOpener.tsx";
import {Accordeon} from "../Accordeon.tsx";

export const TransactionOpener: FC<PropsWithChildren<{transaction: Transaction}>> = ({transaction, children}) => {
    const from = useUsername(transaction.from);
    const to = useUsername(transaction.to);
    
    return <DragOpener containerType="Mempool" config={{
        type: "component",
        componentType: "Transaktion",
        componentState: transaction,
        title: `(${transaction.amount}$) ${from} an ${to}`
    }}>
        {children}
    </DragOpener>
}
export const TransactionDetails: FC<LayoutProps<Transaction>> = ({props: transaction, close}) => {
    const from = useUsername(transaction.from)
    const to = useUsername(transaction.to)

    return <div>
        <Accordeon title={<>Von: <div className="grow" /> {from}</>}>
            <textarea rows={10} readOnly value={transaction.from} />
        </Accordeon>
        <Accordeon title={<>An: <div className="grow" /> {to}</>}>
            <textarea rows={10} readOnly value={transaction.to} />
        </Accordeon>
        <div className="flex items-center p-2">
            <div className="grow">Betrag:</div>
            <CurrentCoins coins={transaction.amount} />
        </div>
        <div className="flex items-center p-2">
            <div className="grow">Gebühr:</div>
            <CurrentCoins coins={transaction.fee} />
        </div>
        <div className="flex items-center p-2">
            <div className="grow">Nonce:</div>
            {transaction.id}
        </div>
    </div>
}