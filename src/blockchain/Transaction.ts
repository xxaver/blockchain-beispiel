export interface Transaction {
    id: number;
    from: string | null;
    to: string;
    amount: number;
    fee: number;
}