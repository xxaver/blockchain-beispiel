import {createContext, useContext, useEffect} from "react";
import {RealtimeChannel} from "@supabase/supabase-js";

export type Handler<T> = (payload: T) => void;
export const RealtimeContext = createContext<{
    messages: Message[];
    send: (event: string, payload?: object) => void,
    channel: RealtimeChannel;
    subscribe: <T extends object>(event: string, handler: Handler<T>) => void,
    unsubscribe: <T extends object>(event: string, handler: Handler<T>) => void,
} | null>(null);
export type Message = object & {
    outgoing?: boolean;
    timestamp: number;
    event: string;
}
export const useEvent = <T extends object>(event: string, handler: Handler<T>) => {
    const context = useContext(RealtimeContext);
    useEffect(() => {
        if (!context) return;
        context.subscribe(event, handler)
        return () => {
            context.unsubscribe(event, handler)
        }
    }, [context]);
}