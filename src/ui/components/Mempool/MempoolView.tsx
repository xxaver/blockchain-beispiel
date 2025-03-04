import {FC, useContext} from "react";
import {ArrowLeftRight, Layers2, MousePointerClick, PiggyBank, ShieldCheck, ShieldX, Signature} from "lucide-react";
import {MempoolContext} from "../../handlers/Mempool/MempoolContext.ts";
import {TransactionView} from "./TransactionView.tsx";
import {Accordeon} from "../Accordeon.tsx";

export const MempoolView: FC = () => {
    const {valid, notSigned, double, overspent, invalid, auto, setAuto, chosen} = useContext(MempoolContext)!;

    const categories = [{
        title: <div className="flex items-center gap-2 text-green-700"><MousePointerClick/> Ausgewählt</div>,
        data: chosen
    }, {
        title: <div className="flex items-center gap-2 text-green-700"><ShieldCheck/> Gültig</div>,
        data: valid
    }, {
        title: <div className="flex items-center gap-2 text-red-700"><ShieldX/> Ungültig</div>,
        data: invalid
    }, {
        title: <div className="flex items-center gap-2 text-red-700"><PiggyBank/> Nicht genug Guthaben</div>,
        data: overspent
    }, {
        title: <div className="flex items-center gap-2 text-red-700"><Signature/> Nicht signiert</div>,
        data: notSigned
    }, {
        title: <div className="flex items-center gap-2 text-red-700"><Layers2/> Bereits Durchgeführt</div>,
        data: double
    }]

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <ArrowLeftRight/>
            <h1>Mempool</h1>
            <div className="grow"/>
            <button
                className={`flex items-center gap-2 toggle ${auto ? "toggled" : ""}`}
                onClick={() => setAuto(!auto)}
            >
                <MousePointerClick/>
                Auto
            </button>
        </div>
        <div
            className="grow min-h-0 overflow-auto">
            {categories.map((category, key) => <div className={key ? "border-t border-gray-200" : ""} key={key}>
                <Accordeon noPadding open={key <= 1} title={<>
                    {category.title}
                    <div className="grow"></div>
                    <div className="circle">{category.data.length}</div>
                </>}>
                    {!category.data.length &&
                        <div className="text-center my-10 text-gray-400">Keine Transaktionen</div>}
                    {category.data.map((transaction) => <div
                        className="bg-yellow-600/20 flex items-center gap-2 p-2 text-yellow-600"
                        key={JSON.stringify(transaction)}>
                        <TransactionView withValid={key === 0} transaction={transaction}/>
                    </div>)}
                </Accordeon></div>)}
        </div>
    </>
}