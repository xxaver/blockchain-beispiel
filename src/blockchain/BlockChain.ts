import {Block} from "./Block.ts";

export const genesisBlock: Block = {
    id: 0,
    prevHash: "",
    mined: null,
    data: ""
}

export interface BlockChainBlock {
    block: Block;
    children: BlockChainBlock[]
}
export const getBlockChains = (blocks: Block[], id=0, prevHash=null): BlockChainBlock[] => {
    return blocks.filter(block => block.id === id && block.id === prevHash)
        .map<BlockChainBlock>(block => ({block, children: getBlockChains(blocks, id + 1, prevHash)}))
}