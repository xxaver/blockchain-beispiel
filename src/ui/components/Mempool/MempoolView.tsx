import {FC, useContext} from "react";
import {ArrowLeftRight, Coins, Pickaxe} from "lucide-react";
import {MempoolContext} from "../../handlers/Mempool/MempoolContext.ts";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";

export const MempoolView: FC = () => {
    const {mempool} = useContext(MempoolContext)!;

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <ArrowLeftRight/>
            <h1>Ausstehende Transaktionen</h1>
            <div className="h-[34px]"></div>
        </div>
        <div
            className="grow min-h-0">
            {!mempool.length && <div className="text-center my-10 text-gray-400">Keine ausstehenden Transaktionen</div>}
            {mempool.map(transaction => <div className="bg-yellow-600/20 flex items-center gap-2 p-2 text-yellow-600" key={`${transaction.from}:${transaction.id}`}>
                <Coins />
                <TransactionTitle transaction={transaction}/>
                <div className="grow"></div>
                <Pickaxe />
                Gebühr:
                <CurrentCoins coins={transaction.fee} />
            </div>)}
        </div>
    </>
}