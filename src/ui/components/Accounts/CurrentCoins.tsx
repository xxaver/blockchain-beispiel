import {FC} from "react";
import {Coins} from "lucide-react";

export const CurrentCoins: FC<{
    publicKey: string;
}> = () => {
    const number = 0;
    
    return <div className="bg-yellow-200 text-yellow-700 flex items-center rounded-4xl gap-2 p-2">
        <Coins />
        <span>{number}</span>
    </div>
}