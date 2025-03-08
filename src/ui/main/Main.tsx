import {FC, useEffect} from "react";
import {useParams} from "react-router";
import {Realtime} from "../handlers/Realtime/Realtime.tsx";
import {Users} from "../handlers/Users/Users.tsx";
import {Blockchain} from "../handlers/Blockchain/Blockchain.tsx";
import {Mempool} from "../handlers/Mempool/Mempool.tsx";
import {Layout} from "../layout/Layout.tsx";

export const Main: FC = () => {
    const {key, url, channel} = useParams()
    useEffect(() => {
        localStorage.setItem("default", JSON.stringify({key, url, channel}));
    }, [key, url]);

    return <Realtime channelName={channel!} baseURL={url!} anonKey={key!}>
        <Blockchain>
            <Mempool>
                <Users>
                    <Layout/>
                </Users>
            </Mempool>
        </Blockchain>
    </Realtime>
}