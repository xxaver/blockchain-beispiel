import {FC, PropsWithChildren, useState} from "react";
import {BlockchainContext} from "./BlockchainContext.ts";

export const Blockchain: FC<PropsWithChildren> = ({children}) => {
    const [selectedBlock, setSelectedBlock] = useState<null | string>(null);

    return <BlockchainContext.Provider
        value={{selectedBlock, setSelectedBlock}}
    >
        {children}
    </BlockchainContext.Provider>
}