import {createClient} from "@supabase/supabase-js";
import {FC, PropsWithChildren, useEffect, useMemo, useRef, useState} from "react";
import {Handler, Message, RealtimeContext} from "./RealtimeContext.ts";

export const Realtime: FC<PropsWithChildren<{
    baseURL: string;
    anonKey: string;
}>> = ({children, baseURL, anonKey}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const client = useMemo(() => createClient(baseURL, anonKey), [baseURL, anonKey]);
    const channel = useMemo(() => client.channel("blockchain"), [client]);
    const subscriptions = useRef<{
        event: string;
        handler: Handler<never>
    }[]>([]);

    const send = (event: string, payload?: object) => {
        payload = payload || {};
        channel.send({
            type: "broadcast",
            event,
            payload: payload
        }).then(() => setMessages(messages => [...messages, {event, payload, outgoing: true, timestamp: Date.now()}]))
    }

    useEffect(() => {
        const subscription = channel.on("broadcast", {event: "*"}, ({payload, event}) => {
            setMessages(messages => [...messages, {payload, event, timestamp: Date.now()}]);
            subscriptions.current.forEach(({event, handler}) => {
                if (event === event) handler(payload as never)
            })
        });
        subscription.subscribe(() => send("discover"))
        return () => {
            subscription.unsubscribe()
        }
    }, [channel]);

    return <RealtimeContext.Provider value={{
        messages,
        channel,
        send,
        subscribe: (event, handler) => subscriptions.current.push({event, handler}),
        unsubscribe: (event, handler) => {
            subscriptions.current = subscriptions.current.filter(e => e.event !== event || e.handler !== handler)
        }
    }
    }>
        {children}
    </RealtimeContext.Provider>
}
