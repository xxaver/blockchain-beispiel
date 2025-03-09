import {FC, RefObject, useContext, useEffect, useReducer, useRef, useState} from "react";
import {ArrowRight, Boxes, Link, MinusCircle, PlusCircle, Send, ShieldCheck} from "lucide-react";
import {BlockWithChildrenView} from "./BlockWithChildrenView.tsx";
import {useXarrow, Xwrapper} from "react-xarrows";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";
import {TransformComponent, TransformWrapper, useControls, useTransformEffect} from "react-zoom-pan-pinch";

export const BlockchainView: FC = () => {
    const {
        selectedBlock,
        setSelectedBlock,
        strict,
        setStrict,
        currentChain,
        withholdBlocks,
        setWithholdBlocks,
        withheldBlocks
    } = useContext(BlockchainContext)!;
    const [autoScroll, setAutoScroll] = useState(true)
    const [scrollable, setScrollable] = useState(false);
    const selected = useRef<HTMLDivElement>(null);
    const programmScroll = useRef(0);
    const [_, reload] = useReducer(a => a + 1, 0);

    useEffect(() => {
        if (autoScroll) setScrollable(false)
    }, [autoScroll]);

    const last = currentChain.at(-1);
    useEffect(() => {
        setAutoScroll(autoscroll => {
            if (autoScroll && selected.current) {
                scroll()
                setScrollable(false);
                programmScroll.current++;
                setTimeout(() => programmScroll.current--, 300);
            } else setScrollable(true);
            return autoscroll;
        })
    }, [last]);

    const ref = useRef<HTMLDivElement>(null);
    const updateScroll = () => {
        reload();
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
        } else if (programmScroll.current === 0) setAutoScroll(false);
    }
    const scroll = () => {
        selected.current?.scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "smooth"
        });
        const interval = setInterval(reload, 10);
        programmScroll.current++;
        setTimeout(() => {
            programmScroll.current--;
            clearInterval(interval)
        }, 1000)
    }

    return <TransformWrapper
        onPanning={updateScroll}
        limitToBounds={false}
        maxScale={3}
        minScale={.1}
        alignmentAnimation={{
            disabled: true
        }}>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Boxes/>
            <h1>Blockchain</h1>
            <div className="h-[34px]"></div>
            <div className="grow"></div>
            <Controls scroll={() => autoScroll && scroll()}/>
            <button
                className={`flex items-center gap-2 toggle ${!withholdBlocks ? "toggled" : "untoggled"}`}
                onClick={() => setWithholdBlocks(!withholdBlocks)}
            >
                <Send/>
                {withholdBlocks ? <>
                    Senden
                    <div className="circle">{withheldBlocks.length}</div>
                </> : "Auto"}
            </button>
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
                className="bg-blue-600 z-[31] transition cursor-pointer hover:bg-blue-800 -translate-y-1/2 absolute right-5 top-1/2 flex items-center p-2 text-white rounded-4xl"
                onClick={() => {
                    setAutoScroll(true);
                    scroll();
                }}>
                <ArrowRight/>
                Neue Blöcke
            </div>}
            <div className="w-full h-full relative" ref={ref} onScroll={updateScroll}
            >
                <Xwrapper>
                    <TransformComponent>
                        <Inner reload={_} selected={selected}/>
                    </TransformComponent>
                </Xwrapper>
            </div>
        </div>
    </TransformWrapper>
}
const Controls: FC<{ scroll: () => void }> = ({scroll}) => {
    const {zoomIn, zoomOut, resetTransform} = useControls();
    const [zoom, setZoom] = useState(1);
    useTransformEffect(({state}) => setZoom(state.scale))

    return (
        <>
            <button onClick={() => zoomOut()}><MinusCircle/></button>
            <button onClick={() => {
                resetTransform();
                setTimeout(scroll, 400);
            }}>{Math.round(zoom * 100)}%
            </button>
            <button onClick={() => zoomIn()}><PlusCircle/></button>
            <div className="w-5"></div>
        </>
    );
}
const Inner: FC<{ selected: RefObject<HTMLDivElement>; reload: number }> = ({selected, reload}) => {
    const refresh = useXarrow()
    const {chains} = useContext(BlockchainContext)!;
    useTransformEffect(refresh);
    useEffect(() => {
        refresh()
    }, [reload]);
    return <BlockWithChildrenView block={chains} selected={selected}/>;
}