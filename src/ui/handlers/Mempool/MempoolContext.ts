import {createContext} from "react";
import {Signed} from "../../../blockchain/Signed.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";

export interface SignedTransaction {
    signed: Signed;
    transaction: Transaction;
    isSigned: boolean;
}

export const MempoolContext = createContext<null | {
    mempool: SignedTransaction[];
    valid: SignedTransaction[];
    double: SignedTransaction[];
    notSigned: SignedTransaction[];
    overspent: SignedTransaction[];
    invalid: SignedTransaction[];
}>(null);