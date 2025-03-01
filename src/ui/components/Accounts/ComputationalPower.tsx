import {FC, useContext} from "react";
import {Pickaxe} from "lucide-react";
import {UsersContext, useUser} from "../../handlers/Users/UsersContext.tsx";

export const ComputationalPower: FC<{
    publicKey: string;
}> = ({publicKey}) => {
    const {knownUsers} = useContext(UsersContext)!;
    const user = useUser(publicKey);
    if (!user || !user.computationalPower) return null;
    const totalPower = knownUsers.reduce((acc, cur) => acc + cur.computationalPower, 0);

    return <div className="bg-blue-200 text-blue-600 flex items-center rounded-4xl gap-2 p-2">
        <Pickaxe/>
        <span>{Math.round((user.computationalPower / totalPower) * 100)}%</span>
    </div>
};