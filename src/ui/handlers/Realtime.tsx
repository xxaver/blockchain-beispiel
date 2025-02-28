import {createClient} from "@supabase/supabase-js";
import {FC, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {Message, RealtimeContext} from "./RealtimeContext.tsx";

export const Realtime: FC<PropsWithChildren<{
    baseURL: string;
    anonKey: string;
}>> = ({children, baseURL, anonKey}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const client = useMemo(() => createClient(baseURL, anonKey), [baseURL, anonKey]);
    const channel = useMemo(() => client.channel("blockchain"), [client]);

    useEffect(() => {
        const subscription = channel.on("broadcast", {event: "*"}, (payload) => {
            console.log(payload)
            setMessages(messages => [...messages, payload]);
        });
        subscription.subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [channel]);

    return <RealtimeContext.Provider value={{
        messages, channel, send: (event, payload) => {
            channel.send({
                type: "broadcast",
                event,
                payload
            }).then(() => setMessages([...messages, {event, ...payload}]))
        }
    }}>
        {children}
    </RealtimeContext.Provider>
}
export const useEvent = (event: string, handler: (data: object) => void) => {
    const context = useContext(RealtimeContext);
    useEffect(() => {
        if (!context) return;
        const subscription = context.channel.on("broadcast", {event}, (payload) => {
            handler(payload)
        });
        subscription.subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [context]);
} 