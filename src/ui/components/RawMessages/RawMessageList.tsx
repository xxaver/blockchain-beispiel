import {FC, useContext, useEffect, useRef, useState} from "react";

import {Message, RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {ArrowDown, Eye, Network, Plus} from "lucide-react";
import {NewMessage} from "./NewMessage.tsx";
import {RawMessageView} from "./RawMessageView.tsx";
import {LayoutContext} from "../../layout/LayoutContext.tsx";
import {DragOpener} from "../../layout/DragOpener.tsx";

export const RawMessageList: FC = () => {
    const layout = useContext(LayoutContext);
    const [selected, setSelected] = useState<null | true | Message>(null)
    const [all, setAll] = useState(false)
    const [autoScroll, setAutoScroll] = useState(true)
    const {messages: m} = useContext(RealtimeContext)!;
    const bottom = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLDivElement>(null);
    const [scrollable, setScrollable] = useState(false);
    const programmScroll = useRef(0);

    const messages = all ? m : m.filter(e => !(e.payload as { silent: boolean }).silent);

    useEffect(() => {
        setAutoScroll(autoscroll => {
            if (autoScroll && bottom.current) {
                bottom.current.scrollIntoView({
                    block: "end",
                    behavior: "smooth"
                });
                setScrollable(false);
                programmScroll.current++;
                setTimeout(() => programmScroll.current--, 400);
            } else setScrollable(true);
            return autoscroll;
        })
    }, [messages]);
    useEffect(() => {
        if (autoScroll) setScrollable(false)
    }, [autoScroll]);

    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Network/>
            <h1>Übertragung</h1>
            <div className="grow"></div>
            <button className={`toggle ${all ? "toggled" : ""}`} onClick={() => setAll(!all)}>
                <Eye/>
            </button>
            <DragOpener containerType="Übertragung" config={{
                type: "component",
                componentType: "Neue Nachricht",
            }}>
                <button onClick={() => !layout && setSelected(selected === true ? null : true)}>
                    <Plus/>
                </button>
            </DragOpener>
        </div>
        <div
            className={"grow relative min-h-0" + (messages.length ? "" : " text-center flex items-center justify-center text-gray-400")}>
            {!messages.length && "Keine Nachrichten empfangen"}
            <div ref={list} className="overflow-auto h-full" onScroll={() => {
                if (programmScroll.current) setAutoScroll(true);
                if (!list.current || programmScroll.current) return;
                const e = list.current;
                setAutoScroll(e.scrollTop === (e.scrollHeight - e.offsetHeight))
            }}>
                {messages.map((message) =>
                    <DragOpener containerType="Übertragung" key={m.indexOf(message)} config={{
                        type: "component",
                        componentType: "Nachricht",
                        title: message.event,
                        componentState: message
                    }}>
                        <div>
                            <div className="cursor-pointer item bg-white"
                                 onClick={() => !layout && setSelected(selected === message ? null : message)}>
                                <RawMessageView close={() => {
                                }} props={message}/>
                            </div>
                        </div>
                    </DragOpener>
                )}
                <div ref={bottom}/>
                {scrollable && !autoScroll && <div
                    className="bg-blue-600 transition cursor-pointer hover:bg-blue-800 -translate-x-1/2 absolute bottom-5 left-1/2 flex items-center p-2 text-white rounded-4xl"
                    onClick={() => {
                        setAutoScroll(true)
                        programmScroll.current++;
                        setTimeout(() => programmScroll.current--, 400);
                        bottom.current?.scrollIntoView({
                            block: "end",
                            behavior: "smooth"
                        })
                    }}>
                    <ArrowDown/>
                    Neue Nachrichten
                </div>}
            </div>
        </div>

        {selected && <div className="grow-0 shrink-0 h-96 border-t border-gray-200">
            {selected === true
                ? <NewMessage close={() => setSelected(null)}/>
                : <RawMessageView close={() => setSelected(null)} details props={selected}/>}
        </div>}
    </>
}

