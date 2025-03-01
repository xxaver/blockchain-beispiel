import {CurrentCoins} from "./CurrentCoins.tsx";
import {FC} from "react";
import {ComputationalPower} from "./ComputationalPower.tsx";

import {useUser} from "../../handlers/Users/UsersContext.tsx";

export const AccountTitle: FC<{ publicKey: string }> = ({publicKey}) => {
    const user = useUser(publicKey);
    if (!user) return null;

    return <>
        <div className="cursor-pointer">
            <div>{user.name}</div>
        </div>
        <div className="grow"></div>
        <ComputationalPower publicKey={user.publicKey}/>
        <CurrentCoins publicKey={user.publicKey}/>
    </>
}