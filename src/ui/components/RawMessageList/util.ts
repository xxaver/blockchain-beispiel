// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const wholeJson = (json: unknown): any => {
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