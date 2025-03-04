import {Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useMemo, useState} from "react";
import {BlockchainContext} from "./BlockchainContext.ts";
import {Block} from "../../../blockchain/Block.ts";
import {RealtimeContext, useEvent} from "../Realtime/RealtimeContext.ts";
import {
    addAccountBalances,
    computeBlock, ComputedBlock,
    genesisBlock,
    getBlockChains,
    getContainingChain,
    getMaxChain,
    uncomputeBlock
} from "../../../blockchain/BlockChain.ts";

export const Blockchain: FC<PropsWithChildren> = ({children}) => {
    const {send} = useContext(RealtimeContext)!;

    const [blocks, setBlocks] = useState([genesisBlock])
    const [selectedBlock, setSelectedBlock] = useState<null | string>(null);
    const [strict, setStrict] = useState(false);
    const [withholdBlocks, setWithholdBlocks] = useState(false)
    const [withheldBlocks, setWithheldBlocks] = useState<ComputedBlock[]>([])
    
    const addWithoutDouble = (block: ComputedBlock, setter: Dispatch<SetStateAction<ComputedBlock[]>>) => setter(blocks => {
        if (blocks.some(b => b.hash === block.hash)) return blocks;
        return [...blocks, block]
    })
    const sendBlock = async (block: Block) => {
        const real = await addBlock(block);
        if(withholdBlocks) addWithoutDouble(real, setWithheldBlocks)
        else send("block", block);
    }
    const addBlock = async (block: Block) => {
        const real = await computeBlock(block);
        addWithoutDouble(real, setBlocks)
        return real;
    }
    useEffect(() => {
        if(!withholdBlocks && withheldBlocks.length) {
            setWithheldBlocks(blocks => {
                blocks.forEach(block => send("block", uncomputeBlock(block)));
                return [];
            })
        }
    }, [withholdBlocks, withheldBlocks]);
    console.log(blocks, withheldBlocks)

    const chains = useMemo(() => addAccountBalances({
        block: genesisBlock,
        children: getBlockChains(blocks, 1)
    }), [blocks]);
    const currentChain = useMemo(() => {
        if (selectedBlock === null) return getMaxChain(chains);
        else return getContainingChain(chains, selectedBlock, strict) || [];
    }, [selectedBlock, chains, strict])

    useEvent("block", addBlock);
    useEvent("discover", () => {
        blocks.forEach(block => !withheldBlocks.some(e => e.hash === block.hash) && send("block", uncomputeBlock(block), true))
    })

    return <BlockchainContext.Provider
        value={{selectedBlock, setSelectedBlock, blocks, currentChain, chains, strict, setStrict, sendBlock, withholdBlocks, setWithholdBlocks, withheldBlocks}}
    >
        {children}
    </BlockchainContext.Provider>
}