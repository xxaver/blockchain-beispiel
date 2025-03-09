import {TransactionState} from "../../../blockchain/Transaction.ts";
import {Check, Layers2, PiggyBank, ShieldX, Signature} from "lucide-react";

export const transactionStateItemMapping = {
    [TransactionState.Invalid]: <ShieldX className="text-red-600"/>,
    [TransactionState.NotSigned]: <Signature className="text-red-600"/>,
    [TransactionState.Double]: <Layers2 className="text-red-600"/>,
    [TransactionState.Valid]: <Check className="text-green-600"/>,
    [TransactionState.Overspent]: <PiggyBank className="text-red-600"/>
}