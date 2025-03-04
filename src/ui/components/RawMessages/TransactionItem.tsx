import {FC} from "react";
import {Signed} from "../../../blockchain/Signed.ts";
import {ArrowRight, Pickaxe} from "lucide-react";
import {useUsername} from "../../handlers/Users/UsersContext.tsx";
import {parseJSON} from "../../util.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";

export const TransactionTitle: FC<{ transaction: Transaction; withFee?: boolean }> = ({transaction, withFee}) => {
    const from = useUsername(transaction.from);
    const to = useUsername(transaction.to);

    return <>
        {from}
        <CurrentCoins coins={transaction.amount}/>
        <ArrowRight/>
        {to}
        {withFee && <>
            <div className="grow-[10000]"></div>
            <Pickaxe/>
            <CurrentCoins coins={transaction.fee}/>
        </>}
    </>
}

export const TransactionItem: FC<{ message: object }> = ({message}) => {
    return <TransactionTitle withFee transaction={parseJSON((message as Signed).data)}/>
}
