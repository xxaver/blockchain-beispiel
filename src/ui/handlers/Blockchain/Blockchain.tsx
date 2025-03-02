import {FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {BlockchainContext} from "./BlockchainContext.ts";
import {Block} from "../../../blockchain/Block.ts";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {genesisBlock, getBlockChains, getContainingChain, getMaxChain} from "../../../blockchain/BlockChain.ts";

export const Blockchain: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!;

    const [blocks, setBlocks] = useState<Block[]>([])
    const [selectedBlock, setSelectedBlock] = useState<null | string>(null);
    const chains = useMemo(() => ({
        block: genesisBlock,
        children: getBlockChains(blocks)
    }), [blocks]);
    const currentChain = useMemo(() => {
        if (selectedBlock === null) return getMaxChain(chains);
        else return getContainingChain(chains, selectedBlock) || [];
    }, [selectedBlock, chains])
    
    useEvent("block", (block: Block) => {
        setBlocks(blocks => [...blocks, block])
    }, true)
    useEvent("discover", () => {
        blocks.forEach(block => send("block", block))
    })

    return <BlockchainContext.Provider
        value={{selectedBlock, setSelectedBlock, blocks, currentChain, chains}}
    >
        {children}
    </BlockchainContext.Provider>
}