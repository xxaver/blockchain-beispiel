import {toBinString} from "../../../blockchain/Block.ts";
import {FC, useContext} from "react";
import {Accordeon} from "../Accordeon.tsx";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";
import {AlertCircle, MousePointer2} from "lucide-react";
import {AccountTitle} from "../Accounts/AccountTitle.tsx";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {ComputedBlock} from "../../../blockchain/BlockChain.ts";
import {difficulty} from "../../config.ts";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";

export const BlockView: FC<{ block: ComputedBlock }> = ({block}) => {
    const {setSelectedBlock, currentChain} = useContext(BlockchainContext)!;

    const isSelected = currentChain.some(e => e.hash === block.hash);
    return <div
        className={`outline-1 p-2 w-full ${!block.transactionsValid ? "outline-red-600" : ""} ${isSelected ? "bg-green-200 text-green-700" : block.id === 0 ? "bg-blue-200 text-blue-600" : ""}`}>
        <div className="flex items-center gap-1 p-2 w-72">
            {block.id === 0
                ? <>Genesis Block
                    <div className="grow"></div>
                </>
                : <>#{block.id} von {block.mined?.publicKey && <AccountTitle publicKey={block.mined.publicKey}/>}</>}
            <button onClick={() => setSelectedBlock(block.hash)}>
                <MousePointer2/>
            </button>
        </div>
        {block.id !== 0 && <div className="text-black bg-white text-sm">
            <Accordeon title={<>
                <div className={block.transactionsValid ? "" : "text-red-600"}>
                    Transaktionen
                </div>
                <div className="grow"></div>
                <div
                    className="rounded-[100%] flex items-center text-center justify-center w-5 h-5 bg-blue-300 text-blue-700">
                    {block.transactions.length}
                </div>
                <CurrentCoins coins={block.transactions.reduce((a, b) => a + b.fee, 0)}/>
                {!block.transactionsValid && <>
                    <AlertCircle className="text-red-600"/>
                    <span className="text-red-600">Ungültig</span>
                </>}
            </>}>
                {block.transactions.map((transaction: Transaction, i: number) => <div key={i}
                                                                                      className="flex items-center gap-1">
                    <TransactionTitle withFee transaction={transaction}/>
                </div>)}
                {!block.transactions.length && <div className="text-center text-gray-400 py-5">
                    Keine Transaktionen
                </div>}
            </Accordeon>
            <Accordeon title="Vorheriger Hash">
                <textarea readOnly value={block.prevHash}/>
            </Accordeon>
            <Accordeon title="Hash">
                <textarea readOnly value={block.hash}/>
            </Accordeon>
            <Accordeon title={<>
                <div className={block.proofOfWorkValid ? "" : "text-red-600"}>
                    Proof of Work
                </div>
                <div className="grow"></div>
                {!block.proofOfWorkValid && <>
                    <AlertCircle className="text-red-600"/>
                    <span className="text-red-600">Ungültig</span>
                </>}
            </>}>
                <div className="px-2">Schwierigkeit: {difficulty}</div>
                <div className="px-2">Versuche: {block.mined?.proofOfWork}</div>
                <div className="p-2">Binärer Hash:</div>
                <textarea readOnly value={toBinString(block.hash || "")}/>
            </Accordeon>
        </div>}
    </div>
}