import {FC, ReactNode} from "react";
import {ArrowUpRight, ShieldX} from "lucide-react";
import {Message} from "../../handlers/Realtime/RealtimeContext.ts";
import {wholeJson} from "../../util.ts";
import {KnownEvents} from "./KnownEvents.tsx";
import {Error} from "./Error.tsx";

export const RawMessageView: FC<{ message: Message; details?: boolean }> = ({details, message}) => {
    const {event, payload} = message;
    
    const e = KnownEvents[event];
    const Title = e ? e.title || (() => event) : (() => event);
    const color = e ? (e.color || ""): "text-red-600 bg-red-600/20"
    const icon = e ? e.icon : <ShieldX/> as ReactNode;
        
    const json = wholeJson(payload);

    return details ? <div className="flex flex-col h-full">
        <div className={`flex items-center p-2 gap-2 ${color}`}>
            {icon}
            <Title message={message.payload} />
            <ArrowUpRight size={25} className={message.outgoing ? "" : "opacity-0"}/>
        </div>
        <div className="p-4">{message.event}</div>
        <div className="grow px-4">
            <textarea
                readOnly
                className="resize-none h-full w-full font-mono"
                value={JSON.stringify(json, null, 3)}/>
        </div>
        <div className="p-2 text-right">
            {new Date(message.timestamp).toLocaleString('de-DE', {timeZone: 'Europe/Berlin'})}
            {message.outgoing &&
                <div className="flex items-center gap-2">
                    <div className="grow"></div>
                    Ausgehende Nachricht
                    <ArrowUpRight size={25}/>
                </div>
            }
        </div>
            {!e && <Error>Ungültiges Ereignis</Error>}
        </div>
   : <div className={`flex items-center p-2 gap-2 ${color}`}>
        {icon}
        <Title message={message.payload} />
        <div className="grow"/>
        <ArrowUpRight size={25} className={message.outgoing ? "" : "opacity-0"}/>
    </div>
}