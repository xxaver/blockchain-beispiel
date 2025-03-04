import {createContext, Dispatch, ReactNode, SetStateAction} from "react";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {parseJSON} from "../../util.ts";

export interface SignedTransaction {
    signed: Signed;
    transaction: Transaction;
    isSigned: boolean;
    random: number;
}
export interface TransactionStatus {
    icon: ReactNode;
    transaction: SignedTransaction;
}

export const MempoolContext = createContext<null | {
    mempool: SignedTransaction[];
    valid: SignedTransaction[];
    chosenStatus: TransactionStatus[];
    double: SignedTransaction[];
    notSigned: SignedTransaction[];
    overspent: SignedTransaction[];
    invalid: SignedTransaction[];
    chosen: SignedTransaction[];
    setChosen: Dispatch<SetStateAction<SignedTransaction[]>>
    auto: boolean;
    setAuto: Dispatch<SetStateAction<boolean>>
}>(null);

export const getSignedTransaction = async (signed: Signed) => {
    const valid = await verify(signed);
    const transaction = parseJSON(signed.data);
    return {transaction, signed, isSigned: !!valid}
}
export const isGenerallyValid = (transaction: SignedTransaction) => transaction.isSigned && (transaction.transaction.fee >= 0 && transaction.transaction.amount >= 0);