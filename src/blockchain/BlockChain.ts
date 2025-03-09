import {Block, getBlockHash, ProofOfWork, verifyProofOfWork} from "./Block.ts";
import {Transaction, TransactionState} from "./Transaction.ts";
import {parseJSON} from "../ui/util.ts";
import {Signed, verify} from "./Signed.ts";
import {finality, maxTransactions} from "../ui/config.ts";

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

export const computeBlock = async (block: Block): Promise<ComputedBlock> => {
    if (block.id === 0) return genesisBlock;
    return ({
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
}
export const uncomputeBlock = (block: ComputedBlock): Block => ({
    mined: block.mined,
    id: block.id,
    data: block.data,
    prevHash: block.prevHash,
})
export const getBlockChains = (blocks: ComputedBlock[], id = 0, prevHash = ""): BlockChainBlock[] => {
    return blocks.filter(block => block.id === id && block.prevHash === prevHash)
        .map<BlockChainBlock>(block => ({block, children: getBlockChains(blocks, id + 1, block.hash)}))
}

export const addAccountBalances = (block: BlockChainBlock, balances: Record<string, number> = {}, pastTransactions: Transaction[] = []) => {
    block.block.transactionsValid = true;
    block.block.balances = {...balances};
    block.block.pastTransactions = [...pastTransactions];
    block.block.balances[block.block.mined.publicKey] = (block.block.balances[block.block.mined.publicKey] || 0) + 1;
    if (block.block.transactions.length > maxTransactions) block.block.transactionsValid = false;
    for (const transaction of block.block.transactions) {
        if (transaction.amount < 0
            || transaction.fee < 0
            || (block.block.balances[transaction.from] || 0) < transaction.amount + transaction.fee
            || block.block.pastTransactions.some(e => e.id === transaction.id && e.from === transaction.from)
            || !transaction.isSigned
        ) {
            transaction.isValid = false;
            block.block.transactionsValid = false;
        } else transaction.isValid = true;
        block.block.pastTransactions.push(transaction);
        block.block.balances[transaction.from] = (block.block.balances[transaction.from] || 0) - transaction.amount - transaction.fee;
        block.block.balances[transaction.to] = (block.block.balances[transaction.to] || 0) + transaction.amount;
        block.block.balances[block.block.mined.publicKey] = (block.block.balances[block.block.mined.publicKey] || 0) + transaction.fee;
    }
    for (const balance in block.block.balances) {
        if (block.block.balances[balance] < 0) {
            block.block.transactionsValid = false;
            break;
        }
    }
    block.children.forEach((e) => addAccountBalances(e, block.block.balances, block.block.pastTransactions));
    return block;
}

export const getMaxChain = (block: BlockChainBlock, check = true): ComputedBlock[] => {
    const all = block.children.filter(child => !check || (child.block.transactionsValid && child.block.proofOfWorkValid)).map(e => getMaxChain(e, check));
    if (!all.length) return [block.block];
    const max = Math.max(...all.map(e => e.length));
    return [block.block, ...all.find(e => e.length === max)!];
}
export const getContainingChain = (block: BlockChainBlock, searchHash: string, strict = false): ComputedBlock[] | null => {
    if (block.block.hash === searchHash) return strict ? [block.block] : getMaxChain(block, false);
    for (let i = 0; i < block.children.length; i++) {
        const chain = getContainingChain(block.children[i], searchHash, strict);
        if (chain) return [block.block, ...chain];
    }
    return null;
}

export const applyTransactions = (balances: Record<string, number>, transactions: Transaction[]) => {
    transactions.forEach((t: Transaction) => {
        balances[t.from] = (balances[t.from] || 0) - t.fee - t.amount;
        balances[t.to] = (balances[t.to] || 0) + t.amount;
    })
    return balances;
}

export const getTransactionProcessedState = (chain: ComputedBlock[], transaction: Transaction): [TransactionState | null, number] => {
    const index = chain.findIndex(b => isTransactionIncluded(b, transaction))
    const depth = chain.length - index;
    const state = index >= 0 ? (depth >= finality ? TransactionState.Final : TransactionState.Processed) : null;
    return [state, depth];
}

export const isTransactionIncluded = (block: ComputedBlock, transaction: Transaction) => {
    return block.transactions.some(t => {
        for (const key in transaction) {
            if (t[key as keyof Transaction] !== transaction[key as keyof Transaction]) return false;
        }
        return true;
    })
}