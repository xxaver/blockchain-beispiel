import {str2ab, toBase64} from "./crypto.ts";
import {difficulty} from "../ui/config.ts";

export interface ProofOfWork {
    proofOfWork: number;
    publicKey: string;
}
export interface Block {
    id: number;
    prevHash: string;
    mined: null | ProofOfWork;
    data: string;
}
export const getBlockHash = async (block: Block) => {
    const data = `${block.prevHash}${block.id}${block.data}${block.mined?.proofOfWork || ""}${block.mined?.publicKey || ""}`;
    return toBase64(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)));
}
export const toBinString = (str: string) => {
    const bytes = new Uint8Array(str2ab(str));
    return bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');
}
export const verifyProofOfWork = async (block: Block, d=difficulty, log=false) => {
    const hash = await getBlockHash(block);
    const str = toBinString(hash);
    if(log) console.log(str)
    return !str.slice(0, d).includes("1");
}