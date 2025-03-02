import {algorithm, importKey, toBase64} from "./crypto.ts";

export type Signed = {
    data: string;
    signature: ArrayBuffer;
    publicKey: CryptoKey;
}

export const verify = async (signed: Signed) => {
    const text =  new TextEncoder().encode(signed.data);
    return await crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: "SHA256",
        },
        signed.publicKey,
        signed.signature,
        text,
    );
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