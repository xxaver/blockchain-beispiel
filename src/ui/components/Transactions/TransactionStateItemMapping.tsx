import {TransactionState} from "../../../blockchain/Transaction.ts";
import {Check, Layers2, PiggyBank, ShieldCheck, ShieldX, Signature} from "lucide-react";

export const transactionStateItemMapping = {
    [TransactionState.Final]: <ShieldCheck className="text-green-600"/>,
    [TransactionState.Processed]: <ShieldCheck className="text-yellow-600"/>,

    [TransactionState.Invalid]: <ShieldX className="text-red-600"/>,
    [TransactionState.NotSigned]: <Signature className="text-red-600"/>,
    [TransactionState.Double]: <Layers2 className="text-red-600"/>,
    [TransactionState.Valid]: <Check className="text-green-600"/>,
    [TransactionState.Overspent]: <PiggyBank className="text-red-600"/>
}

export const transactionStateTextMapping = {
    [TransactionState.Final]: "Final",
    [TransactionState.Processed]: "Bearbeitet, noch nicht final",

    [TransactionState.Invalid]: "Ungültig (negativer betrag)",
    [TransactionState.NotSigned]: "Nicht signiert",
    [TransactionState.Double]: "Nonce bereits verwendet",
    [TransactionState.Valid]: "Gültig",
    [TransactionState.Overspent]: "Nicht genug Guthaben"
}