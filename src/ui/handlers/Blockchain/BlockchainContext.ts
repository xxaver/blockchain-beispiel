import {createContext, Dispatch, SetStateAction, useContext} from "react";
import {BlockChainBlock, ComputedBlock, genesisBlock} from "../../../blockchain/BlockChain.ts";
import {Block} from "../../../blockchain/Block.ts";

export const BlockchainContext = createContext<null | {
    selectedBlock: string | null;
    currentChain: ComputedBlock[];
    setSelectedBlock: Dispatch<SetStateAction<string | null>>;
    blocks: ComputedBlock[];
    chains: BlockChainBlock;
    strict: boolean;
    setStrict: Dispatch<SetStateAction<boolean>>;
    sendBlock: (block: Block) => void;
    withholdBlocks: boolean;
    setWithholdBlocks: Dispatch<SetStateAction<boolean>>;
    withheldBlocks: ComputedBlock[];
}>(null);

export const useLastBlock = () => {
    const {currentChain} = useContext(BlockchainContext)!;
    return currentChain.at(-1) || genesisBlock;
}