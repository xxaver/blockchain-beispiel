import {str2ab, toBase64} from "./crypto.ts";

export interface Block {
    id: number;
    prevHash: string;
    mined: null | {
        proofOfWork: number;
        publicKey: string;
    }
    data: string;
    hash?: string;
}
export const getBlockHash = async (block: Block) => {
    const data = `${block.prevHash}${block.id}${block.data}${block.mined?.proofOfWork || ""}${block.mined?.publicKey || ""}`;
    return toBase64(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)));
}
export const toBinString = (bytes: Uint8Array) =>
    bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');
export const verifyProofOfWork = async (block: Block, difficulty: number) => {
    const hash = await getBlockHash(block);
    const str = toBinString(new Uint8Array(str2ab(hash)));
    return !str.slice(0, difficulty).includes("1");
}