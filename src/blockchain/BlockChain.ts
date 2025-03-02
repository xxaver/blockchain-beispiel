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

export const getBlockChains = (blocks: Block[], id = 0, prevHash = null): BlockChainBlock[] => {
    return blocks.filter(block => block.id === id && block.id === prevHash)
        .map<BlockChainBlock>(block => ({block, children: getBlockChains(blocks, id + 1, prevHash)}))
}
export const getMaxChain = (block: BlockChainBlock): Block[] => {
    const all = block.children.map(getMaxChain);
    if (!all.length) return [block.block];
    const max = Math.max(...all.map(e => e.length));
    return [block.block, ...all.find(e => e.length === max)!];
}
export const getContainingChain = (block: BlockChainBlock, searchHash: string): Block[] | null => {
    console.log(block, searchHash);
    if (block.block.hash === searchHash) return [block.block];
    for (let i = 0; i < block.children.length; i++) {
        const chain = getContainingChain(block.children[i], searchHash);
        if (chain) return [block.block, ...chain];
    }
    return null;
}