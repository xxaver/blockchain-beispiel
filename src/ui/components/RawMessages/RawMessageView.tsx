import {FC, ReactNode} from "react";
import {ArrowUpRight, Box, Coins, ShieldX} from "lucide-react";
import {Message} from "../../handlers/Realtime/RealtimeContext.ts";
import {wholeJson} from "./util.ts";

const knownEvents: {
    [key: string]: {
        color: string;
        title: (value: object) => ReactNode,
        error: (value: object) => string | null,
        icon: ReactNode
    };
} = {
    transaction: {
        color: "text-yellow-800 bg-yellow-600/20",
        title: () => "Transaktion",
        error: () => null,
        icon: <Coins/>
    },
    block: {
        color: "text-blue-600 bg-blue-600/20",
        title: () => "Block",
        error: () => null,
        icon: <Box/>
    }
}
export const RawMessageView: FC<{ message: Message; details?: boolean }> = ({details, message}) => {
    const {event, payload} = message;
    
    let title: ReactNode = "", error: null | string, icon = <ShieldX/> as ReactNode,
        color = "text-red-600 bg-red-600/20";
    const e = knownEvents[event];
    if (e) {
        error = e.error(message);
        icon = e.icon;
        if (!error) {
            title = e.title(message);
            color = e.color;
        }
    } else {
        error = "Fehlerhafte Nachricht";
    }
    const json = wholeJson(payload);

    return details ? <div className="flex flex-col h-full">
        <div className={`flex items-center p-2 gap-2 ${color}`}>
            {icon}
            {title || event}
        </div>
        <div className="grow p-4">
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
        {error && <div className="flex items-center p-2 gap-2 text-red-600 bg-red-600/20">
            <ShieldX/>
            {error}
        </div>}
    </div> : <div className={`flex items-center p-2 gap-2 ${color}`}>
        {icon}
        {title || event}
        <div className="grow"/>
        {message.outgoing && <ArrowUpRight size={25}/>}
    </div>
}