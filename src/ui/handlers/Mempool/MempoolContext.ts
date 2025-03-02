import {createContext} from "react";
import {Transaction} from "../../../blockchain/Transaction.ts";

export const MempoolContext = createContext<null | {
    mempool: Transaction[];
}>(null);