import {FC, useContext, useEffect, useMemo, useReducer, useRef} from "react";
import {OwnUser, UsersContext} from "./UsersContext.tsx";
import {BlockchainContext} from "../Blockchain/BlockchainContext.ts";
import {MempoolContext} from "../Mempool/MempoolContext.ts";
import {Block, verifyProofOfWork} from "../../../blockchain/Block.ts";
import {produce} from "immer";

export const MiningHandler: FC<{ user: OwnUser }> = ({user}) => {
    const {setOwnUsers} = useContext(UsersContext)!;
    const {currentChain, sendBlock} = useContext(BlockchainContext)!;
    const prevHash = currentChain.at(-1)?.hash || "";
    const {chosen} = useContext(MempoolContext)!;
    const changed = useRef(false);
    const [_, refresh] = useReducer(a => a + 1, 0);

    const workingOn = useMemo<Block>(() => {
        changed.current = false;
        return {
            id: currentChain.length,
            prevHash,
            mined: null,
            data: JSON.stringify(chosen.map(e => e.signed)),
        }
    }, [prevHash, _]);

    useEffect(() => {
        changed.current = true;
    }, [chosen]);

    const interval = useRef<null | ReturnType<typeof setInterval>>(null)
    const currentPOW = useRef(0)

    useEffect(() => {
        currentPOW.current = 0;
    }, [workingOn]);

    useEffect(() => {
        if (interval.current !== null) clearInterval(interval.current);
        if (!user.computationalPower) return;
        interval.current = setInterval(async () => {
            const block: Block = {
                ...workingOn, mined: {
                    publicKey: user.publicKey,
                    proofOfWork: currentPOW.current,
                }
            }
            setOwnUsers(users => produce(users, users => {
                const u = users.find(u => u.publicKey === user.publicKey)!;
                if (u) u.workingOn = block;
            }))
            if (await verifyProofOfWork(block)) {
                sendBlock(block);
                if(changed.current) refresh(); 
            }
            currentPOW.current++;
        }, 1000 / user.computationalPower)
    }, [user.computationalPower, user.publicKey, workingOn]);

    return null;
}