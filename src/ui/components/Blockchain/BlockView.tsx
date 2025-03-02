import {Block, toBinString} from "../../../blockchain/Block.ts";
import {FC, useContext} from "react";
import {Accordeon} from "../Accordeon.tsx";
import {BlockchainContext} from "../../handlers/Blockchain/BlockchainContext.ts";
import {MousePointer2} from "lucide-react";
import {AccountTitle} from "../Accounts/AccountTitle.tsx";
import {TransactionTitle} from "../RawMessages/TransactionItem.tsx";
import {Transaction} from "../../../blockchain/Transaction.ts";
import {parseJSON} from "../../util.ts";

export const BlockView: FC<{ block: Block }> = ({block}) => {
    const {setSelectedBlock, currentChain} = useContext(BlockchainContext)!;
    const transactions = parseJSON(block.data);

    const isSelected = currentChain.some(e => e.hash === block.hash);
    return <div
        className={`outline-1 p-2 w-full ${isSelected ? "bg-green-200 text-green-700" : block.id === 0 ? "bg-blue-200 text-blue-600" : ""}`}>
        <div className="flex items-center gap-1 p-2 w-72">
            {block.id === 0
                ? <>Genesis Block<div className="grow"></div></>
                : <>#{block.id} von {block.mined?.publicKey && <AccountTitle publicKey={block.mined.publicKey}/>}</>}
            <button onClick={() => setSelectedBlock(block.hash!)}>
                <MousePointer2/>
            </button>
        </div>
        {block.id !== 0 && <div className="text-black bg-white text-sm">
            <Accordeon title="Transaktionen">
                {transactions.map((transaction: Transaction, i: number) => <div key={i} className="flex items-center gap-1">
                    <TransactionTitle withFee transaction={transaction} />
                </div>)}
                {!transactions.length && <div className="text-center text-gray-400 py-5">
                    Keine Transaktionen
                </div>}
            </Accordeon>
            <Accordeon title="Vorheriger Hash">
                <textarea readOnly value={block.prevHash} />
            </Accordeon>
            <Accordeon title="Hash">
                <textarea readOnly value={block.hash} />
            </Accordeon>
            <Accordeon title="Proof of Work">
                <div className="px-2">Versuche: {block.mined?.proofOfWork}</div>
                <div className="p-2">Binärer Hash:</div>
                <textarea readOnly value={toBinString(block.hash || "")} />
            </Accordeon>
        </div>}
    </div>
}