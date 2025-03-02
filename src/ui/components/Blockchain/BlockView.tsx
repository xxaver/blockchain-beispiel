import {Block} from "../../../blockchain/Block.ts";
import {FC, useContext} from "react";
import {Accordeon} from "../Accordeon.tsx";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";
import {MousePointer2} from "lucide-react";

export const BlockView: FC<{ block: Block }> = ({block}) => {
    const {setSelectedBlock, currentChain} = useContext(BlockchainContext)!;

    const isSelected = currentChain.some(e => e.hash === block.hash);
    const select = <>
        <div className="grow"></div>
        <button onClick={() => setSelectedBlock(block.hash!)}>
            <MousePointer2/>
        </button>
    </>
    return <div
        className={`outline-1 p-2 w-full ${block.id === 0 ? "bg-blue-200 text-blue-600" : isSelected ? "bg-green-200 text-green-600" : ""}`}>
        {block.id === 0
            ? <div className="flex items-center gap-2">Genesis Block {select}</div>
            : <Accordeon title={<>{block.hash} {select}</>}></Accordeon>}
    </div>
}