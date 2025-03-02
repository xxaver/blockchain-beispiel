import {FC, MutableRefObject, useRef, useState} from "react";
import {Box, Boxes} from "lucide-react";
import {BlockChainBlock, genesisBlock} from "../../../blockchain/BlockChain.ts";
import {BlockWithChildrenView} from "./BlockWithChildrenView.tsx";
import {Xwrapper} from "react-xarrows";
import {useDraggable} from "react-use-draggable-scroll";

export const BlockchainView: FC = () => {
    
    const [autoNewest, setAutoNewest] = useState(true);
    
    const blockchain: BlockChainBlock = {
        block: genesisBlock,
        children: [{
            block: genesisBlock,
            children: [{block: genesisBlock, children: []}, {
                block: genesisBlock,
                children: [{block: genesisBlock, children: []}, {block: genesisBlock, children: []}]
            }]
        }, {block: genesisBlock, children: []}]
    };

    const ref = useRef<HTMLDivElement>(null);
    const {events} = useDraggable(ref as MutableRefObject<HTMLDivElement>);

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Boxes/>
            <h1>Blockchain</h1>
            <div className="h-[34px]"></div>
            <div className="grow"></div>
            <button
                className={`flex items-center gap-2 toggle ${autoNewest ? "toggled" : "untoggled"}`}
                onClick={() => setAutoNewest(!autoNewest)}
            >
                <Box />
                Neuester
            </button>
        </div>
        <div
            className="grow relative min-h-0 overflow-auto"
            ref={ref}
            {...events}>
            <Xwrapper>
                <BlockWithChildrenView block={blockchain}/>
            </Xwrapper>
        </div>
    </>
}