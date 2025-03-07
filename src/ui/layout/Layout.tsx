import {FC, Fragment, MutableRefObject, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {GoldenLayout, LayoutConfig} from "golden-layout";
import {BlockchainView} from "../components/Blockchain/BlockchainView.tsx";
import {createPortal} from "react-dom";
import "golden-layout/dist/css/goldenlayout-base.css";
import "golden-layout/dist/css/themes/goldenlayout-light-theme.css";
import {MempoolView} from "../components/Mempool/MempoolView.tsx";
import {AccountList} from "../components/Accounts/AccountList.tsx";
import {RawMessageList} from "../components/RawMessages/RawMessageList.tsx";
import {ArrowLeftRight, Boxes, Network, UserSearch} from "lucide-react";
import {LayoutContext} from "./LayoutContext.tsx";
import {DragOpener} from "./DragOpener.tsx";


const knownComponents = {
    Blockchain: BlockchainView,
    Mempool: MempoolView,
    Konten: AccountList,
    "Übertragung": RawMessageList
};
const areas: [ReactNode, string][] = [
    [<><Boxes/> Blockchain</>, "Blockchain"],
    [<><ArrowLeftRight/> Mempool</>, "Mempool"],
    [<><UserSearch/> Konten</>, "Konten"],
    [<><Network/> Übertragung</>, "Übertragung"]]

export const Layout = () => {
    const layoutRef = useRef<HTMLDivElement>(null);
    const glInstance = useRef<GoldenLayout>(null) as MutableRefObject<GoldenLayout>;


    const [components, setComponents] = useState<Record<number, ReactNode>>({})
    const [_, setId] = useState(0)

    useEffect(() => {
        if (!layoutRef.current) return;
        const config: LayoutConfig = {
            header: {
                popout: false,
            },
            root: {
                type: 'row',
                content: [{
                    type: 'component',
                    componentType: 'Blockchain',
                    size: "60%",
                }, {
                    type: 'component',
                    componentType: 'Konten',

                }, {
                    type: 'stack',
                    content: [
                        {
                            type: 'component',
                            componentType: 'Mempool',

                        },
                        {
                            type: 'component',
                            componentType: 'Übertragung',
                        }
                    ]
                }]
            }
        };

        glInstance.current = new GoldenLayout(layoutRef.current);

        Object.keys(knownComponents).forEach(key => {
            const Component = knownComponents[key as keyof typeof knownComponents];
            glInstance.current.registerComponentFactoryFunction(key, (container, state) => {
                setId(id => {
                    const div = document.createElement("div");
                    div.id = `layout-${id}`;
                    div.className = "bg-white h-full w-full flex flex-col" + (key !== "Blockchain" ? " z-[30] absolute" : "");
                    container.element.appendChild(div);

                    setComponents((prev) => ({
                        ...prev,
                        [id]: <Component state={state}/>,
                    }));

                    container.on("destroy", () => {
                        setComponents((prev) => {
                            const updated = {...prev};
                            delete updated[id];
                            return updated;
                        });
                    });
                    return id + 1;
                })
            });
        })

        glInstance.current.loadLayout(config)

        const resize = () => {
            const {width, height} = layoutRef.current!.getBoundingClientRect();
            glInstance.current.setSize(width, height)
        }
        window.addEventListener("resize", resize)

        return () => {
            window.removeEventListener("resize", resize)
            glInstance.current?.destroy();
        };
    }, []);

    return <LayoutContext.Provider value={{gl: glInstance.current}}>
        <div className="flex h-screen w-screen flex-col">
            <div className="grow-0 flex items-center shrink-0 p-2 border-b border-gray-200 gap-2">
                <h1 className="text-2xl">Blockchain-Beispiel</h1>
                <div className="grow"></div>
                {areas.map((e, i) => <DragOpener key={i} config={{
                    type: "component",
                    componentType: e[1]
                }}>
                    <button
                        className="flex gap-2 items-center toggle"
                        onClick={() => {
                            glInstance.current?.addComponent(e[1]);
                        }}>
                        {e[0]}
                    </button>
                </DragOpener>)}
            </div>
            <div className="flex grow min-h-0">
                <div ref={layoutRef} className="h-full w-full"/>
                {Object.keys(components).map(e => createPortal(components[e], document.querySelector(`#layout-${e}`)!))}
            </div>
        </div>
    </LayoutContext.Provider>;
};