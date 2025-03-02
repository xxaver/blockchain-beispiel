import {createContext, useContext, useEffect, useRef} from "react";
import {RealtimeChannel} from "@supabase/supabase-js";

export type Handler<T> = (payload: T) => void;
export const RealtimeContext = createContext<{
    messages: Message[];
    send: (event: string, payload?: object) => void,
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
            if (event === message.event && (!message.outgoing || allowOutgoing)) handler(message.payload as never);
        }
        handled.current = context.messages.length;
    }, [context, handler]);

}