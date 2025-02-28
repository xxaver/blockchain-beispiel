import {FC, useContext, useEffect, useRef, useState} from "react";

import {Message, RealtimeContext} from "../../handlers/RealtimeContext.tsx";
import {ArrowDown, Plus} from "lucide-react";
import {NewMessage} from "./NewMessage.tsx";
import {RawMessageView} from "./RawMessageView.tsx";

export const RawMessageList: FC = () => {
    const [selected, setSelected] = useState<null | true | Message>(null)
    const [autoScroll, setAutoScroll] = useState(true)
    const {messages} = useContext(RealtimeContext)!;
    const bottom = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLDivElement>(null);
    const [scroll, setScroll] = useState(false);
    const programmScroll = useRef(0);

    useEffect(() => {
        setAutoScroll(autoscroll => {
            if (autoScroll && bottom.current) {
                bottom.current.scrollIntoView({
                    block: "end",
                    behavior: "smooth"
                });
                setScroll(false);
                programmScroll.current++;
                setTimeout(() => programmScroll.current--, 300);
            } else setScroll(true);
            return autoscroll;
        })
    }, [messages]);
    useEffect(() => {
        if (autoScroll) setScroll(false)
    }, [autoScroll]);

    return <div className="min-h-0 grow-0 shrink-0 w-96 border-l border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex items-center">
            <h1>Nachrichten</h1>
            <div className="grow"></div>
            <button onClick={() => setSelected(selected === true ? null : true)}>
                <Plus/>
            </button>
        </div>
        <div className={"grow relative min-h-0" + (messages.length ? "" : " text-center flex items-center justify-center text-gray-400")}>
            {!messages.length && "Keine Nachrichten empfangen"}
            <div ref={list} className="overflow-auto h-full" onScroll={() => {
                console.log(programmScroll.current)
                if (!list.current || programmScroll.current) return;
                const e = list.current;
                setAutoScroll(e.scrollTop === (e.scrollHeight - e.offsetHeight))
            }}>
                {messages.map((message, i) =>
                    <div key={i} className="cursor-pointer"
                         onClick={() => setSelected(selected === message ? null : message)}>
                        <RawMessageView message={message}/>
                    </div>
                )}
                <div ref={bottom}/>
                {scroll && <div
                    className="bg-blue-600 transition cursor-pointer hover:bg-blue-800 -translate-x-1/2 absolute bottom-5 left-1/2 flex items-center p-2 text-white rounded-4xl"
                    onClick={() => bottom.current?.scrollIntoView({
                        block: "end",
                        behavior: "smooth"
                    })}>
                    <ArrowDown/>
                    Neue Nachrichten
                </div>}
            </div>
        </div>

        {selected && <div className="grow-0 shrink-0 h-96 border-t border-gray-200">
            {selected === true
                ? <NewMessage close={() => setSelected(null)}/>
                : <RawMessageView details message={selected}/>}
        </div>}
    </div>
}

