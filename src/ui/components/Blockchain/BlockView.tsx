import {Block, getBlockHash} from "../../../blockchain/Block.ts";
import {FC} from "react";
import {Accordeon} from "../Accordeon.tsx";
import {usePromise} from "../RawMessages/util.ts";

export const BlockView: FC<{block: Block}> = ({block}) => {
    const hash = usePromise(getBlockHash(block))
    
    return block.id === 0 ? <div className="bg-blue-200 text-blue-600 p-2 w-full">Genesis Block</div> : <div className="p-2 shadow">
        <Accordeon title={hash}></Accordeon>
    </div>
}