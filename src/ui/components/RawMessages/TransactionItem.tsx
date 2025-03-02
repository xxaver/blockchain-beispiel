import {FC, useContext} from "react";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {ArrowRight} from "lucide-react";
import {UsersContext} from "../../handlers/Users/UsersContext.tsx";
import {usePromise} from "../../util.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {Error} from "./Error.tsx";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";

export const TransactionTitle: FC<{ transaction: Transaction }> = ({transaction}) => {
    const {knownUsers} = useContext(UsersContext)!;
    const getName = (publicKey: string) =>
        knownUsers.find(user => user.publicKey === publicKey)?.name
        || (publicKey.slice(0, 10) + "...");
    
    return <>
        {transaction && getName(transaction.from || "")}
        <CurrentCoins coins={transaction.amount} />
        <ArrowRight/>
        {transaction && getName(transaction.to)}
    </>
}

export const TransactionItem: FC<{ message: object }> = ({message}) => {
    const transaction = usePromise(verify<Transaction>(message as Signed));

    if (transaction === false) return "Nicht signierte Transaktion";
    if (transaction === null) return "Überprüfen...";
    return <TransactionTitle transaction={transaction} />
}

export const TransactionError: FC<{ message: object }> = ({message}) => {
    const transaction = usePromise(verify<Transaction>(message as Signed));

    if (transaction === false) return <Error>Nicht signierte Transaktion</Error>;
    return null;
}