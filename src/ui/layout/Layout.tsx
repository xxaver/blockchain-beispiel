import {MutableRefObject, ReactNode, useEffect, useRef, useState} from "react";
import {GoldenLayout, LayoutConfig} from "golden-layout";
import {BlockchainView} from "../components/Blockchain/BlockchainView.tsx";
import {createPortal} from "react-dom";
import "golden-layout/dist/css/goldenlayout-base.css";
import "golden-layout/dist/css/themes/goldenlayout-light-theme.css";
import {MempoolView} from "../components/Mempool/MempoolView.tsx";
import {AccountList} from "../components/Accounts/AccountList.tsx";
import {RawMessageList} from "../components/RawMessages/RawMessageList.tsx";

const knownComponents = {
    Blockchain: BlockchainView,
    Mempool: MempoolView,
    Konten: AccountList,
    "Übertragung": RawMessageList
};

export const Layout = () => {
    const layoutRef = useRef<HTMLDivElement>(null);
    const glInstance = useRef<GoldenLayout>(null) as MutableRefObject<GoldenLayout>;


    const [components, setComponents] = useState<Record<number, ReactNode>>({})
    const [_, setId] = useState(0)

    useEffect(() => {
        if (!layoutRef.current) return;
        const config: LayoutConfig = {
            root: {
                type: 'row',
                content: [{
                    type: 'component',
                    componentType: 'Blockchain',
                    size: "60%",
                    isClosable: false,
                }, {
                    type: 'component',
                    componentType: 'Konten',
                    isClosable: false

                }, {
                    type: 'stack',
                    isClosable: false,
                    content: [
                        {
                            type: 'component',
                            componentType: 'Mempool',
                            isClosable: false

                        },
                        {
                            type: 'component',
                            componentType: 'Übertragung',
                            isClosable: false
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
                    div.className = "bg-white h-full w-full flex flex-col";
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

        return () => {
            glInstance.current?.destroy();
        };
    }, []);

    return <>
        <div ref={layoutRef} className="h-full w-full"/>
        {Object.keys(components).map(e => createPortal(components[e], document.querySelector(`#layout-${e}`)!))}
    </>;
};