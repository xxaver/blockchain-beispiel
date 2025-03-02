import {FC, ReactNode} from "react";
import {Box, Coins, Search, UserRoundPlus} from "lucide-react";
import {TransactionItem} from "./TransactionItem.tsx";
import {BlockTitle} from "./BlockTitle.tsx";

export const KnownEvents: {
    [key: string]: {
        color?: string;
        title?: FC<{ message: object }>,
        icon: ReactNode
    };
} = {
    transaction: {
        color: "text-yellow-800 bg-yellow-600/20",
        title: TransactionItem,
        icon: <Coins/>
    },
    block: {
        color: "text-blue-600 bg-blue-600/20",
        title: BlockTitle,
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