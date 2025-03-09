import {FC, PropsWithChildren, ReactNode, useState} from "react";
import {ChevronRight} from "lucide-react";

export const Accordeon: FC<PropsWithChildren<{ title: ReactNode; open?: boolean; noPadding?: boolean }>> = ({
                                                                                                                title,
                                                                                                                children,
                                                                                                                open: initial,
                                                                                                                noPadding
                                                                                                            }) => {
    const [open, setOpen] = useState(initial);

    return <>
        <div className="item bg-white p-2 flex cursor-pointer items-center gap-1 select-none"
             onClick={() => setOpen(!open)}>
            <ChevronRight className={`transition ${open ? "rotate-90" : ""}`}/>
            {title}
        </div>
        {open && <div className={`${noPadding ? "" : "p-2"} flex flex-col`}>{children}</div>}
    </>
}