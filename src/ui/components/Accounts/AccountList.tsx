import {FC} from "react";
import {Coins} from "lucide-react";

export const AccountList: FC = () => {
    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Coins />
            <h1>Kontostände</h1>
        </div>
        <div
            className="grow relative min-h-0">
        </div>
    </>
}