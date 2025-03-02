import {FC, useContext, useEffect, useMemo, useRef} from "react";
import {OwnUser} from "./UsersContext.tsx";
import {BlockchainContext} from "../Blockchain/BlockchainContext.ts";
import {MempoolContext} from "../Mempool/MempoolContext.ts";
import {Block, verifyProofOfWork} from "../../../blockchain/Block.ts";
import {RealtimeContext} from "../Realtime/RealtimeContext.ts";

export const MiningHandler: FC<{ user: OwnUser }> = ({user}) => {
    const {currentChain} = useContext(BlockchainContext)!;
    const prevHash = currentChain.at(-1)?.hash || "";
    const {valid} = useContext(MempoolContext)!;
    const {send} = useContext(RealtimeContext)!;

    const workingOn = useMemo<Block>(() => ({
        id: currentChain.length,
        prevHash,
        mined: null,
        data: JSON.stringify(valid.map(e => e.signed).slice(0, 5)),
    }), [prevHash]);

    const interval = useRef<null | ReturnType<typeof setInterval>>(null)
    const currentPOW = useRef(0)

    useEffect(() => {
        currentPOW.current = 0;
    }, [workingOn]);

    useEffect(() => {
        if (interval.current !== null) clearInterval(interval.current);
        if(!user.computationalPower) return;
        interval.current = setInterval(async () => {
            const block: Block = {
                ...workingOn, mined: {
                    publicKey: user.publicKey,
                    proofOfWork: currentPOW.current,
                }
            }
            if (await verifyProofOfWork(block)) {
                send("block", block);
            }
            currentPOW.current++;
        }, 1000 / user.computationalPower)
    }, [user.computationalPower, user.publicKey, workingOn]);

    return null;
}