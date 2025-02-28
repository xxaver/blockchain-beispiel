import {FullNode} from "./FullNode.ts";
import {Block} from "./Block.ts";

export class Miner extends FullNode {
    workingOn: Block | null = null;
    _operationsPerSecond = 1;
}