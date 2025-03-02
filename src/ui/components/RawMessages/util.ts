import {useEffect, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const wholeJson = (json: unknown): any => {
    return json;
    if (typeof json === "string") {
        try {
            return wholeJson(JSON.parse(json));
        } catch {
            return json;
        }
    }
    if (Array.isArray(json)) return json.map(wholeJson);
    if (typeof json === "object") {
        const newJson = {...json};
        for (const key in newJson) {
            // @ts-expect-error blabla
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newJson[key] = wholeJson(json[key as any] as any);
        }
        return newJson;
    }
    return json;
}

export const usePromise = <T>(promise: Promise<T>): T | null => {
    const [value, setValue] = useState<T | null>(null);
    useEffect(() => {
        promise.then(value => setValue(value));
    }, []);
    return value;
}

export const parseJSON = (json: string, normal=null) => {
    try {
        return JSON.parse(json);
    }
    catch {
        return normal;
    }
}
export const useLoaded = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setLoaded(true);
    }, []);
    return loaded;
}