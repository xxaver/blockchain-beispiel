import {FC, MutableRefObject, RefObject, useContext, useEffect, useRef, useState} from "react";
import {ArrowRight, Boxes, Link, ShieldCheck} from "lucide-react";
import {BlockWithChildrenView} from "./BlockWithChildrenView.tsx";
import {useXarrow, Xwrapper} from "react-xarrows";
import {useDraggable} from "react-use-draggable-scroll";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";

export const BlockchainView: FC = () => {
    const {selectedBlock, setSelectedBlock, strict, setStrict, currentChain} = useContext(BlockchainContext)!;
    const [autoScroll, setAutoScroll] = useState(true)
    const [scrollable, setScrollable] = useState(false);
    const selected = useRef<HTMLDivElement>(null);
    const programmScroll = useRef(0);
    
    useEffect(() => {
        if (autoScroll) setScrollable(false)
    }, [autoScroll]);
    
    const last = currentChain.at(-1);
    useEffect(() => {
        setAutoScroll(autoscroll => {
            if (autoScroll && selected.current) {
                selected.current.scrollIntoView({
                    block: "center",
                    inline: "center",
                    behavior: "smooth"
                });
                setScrollable(false);
                programmScroll.current++;
                setTimeout(() => programmScroll.current--, 300);
            } else setScrollable(true);
            return autoscroll;
        })
    }, [last]);

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
            className="grow relative min-h-0 flex items-stretch justify-stretch"
        >
            {scrollable && <div
                style={{writingMode: "vertical-rl"}}
                className="bg-blue-600 z-[1000] transition cursor-pointer hover:bg-blue-800 -translate-y-1/2 absolute right-5 top-1/2 flex items-center p-2 text-white rounded-4xl"
                onClick={() => selected.current?.scrollIntoView({
                    block: "center",
                    inline: "center",
                    behavior: "smooth"
                })}>
                <ArrowRight/>
                Neue Blöcke
            </div>}
            <div className="min-h-0 min-w-0 overflow-auto relative" ref={ref} onScroll={() => {
                if (!ref.current || !selected.current) return;

                const elementRect = selected.current.getBoundingClientRect();
                const containerRect = ref.current.getBoundingClientRect();

                if (
                    elementRect.top >= containerRect.top &&
                    elementRect.bottom <= containerRect.bottom &&
                    elementRect.left >= containerRect.left &&
                    elementRect.right <= containerRect.right
                ) {
                    setScrollable(false);
                    setAutoScroll(true)
                }
                else if(programmScroll.current === 0) setAutoScroll(false);
            }}
                 {...events}>
                <Xwrapper>
                    <Inner selected={selected}/>
                </Xwrapper>
            </div>
        </div>
    </>
}
const Inner: FC<{ selected: RefObject<HTMLDivElement> }> = ({selected}) => {
    const refresh = useXarrow()
    const {chains} = useContext(BlockchainContext)!;
    useEffect(() => {
        refresh()
    }, [chains]);
    return <BlockWithChildrenView block={chains} selected={selected}/>;
}