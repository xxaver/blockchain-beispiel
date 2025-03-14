import {toBinString} from "../../../blockchain/Block.ts";
import {FC, RefObject, useContext} from "react";
import {Accordeon} from "../Accordeon.tsx";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";
import {AlertCircle, MousePointerClick} from "lucide-react";
import {AccountTitle} from "../Accounts/AccountTitle.tsx";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {ComputedBlock} from "../../../blockchain/BlockChain.ts";
import {difficulty} from "../../config.ts";
import {CurrentCoins} from "../Accounts/CurrentCoins.tsx";
import {TransactionListItem} from "../Transactions/TransactionDetails.tsx";

export const BlockView: FC<{ block: ComputedBlock; selected: RefObject<HTMLDivElement> }> = ({block, selected}) => {
    const {setSelectedBlock, currentChain, withheldBlocks} = useContext(BlockchainContext)!;
    const isSelected = currentChain.some(e => e.hash === block.hash);
    return <div
        ref={currentChain.at(-1)?.hash === block.hash ? selected : null}
        className={`outline-1 p-2 w-full ${!block.transactionsValid ? "outline-red-600" : ""} ${isSelected ? "bg-green-200 text-green-700" : block.id === 0 ? "bg-blue-200 text-blue-600" : ""}`}>
        {withheldBlocks.some(e => e.hash === block.hash) && <div className="flex items-center gap-2 text-red-600">
            <img src="/blockchain-beispiel/hacker.svg" alt="" width={30} height={30}/>
            Zurückgehalten
        </div>}
        <div className="flex items-center gap-1 p-2 w-96">
            {block.id === 0
                ? <>Genesis Block
                    <div className="grow"></div>
                </>
                : <>#{block.id} {block.mined?.publicKey && <AccountTitle publicKey={block.mined.publicKey}/>}</>}
            <button onClick={() => setSelectedBlock(block.hash)}>
                <MousePointerClick/>
            </button>
        </div>
        {block.id !== 0 && <div className="text-black bg-white text-sm">
            <Accordeon title={<>
                <div className={block.transactionsValid ? "" : "text-red-600"}>
                    Transaktionen
                </div>
                <div className="grow"></div>
                <div
                    className="circle">
                    {block.transactions.length}
                </div>
                <CurrentCoins coins={block.transactions.reduce((a, b) => a + b.fee, 0)}/>
                {!block.transactionsValid && <>
                    <AlertCircle className="text-red-600"/>
                    <span className="text-red-600">Ungültig</span>
                </>}
            </>}>
                {block.transactions.map((transaction: Transaction, i: number) => <TransactionListItem
                    transaction={transaction} key={i}/>)}
                {!block.transactions.length && <div className="text-center text-gray-400 py-5">
                    Keine Transaktionen
                </div>}
            </Accordeon>
            <Accordeon title="Hash">
                <div className="p-2">Vorheriger:</div>
                <textarea readOnly value={block.prevHash}/>
                <div className="p-2">Dieser:</div>
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