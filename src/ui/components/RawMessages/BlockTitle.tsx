import {FC} from "react";
import {useUsername} from "../../handlers/Users/UsersContext.tsx";
import {Block} from "../../../blockchain/Block.ts";

export const BlockTitle: FC<{ message: object }> = ({message}) => {
    const m = message as Block;
    const name = useUsername(m.mined?.publicKey || "");

    return <>
        <span>
            #{m.id} von {name}
        </span>
    </>
}