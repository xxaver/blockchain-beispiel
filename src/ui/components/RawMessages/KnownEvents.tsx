import {ReactNode} from "react";
import {Box, Coins, Search, UserRoundPlus} from "lucide-react";

export const KnownEvents: {
    [key: string]: {
        color?: string;
        title?: (value: object) => ReactNode,
        error?: (value: object) => string | null,
        icon: ReactNode
    };
} = {
    transaction: {
        color: "text-yellow-800 bg-yellow-600/20",
        title: () => "Transaktion",
        error: () => null,
        icon: <Coins/>
    },
    block: {
        color: "text-blue-600 bg-blue-600/20",
        title: () => "Block",
        error: () => null,
        icon: <Box/>
    },
    discover: {
        icon: <Search/>
    },
    join: {
        icon: <UserRoundPlus/>
    }
}