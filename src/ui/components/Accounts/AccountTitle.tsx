import {CurrentCoins} from "./CurrentCoins.tsx";
import {FC} from "react";
import {ComputationalPower} from "./ComputationalPower.tsx";

import {useUsername} from "../../handlers/Users/UsersContext.tsx";

export const AccountTitle: FC<{ publicKey: string }> = ({publicKey}) => {
    const name = useUsername(publicKey);

    return <>
        <div className="text-black">{name}</div>
        <div className="grow"></div>
        <ComputationalPower publicKey={publicKey}/>
        <CurrentCoins publicKey={publicKey}/>
    </>
}