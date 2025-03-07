export interface Transaction {
    id: number;
    from: string;
    to: string;
    amount: number;
    fee: number;
    message: string;
}