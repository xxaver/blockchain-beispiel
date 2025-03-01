export interface Block {
    id: number;
    prevHash: string;
    proofOfWork: number | null;
    data: string;
}
export const getBlockHash = (block: Block) => {
    const data = `${block.prevHash}${block.id}${block.data}${block.proofOfWork}`;
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
}
export const toBinString = (bytes: Uint8Array) =>
    bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');
export const verifyProofOfWork = async (block: Block, difficulty: number) => {
    const hash = await getBlockHash(block);
    const str = toBinString(new Uint8Array(hash));
    return !str.slice(0, difficulty).includes("1");
}