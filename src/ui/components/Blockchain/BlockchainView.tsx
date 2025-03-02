import {FC, MutableRefObject, useContext, useEffect, useRef} from "react";
import {Boxes, Link, ShieldCheck} from "lucide-react";
import {BlockWithChildrenView} from "./BlockWithChildrenView.tsx";
import {useXarrow, Xwrapper} from "react-xarrows";
import {useDraggable} from "react-use-draggable-scroll";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";

export const BlockchainView: FC = () => {
    const {selectedBlock, setSelectedBlock, strict, setStrict} = useContext(BlockchainContext)!;

    const ref = useRef<HTMLDivElement>(null);
    const {events} = useDraggable(ref as MutableRefObject<HTMLDivElement>);

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Boxes/>
            <h1>Blockchain</h1>
            <div className="h-[34px]"></div>
            <div className="grow"></div>
            {selectedBlock !== null && <button
                className={`flex items-center gap-2 toggle ${!strict ? "toggled" : ""}`}
                onClick={() => setStrict(!strict)}
            >
                <Link/>
                Kette
            </button>}
            <button
                className={`flex items-center gap-2 toggle ${selectedBlock === null ? "toggled" : "untoggled"}`}
                onClick={() => setSelectedBlock(null)}
            >
                <ShieldCheck/>
                Längste gültige Kette
            </button>
        </div>
        <div
            className="grow relative min-h-0 overflow-auto"
            ref={ref}
            {...events}>
            <Xwrapper>
                <Inner/>
            </Xwrapper>
        </div>
    </>
}
const Inner: FC = () => {
    const refresh = useXarrow()
    const {chains} = useContext(BlockchainContext)!;
    useEffect(() => {
        refresh()
    }, [chains]);
    return <BlockWithChildrenView block={chains}/>;
}