export const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
}

export const generateKeyPair = async () => {
    const {publicKey, privateKey} = await window.crypto.subtle.generateKey(
        algorithm,
        true,
        ["sign", "verify"]
    );
    return {
        publicKey: await exportKey(publicKey, "spki"),
        privateKey: await exportKey(privateKey, "pkcs8")
    };
}
export const exportKey = async (key: CryptoKey, format: "pkcs8" | "spki") => {
    const exported = await crypto.subtle.exportKey(format, key);
    return toBase64(exported);
};

export const importKey = async (key: string, format: "pkcs8" | "spki") => {
    const ab = str2ab(key);
    return window.crypto.subtle.importKey(format, ab, algorithm, true, [format === "spki" ? "verify" : "sign"]);
}

export const str2ab = (string: string) => {
    const str = atob(string)
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
export const toBase64 = (buffer: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));
export const toBase58 = (buffer: ArrayBuffer) => {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

    let num = BigInt('0x' + Buffer.from(buffer).toString('hex'));
    let result = '';

    while (num > 0) {
        const remainder = num % 58n;
        result = alphabet[Number(remainder)] + result;
        num = num / 58n;
    }

    const uint8Array = new Uint8Array(buffer);
    for (let i = 0; i < uint8Array.length && uint8Array[i] === 0; i++) {
        result = alphabet[0] + result;
    }

    return result;
}
