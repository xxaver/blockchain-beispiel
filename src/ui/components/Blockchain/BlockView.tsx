import {Block, getBlockHash} from "../../../blockchain/Block.ts";
import {FC, useContext} from "react";
import {Accordeon} from "../Accordeon.tsx";
import {usePromise} from "../RawMessages/util.ts";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";

export const BlockView: FC<{block: Block}> = ({block}) => {
    const hash = usePromise(getBlockHash(block))
    const {selectedBlock, setSelectedBlock } = useContext(BlockchainContext)!;
    
    return <div className={`outline-1 p-2 w-full ${block.id === 0 ? "bg-blue-200 text-blue-600" : ""} ${selectedBlock === hash ? "outline-blue-700" : ""}`} onClick={() => setSelectedBlock(hash)}>
        {block.id === 0 ? "Genesis Block" :<Accordeon title={hash}></Accordeon>}
    </div>
}