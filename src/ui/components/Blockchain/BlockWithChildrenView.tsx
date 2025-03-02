import {FC, RefObject, useRef} from "react";
import {BlockChainBlock} from "../../../blockchain/BlockChain.ts";
import {BlockView} from "./BlockView.tsx";
import Xarrow from "react-xarrows";
import {useLoaded} from "../../util.ts";

export const BlockWithChildrenView: FC<{
    block: BlockChainBlock;
    prevRef?: RefObject<HTMLDivElement>
}> = ({block, prevRef}) => {
    const ref = useRef<HTMLDivElement>(null);
    const loaded = useLoaded()

    return <div className="flex items-center w-max min-h-full">
        {loaded && prevRef && <Xarrow
            startAnchor="right"
            endAnchor="left"
            strokeWidth={2}
            start={prevRef}
            end={ref}
        />}
        <div className="my-2 mx-4 w-full" ref={ref}>
            <BlockView block={block.block}/>
        </div>
        <div>
            {block.children.map((child, i) => <BlockWithChildrenView key={i} prevRef={ref} block={child}/>)}
        </div>
    </div>
}