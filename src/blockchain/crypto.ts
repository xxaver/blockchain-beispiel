export const generateKeyPair = async () => {
    const {publicKey, privateKey} = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
    console.log(publicKey);
    return {
        publicKey: await exportKey(publicKey, "spki"),
        privateKey: await exportKey(privateKey, "pkcs8")
    };
}
export const exportKey = async (key: CryptoKey, format: "pkcs8" | "spki") => {
    const exported = await crypto.subtle.exportKey(format, key);
    const exportedArray = new Uint8Array(exported);
    return btoa(String.fromCharCode(...exportedArray));
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