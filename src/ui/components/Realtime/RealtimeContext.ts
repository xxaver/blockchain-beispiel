import {createContext} from "react";
import {RealtimeChannel} from "@supabase/supabase-js";

export const RealtimeContext = createContext<{
    messages: Message[];
    send: (event: string, value: object) => void,
    channel: RealtimeChannel;
} | null>(null);
export type Message = object & {
    outgoing?: boolean;
    timestamp: number;
    event: string;
}