import {FC, PropsWithChildren} from "react";
import {ShieldX} from "lucide-react";

export const Error: FC<PropsWithChildren> = ({children}) => {
    return <div className="text-red-600 bg-red-600/20 flex items-center gap-2 p-2">
        <ShieldX />
        {children}
    </div>
}