import {FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {BlockchainContext} from "./BlockchainContext.ts";
import {Block, getBlockHash, verifyProofOfWork} from "../../../blockchain/Block.ts";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {genesisBlock, getBlockChains, getContainingChain, getMaxChain} from "../../../blockchain/BlockChain.ts";

export const Blockchain: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!;

    const [blocks, setBlocks] = useState<Block[]>([genesisBlock])
    const [selectedBlock, setSelectedBlock] = useState<null | string>(null);
    const chains = useMemo(() => ({
        block: genesisBlock,
        children: getBlockChains(blocks, 1)
    }), [blocks]);
    const currentChain = useMemo(() => {
        if (selectedBlock === null) return getMaxChain(chains);
        else return getContainingChain(chains, selectedBlock) || [];
    }, [selectedBlock, chains])
    
    console.log(blocks)
    useEvent("block", async (block: Block) => {
        if (!await verifyProofOfWork(block)) {
            console.log("FAIL", block)
            return;
        }
        else console.log("SUCCESS", block)
        const hash = await getBlockHash(block);
        setBlocks(blocks => {
            if(blocks.some(b => b.hash === hash)) return blocks;
            return [...blocks, {...block, hash}]
        })
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