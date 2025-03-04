import {createContext, useContext, useEffect, useRef} from "react";
import {RealtimeChannel} from "@supabase/supabase-js";
import {wholeJson} from "../../util.ts";
import {knownEvents} from "./events.ts";

export type Handler<T> = (payload: T) => void;
export const RealtimeContext = createContext<{
    messages: Message[];
    send: (event: string, payload?: object, silent?:boolean) => void,
    channel: RealtimeChannel;
    subscribe: <T extends object>(event: string, handler: Handler<T>) => void,
    unsubscribe: <T extends object>(event: string, handler: Handler<T>) => void,
} | null>(null);
export type Message = {
    outgoing?: boolean;
    timestamp: number;
    event: string;
    payload: object;
}
export const useEvent = <T extends object>(event: string, handler: Handler<T>, allowOutgoing = false) => {
    const context = useContext(RealtimeContext);
    const handled = useRef(0);

    useEffect(() => {
        if (!context) return;
        for (let i = handled.current; i < context.messages.length; i++) {
            const message = context.messages[i];
            if(message.outgoing && !allowOutgoing) continue
            
            if(knownEvents[event]) {
                const asJson = wholeJson(message.payload);
                const result = knownEvents[event].safeParse(asJson);
                if(!result.success) continue;
            }
            if (event === message.event) handler(message.payload as never);
            if (event === "multiple " + message.event) (message.payload as {items: T[]}).items.forEach(handler);
        }
        handled.current = context.messages.length;
    }, [context, handler]);

}