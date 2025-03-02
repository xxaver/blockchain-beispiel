import {FC, MutableRefObject, useContext, useRef} from "react";
import {Boxes, Link} from "lucide-react";
import {BlockWithChildrenView} from "./BlockWithChildrenView.tsx";
import {Xwrapper} from "react-xarrows";
import {useDraggable} from "react-use-draggable-scroll";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";

export const BlockchainView: FC = () => {
    const {selectedBlock, setSelectedBlock, chains} = useContext(BlockchainContext)!;

    const ref = useRef<HTMLDivElement>(null);
    const {events} = useDraggable(ref as MutableRefObject<HTMLDivElement>);

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Boxes/>
            <h1>Blockchain</h1>
            <div className="h-[34px]"></div>
            <div className="grow"></div>
            <button
                className={`flex items-center gap-2 toggle ${selectedBlock === null ? "toggled" : "untoggled"}`}
                onClick={() => setSelectedBlock(null)}
            >
                <Link/>
                Längste Kette
            </button>
        </div>
        <div
            className="grow relative min-h-0 overflow-auto"
            ref={ref}
            {...events}>
            <Xwrapper>
                <BlockWithChildrenView block={chains}/>
            </Xwrapper>
        </div>
    </>
}