import {FC} from "react";
import {Coins, Plus} from "lucide-react";

export const AccountList: FC = () => {
    return <>
        <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <Coins />
            <h1>Konten</h1>
            <div className="grow"></div>
            <button>
                <Plus/>
            </button>
        </div>
        <div
            className="grow relative min-h-0">
            <h2 className="p-2">Deine Konten</h2>
            <h2 className="p-2">Andere Konten</h2>
        </div>
    </>
}