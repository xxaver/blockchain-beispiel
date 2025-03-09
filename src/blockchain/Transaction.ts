export interface Transaction {
    id: number;
    from: string;
    to: string;
    amount: number;
    fee: number;
    message: string;
}

export enum TransactionState {
    Double,
    Valid,
    NotSigned,
    Overspent,
    Invalid
}