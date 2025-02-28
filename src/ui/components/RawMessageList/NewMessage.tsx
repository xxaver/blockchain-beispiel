import {FC, useContext, useMemo, useState} from "react";
import {RealtimeContext} from "../../handlers/RealtimeContext.tsx";
import {CircleAlert, Send} from "lucide-react";

const initial = JSON.stringify({
    event: ""
}, null, 3)

export const NewMessage: FC<{ close: () => void }> = ({close}) => {
    const {send} = useContext(RealtimeContext)!;
    const [value, setValue] = useState(initial);
    const error = useMemo(() => {
        try {
            const json = JSON.parse(value);
            if (!Object.keys(json).includes("event")) return 'Muss Feld "event" enthalten';
        } catch {
            return "Kein gültiges JSON-Objekt";
        }
    }, [value]);

    return <div className="flex flex-col h-full">
        <div className="p-2">Neue Nachricht</div>
        <div className="grow p-4">
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
                const {event} = json;
                delete json.event;
                send(event, json)
                close();
            }}>
                Senden
                <Send size={20}/>
            </button>
        </div>
    </div>;
}