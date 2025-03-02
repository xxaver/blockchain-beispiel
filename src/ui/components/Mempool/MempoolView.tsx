import {FC, useContext} from "react";
import {ArrowLeftRight, Coins, PiggyBank, ShieldCheck, ShieldX} from "lucide-react";
import {MempoolContext} from "../../handlers/Mempool/MempoolContext.ts";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";

export const MempoolView: FC = () => {
    const {mempool} = useContext(MempoolContext)!;
    const valid = mempool;
    const double = mempool;
    const overspent = mempool;

    const categories = [{
        title: <div className="p-2 flex items-center gap-2 text-green-700"><ShieldCheck/> Gültig</div>,
        data: valid
    }, {
        title: <div className="p-2 flex items-center gap-2 text-red-700"><ShieldX/> Doppelt</div>,
        data: double
    }, {
        title: <div className="p-2 flex items-center gap-2 text-red-700"><PiggyBank/> Nicht genug Guthaben</div>,
        data: overspent
    }]

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <ArrowLeftRight/>
            <h1>Ausstehende Transaktionen</h1>
            <div className="h-[34px]"></div>
        </div>
        <div
            className="grow min-h-0">
            {categories.map((category, key) => <div className={key ? "border-t border-gray-200" : ""} key={key}>
                {category.title}
                {!category.data.length && <div className="text-center my-10 text-gray-400">Keine Transaktionen</div>}
                {category.data.map(transaction => <div
                    className="bg-yellow-600/20 flex items-center gap-2 p-2 text-yellow-600"
                    key={`${transaction.from}:${transaction.id}`}>
                    <Coins/>
                    <TransactionTitle withFee transaction={transaction}/>
                </div>)}
            </div>)}
        </div>
    </>
}