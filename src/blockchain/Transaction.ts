export interface Transaction {
    from: string | null;
    number: number;
    to: string;
    amount: number;
    fee: number;
}