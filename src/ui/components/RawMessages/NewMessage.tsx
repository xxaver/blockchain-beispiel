import {FC, useContext, useMemo, useRef, useState} from "react";
import {RealtimeContext} from "../../handlers/Realtime/RealtimeContext.ts";
import {CircleAlert, Send} from "lucide-react";
import {SuggestionInput} from "../SuggestionInput.tsx";
import {knownEvents} from "../../handlers/Realtime/events.ts";

export const NewMessage: FC<{ close: () => void }> = ({close}) => {
    const {send} = useContext(RealtimeContext)!;
    const event = useRef("")
    const [value, setValue] = useState("{}");
    const error = useMemo(() => {
        try {
            JSON.parse(value);
        } catch {
            return "Kein gültiges JSON-Objekt";
        }
    }, [value]);

    return <div className="flex flex-col h-full">
        <div className="p-2">Neue Nachricht</div>
        <div className="grow p-4 flex flex-col items-stretch gap-3">
            <SuggestionInput ref={event} suggestions={Object.keys(knownEvents).map(e => ({
                element: e,
                searchable: [e]
            }))} placeholder="Event" className="w-full" />
        <textarea
            onChange={e => setValue(e.target.value)}
            onBlur={() => {
                if (!error) setValue(JSON.stringify(JSON.parse(value), null, 3))
            }}
            className="resize-none h-full w-full rounded-lg p-2 bg-gray-100 font-mono"
            value={value}/>
        </div>
        <div className="p-2 flex items-center">
            <div className="grow text-red-600 gap-2 items-center flex">
                {error && <>
                    <CircleAlert/>
                    {error}
                </>}
            </div>
            <button disabled={!!error} className="flex items-center gap-2 primary" onClick={() => {
                const json = JSON.parse(value);
                send(event.current, json)
                close();
            }}>
                Senden
                <Send size={20}/>
            </button>
        </div>
    </div>;
}