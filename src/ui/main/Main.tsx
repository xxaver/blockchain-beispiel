import {FC} from "react";
import {useParams} from "react-router";
import {Realtime} from "../handlers/Realtime.tsx";
import {RawMessageList} from "../components/RawMessageView.tsx";
import {RealtimeTest} from "../RealtimeTest.tsx";

export const Main: FC = () => {
    const {key, url} = useParams()


    return <Realtime baseURL={url!} anonKey={key!}>
        <div className="flex h-screen w-screen flex-col">
            <div className="grow-0 shrink-0 p-2 border-b border-gray-200">
                <h1 className="font-bold text-2xl">Blockchain</h1>
            </div>
            <div className="flex grow min-h-0">
                <div className="grow">
                    <RealtimeTest/>
                </div>
                <RawMessageList/>
            </div>
        </div>
    </Realtime>
}