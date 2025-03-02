import {algorithm, importKey, str2ab, toBase64} from "./crypto.ts";

export type Signed = {
    data: string;
    signature: string;
    publicKey: string;
}

export const verify = async <T>(signed: Signed): Promise<false | (T & {publicKey: string})> => {
    try {
        const text = new TextEncoder().encode(signed.data);
        const isOk = await crypto.subtle.verify(
            algorithm,
            await importKey(signed.publicKey, "spki"),
            str2ab(signed.signature),
            text,
        );
        if(!isOk) return false;
        return {...JSON.parse(signed.data), publicKey: signed.publicKey};
    }
    catch {
        return false;
    }
}
export const sign = async (data: string, publicKey: string, privateKey: string) => {
    const key = await importKey(privateKey, "pkcs8")
    console.log(key)
    const signature = await crypto.subtle.sign(algorithm, key, new TextEncoder().encode(data));
    return {
        data,
        publicKey,
        signature: toBase64(signature)
    }
}