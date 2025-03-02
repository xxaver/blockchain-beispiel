import {FC, HTMLProps, MutableRefObject, ReactNode, useEffect, useRef, useState} from "react";

export const SuggestionInput: FC<Omit<HTMLProps<HTMLInputElement>, "ref"> & {
    ref: MutableRefObject<string>;
    suggestions: ({
        element: ReactNode;
        searchable: string[];
    })[]
}> = ({ref, suggestions, ...props}) => {
    const [value, setValue] = useState("")
    const [shown, setShown] = useState(false)
    const matching = suggestions.filter(s => s.searchable.some(e => e.includes(value)))
    useEffect(() => {
        ref.current = value;
    }, [value, ref]);
    
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: Event) => {
            if(!wrapperRef.current) return;
            if(!wrapperRef.current.contains(e.target as Node)) setShown(false);
        }
        document.addEventListener("click", handler)
        return () => document.removeEventListener("click", handler)
    }, []);
    
    return <div className="relative w-full" ref={wrapperRef}>
        <input {...props} type="text"
               value={value} onChange={e => setValue(e.target.value)}
               onFocus={() => setShown(true)}
        />
        {!!matching.length && shown && <div className="w-full cursor-pointer absolute border-1 border-gray-400 rounded-md shadow-md">
            {matching.map(e => <div className="item p-2 bg-white" onClick={() => {
                setValue(e.searchable[0])
                setShown(false)
            }}>
                {e.element}
            </div>)}
        </div>}
    </div>
}