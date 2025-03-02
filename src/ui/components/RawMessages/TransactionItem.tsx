import {FC, useContext} from "react";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {ArrowRight, Pickaxe} from "lucide-react";
import {UsersContext} from "../../handlers/Users/UsersContext.tsx";
import {parseJSON, usePromise} from "../../util.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";

export const TransactionTitle: FC<{ transaction: Transaction; withFee?: boolean }> = ({transaction, withFee}) => {
    const {knownUsers} = useContext(UsersContext)!;
    const getName = (publicKey: string) =>
        knownUsers.find(user => user.publicKey === publicKey)?.name
        || (publicKey.slice(0, 10) + "...");
    
    return <>
        {transaction && getName(transaction.from || "")}
        <CurrentCoins coins={transaction.amount} />
        <ArrowRight/>
        {transaction && getName(transaction.to)}
        {withFee && <>
            <div className="grow"></div>
            <Pickaxe />
            <CurrentCoins coins={transaction.fee} />
        </>}
    </>
}

export const TransactionItem: FC<{ message: object }> = ({message}) => {
    return <TransactionTitle transaction={parseJSON((message as Signed).data)} />
}
