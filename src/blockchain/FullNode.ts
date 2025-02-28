import {Transaction} from "./Transaction.ts";
import {Block} from "./Block.ts";
import {Node} from "./Node.ts";

export class FullNode extends Node {
    mempool: Transaction[] = [];
    blocks: Block[] = [];
}