import {FC, useEffect, useState} from "react";
import {Create} from "./Create.tsx";
import {Navigate} from "react-router";

export const Start: FC = () => {
    const [defaultConfig, setDefaultConfig] = useState<{ key: string, url: string } | null>(null);
    useEffect(() => {
        try {
            const parsed = JSON.parse(localStorage.getItem("default") || "");
            setDefaultConfig(parsed);
        } catch { /* empty */
        }
    }, []);

    return defaultConfig ?
        <Navigate replace to={`/${encodeURIComponent(defaultConfig.url)}/${encodeURIComponent(defaultConfig.key)}`}/> :
        <Create/>
}