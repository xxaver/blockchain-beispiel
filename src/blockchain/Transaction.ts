export interface Transaction {
    id: number;
    from: string;
    to: string;
    amount: number;
    fee: number;
    message: string;
}

export enum TransactionState {
    Final,
    Processed,
    
    Double,
    Valid,
    NotSigned,
    Overspent,
    Invalid
}