import {createContext, Dispatch, SetStateAction} from "react";

export const BlockchainContext = createContext<null | {
    selectedBlock: string | null;
    setSelectedBlock: Dispatch<SetStateAction<string | null>>
}>(null);