import {FC, PropsWithChildren, ReactNode, useState} from "react";
import {ChevronRight} from "lucide-react";

export const Accordeon: FC<PropsWithChildren<{ title: ReactNode }>> = ({title, children}) => {
    const [open, setOpen] = useState(false);
    
    return <>
        <div className="item bg-white p-2 flex cursor-pointer items-center gap-2" onClick={() => setOpen(!open)}>
            <ChevronRight className={`transition ${open ? "rotate-90" : ""}`} />
            {title}
        </div>
        {open && <div className="p-2 flex flex-col">{children}</div>}
    </>
}