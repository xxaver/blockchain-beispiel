import {Block, getBlockHash, ProofOfWork, verifyProofOfWork} from "./Block.ts";
import {Transaction} from "./Transaction.ts";
import {parseJSON} from "../ui/util.ts";
import {Signed, verify} from "./Signed.ts";

export const genesisBlock: ComputedBlock = {
    id: 0,
    prevHash: "",
    mined: {
        publicKey: "",
        proofOfWork: 0
    },
    data: "",
    hash: "",
    transactions: [],
    pastTransactions: [],
    transactionsValid: true,
    proofOfWorkValid: true,
    balances: {}
}

export interface ComputedBlock extends Block {
    hash: string;
    transactionsValid: boolean;
    proofOfWorkValid: boolean;
    balances: Record<string, number>;
    transactions: (Transaction & { isValid: boolean; isSigned: boolean })[];
    pastTransactions: Transaction[];
    mined: ProofOfWork;
}

export interface BlockChainBlock {
    block: ComputedBlock;
    children: BlockChainBlock[]
}

export const computeBlock = async (block: Block): Promise<ComputedBlock> => ({
    ...block,
    hash: await getBlockHash(block),
    transactions: await Promise.all(parseJSON(block.data).map(
        async (e: Signed) => ({...parseJSON(e.data, {}), isValid: true, isSigned: !!await verify(e)}))
    ),
    balances: {},
    pastTransactions: [],
    transactionsValid: true,
    proofOfWorkValid: await verifyProofOfWork(block),
    mined: block.mined!
})
export const getBlockChains = (blocks: ComputedBlock[], id = 0, prevHash = ""): BlockChainBlock[] => {
    return blocks.filter(block => block.id === id && block.prevHash === prevHash)
        .map<BlockChainBlock>(block => ({block, children: getBlockChains(blocks, id + 1, block.hash)}))
}

export const addAccountBalances = (block: BlockChainBlock, balances: Record<string, number> = {}, allTransactions: Transaction[] = []) => {
    block.block.transactionsValid = true;
    balances = {...balances};
    balances[block.block.mined.publicKey] = (balances[block.block.mined.publicKey] || 0) + 1;
    for (const transaction of block.block.transactions) {
        if (transaction.amount < 0
            || transaction.fee < 0
            || balances[transaction.from] < transaction.amount + transaction.fee
            || allTransactions.some(e => e.id === transaction.id && e.from === transaction.from)
            || !transaction.isSigned
        ) {
            transaction.isValid = false;
            block.block.transactionsValid = false;
        } else transaction.isValid = true;
        allTransactions.push(transaction);
        balances[transaction.from] = (balances[transaction.from] || 0) - transaction.amount - transaction.fee;
        balances[transaction.to] = (balances[transaction.to] || 0) + transaction.amount;
        balances[block.block.mined.publicKey] = (balances[block.block.mined.publicKey] || 0) + transaction.fee;
    }
    block.block.balances = balances;
    for (const balance in balances) {
        if (balances[balance] < 0) {
            block.block.transactionsValid = false;
            break;
        }
    }
    block.children.forEach(child => addAccountBalances(child, balances, allTransactions));
    return block;
}

export const getMaxChain = (block: BlockChainBlock): ComputedBlock[] => {
    const all = block.children.filter(child => child.block.transactionsValid && child.block.proofOfWorkValid).map(getMaxChain);
    if (!all.length) return [block.block];
    const max = Math.max(...all.map(e => e.length));
    return [block.block, ...all.find(e => e.length === max)!];
}
export const getContainingChain = (block: BlockChainBlock, searchHash: string): ComputedBlock[] | null => {
    console.log(block, searchHash);
    if (block.block.hash === searchHash) return [block.block];
    for (let i = 0; i < block.children.length; i++) {
        const chain = getContainingChain(block.children[i], searchHash);
        if (chain) return [block.block, ...chain];
    }
    return null;
}