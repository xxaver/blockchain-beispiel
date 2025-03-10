// Diese Datei funktioniert nicht wirklich, ich habe aus Zeitgründe die wahre
// Implementation direkt ins UI-Verzeichnis geschrieben

import {Transaction} from "./Transaction.ts";
import {Signed} from "./Signed.ts";
import {toBase58} from "./crypto.ts";

export const getAddress = async (publicKey: CryptoKey) => {
    const exportedKey = await crypto.subtle.exportKey('raw', publicKey);
    const sha256Hash = await crypto.subtle.digest('SHA-256', exportedKey);
    const ripemd160Hash = await crypto.subtle.digest('RIPEMD-160', sha256Hash);
    return toBase58(ripemd160Hash);
}

export class Node {
    static async create(_displayName: string) {
        const {publicKey, privateKey} = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // Key is extractable
            ["encrypt", "decrypt"]
        );
        return new Node(_displayName, publicKey, privateKey);
    }

    constructor(public _displayName: string, public publicKey: CryptoKey, private privateKey: CryptoKey) {
    }

    getAddress() {
        return getAddress(this.publicKey)
    }

    async signTransaction(transaction: Transaction) {
        const data = JSON.stringify(transaction);
        const signature = await crypto.subtle.sign({
            name: "ECDSA",
            hash: "SHA256",
        }, this.privateKey, new TextEncoder().encode(data));
        const signedTransaction: Signed = {
            data,
            signature: signature as unknown as string,
            publicKey: this.publicKey as unknown as string
        }
        return signedTransaction;
    }
}
