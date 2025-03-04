import {createContext, Dispatch, SetStateAction} from "react";
import {Signed, verify} from "../../../blockchain/Signed.ts";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {parseJSON} from "../../util.ts";

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