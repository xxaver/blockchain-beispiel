export type Signed = {
    data: string;
    signature: ArrayBuffer;
    publicKey: CryptoKey;
}

export const verify = async (signed: Signed) => {
    const text =  new TextEncoder().encode(signed.data);
    return await window.crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: "SHA256",
        },
        signed.publicKey,
        signed.signature,
        text,
    );
}
export const sign = async (data: string, publicKey: CryptoKey, privateKey: CryptoKey) => {
    const signature = await crypto.subtle.sign({
        name: "ECDSA",
        hash: "SHA256",
    }, privateKey, new TextEncoder().encode(data));
    return {
        data,
        publicKey,
        signature
    }
}