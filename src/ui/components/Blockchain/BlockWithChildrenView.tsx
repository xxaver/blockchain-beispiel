import {FC, RefObject, useRef} from "react";
import {BlockChainBlock} from "../../../blockchain/BlockChain.ts";
import {BlockView} from "./BlockView.tsx";
import Xarrow from "react-xarrows";
import {useLoaded} from "../../util.ts";

export const BlockWithChildrenView: FC<{
    selected: RefObject<HTMLDivElement>;
    block: BlockChainBlock;
    prevRef?: RefObject<HTMLDivElement>
}> = ({block, prevRef, selected}) => {
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
            <BlockView selected={selected} block={block.block}/>
        </div>
        <div>
            {block.children.map((child, i) => <BlockWithChildrenView selected={selected} key={i} prevRef={ref} block={child}/>)}
        </div>
    </div>
}