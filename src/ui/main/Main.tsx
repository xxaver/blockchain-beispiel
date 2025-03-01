import {FC, Fragment, useState} from "react";
import {useParams} from "react-router";
import {Realtime} from "../handlers/Realtime/Realtime.tsx";
import {RawMessageList} from "../components/RawMessages/RawMessageList.tsx";
import {BlockchainView} from "../components/Blockchain/BlockchainView.tsx";
import {AccountList} from "../components/Accounts/AccountList.tsx";
import {Boxes, Network, UserSearch} from "lucide-react";
import {Users} from "../handlers/Users/Users.tsx";

const areas = [
    [<><Boxes/> Blockchain</>, <BlockchainView/>],
    [<><UserSearch/> Konten</>, <AccountList/>],
    [<><Network/> Übertragung</>, <RawMessageList/>]]

export const Main: FC = () => {
    const {key, url} = useParams()
    const [hidden, setHidden] = useState<number[]>([]);

    return <Realtime baseURL={url!} anonKey={key!}>
        <Users>
            <div className="flex h-screen w-screen flex-col">
                <div className="grow-0 flex items-center shrink-0 p-2 border-b border-gray-200 gap-2">
                    <h1 className="text-2xl">Blockchain-Beispiel</h1>
                    <div className="grow"></div>
                    {areas.map((e, i) => <button
                        key={i}
                        className={"flex gap-2 items-center toggle" + (hidden.includes(i) ? "" : " toggled")}
                        onClick={() => setHidden(hidden.includes(i) ? hidden.filter(a => a !== i) : [...hidden, i])}>
                        {e[0]}
                    </button>)}
                </div>
                <div className="flex grow min-h-0">
                    {areas.map((e, i) => <Fragment key={i}>
                        {!hidden.includes(i) &&
                            <div className="min-h-0 flex-1 w-96 border-l border-gray-200 flex flex-col">{e[1]}</div>}
                    </Fragment>)}
                </div>
            </div>
        </Users>
    </Realtime>
}