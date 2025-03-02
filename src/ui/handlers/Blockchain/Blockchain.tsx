import {FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {BlockchainContext} from "./BlockchainContext.ts";
import {Block} from "../../../blockchain/Block.ts";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {
    addAccountBalances,
    computeBlock,
    genesisBlock,
    getBlockChains,
    getContainingChain,
    getMaxChain, uncomputeBlock
} from "../../../blockchain/BlockChain.ts";

export const Blockchain: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!;

    const [blocks, setBlocks] = useState([genesisBlock])
    const [selectedBlock, setSelectedBlock] = useState<null | string>(null);
    const chains = useMemo(() => addAccountBalances({
        block: genesisBlock,
        children: getBlockChains(blocks, 1)
    }), [blocks]);
    const currentChain = useMemo(() => {
        if (selectedBlock === null) return getMaxChain(chains);
        else return getContainingChain(chains, selectedBlock) || [];
    }, [selectedBlock, chains])

    useEvent("block", async (block: Block) => {
        const real = await computeBlock(block);
        setBlocks(blocks => {
            if (blocks.some(b => b.hash === real.hash)) return blocks;
            return [...blocks, real]
        })
    }, true)
    useEvent("discover", () => {
        blocks.forEach(block => send("block", uncomputeBlock(block), true))
    })

    return <BlockchainContext.Provider
        value={{selectedBlock, setSelectedBlock, blocks, currentChain, chains}}
    >
        {children}
    </BlockchainContext.Provider>
}