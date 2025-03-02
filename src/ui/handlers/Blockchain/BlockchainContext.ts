import {createContext, Dispatch, SetStateAction} from "react";
import {Block} from "../../../blockchain/Block.ts";
import {BlockChainBlock} from "../../../blockchain/BlockChain.ts";

export const BlockchainContext = createContext<null | {
    selectedBlock: string | null;
    currentChain: Block[];
    setSelectedBlock: Dispatch<SetStateAction<string | null>>;
    blocks: Block[];
    chains: BlockChainBlock;
}>(null);