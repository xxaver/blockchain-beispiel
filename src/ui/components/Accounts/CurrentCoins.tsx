import {FC} from "react";
import {Bitcoin} from "lucide-react";

export const CurrentCoins: FC<{
    publicKey?: string;
    coins?: number
}> = ({coins}) => {
    const number = coins || 0;

    return <div className="bg-yellow-300 text-yellow-700 flex items-center rounded-xl px-2 py-1">
        <span className="mr-2">{number}</span>
        <Bitcoin/>
        <span>DK</span>
    </div>
}