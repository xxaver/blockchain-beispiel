import {FC} from "react";
import {Boxes} from "lucide-react";

export const BlockchainView: FC = () => {
    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Boxes/>
            <h1>Blockchain</h1>
            <div className="h-[34px]"></div>
        </div>
        <div
            className="grow relative min-h-0">
        </div>
    </>
}