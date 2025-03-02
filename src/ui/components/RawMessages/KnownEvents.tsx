import {FC, ReactNode} from "react";
import {Box, Coins, Search, UserRoundPlus} from "lucide-react";
import {TransactionError, TransactionItem} from "./TransactionItem.tsx";

export const KnownEvents: {
    [key: string]: {
        color?: string;
        title?: FC<{message: object}>,
        error?: FC<{message: object}>,
        icon: ReactNode
    };
} = {
    transaction: {
        color: "text-yellow-800 bg-yellow-600/20",
        title: TransactionItem,
        error: TransactionError,
        icon: <Coins/>
    },
    block: {
        color: "text-blue-600 bg-blue-600/20",
        title: () => "Block",
        error: () => null,
        icon: <Box/>
    },
    discover: {
        color: "text-green-600 bg-green-600/20",
        icon: <Search/>
    },
    join: {
        icon: <UserRoundPlus/>
    }
}