import { AxiosResponse } from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface Transcation {
    id: number;
    title: string;
    type: string;
    category: string;
    amount: number,
    createdAt: string;
}

type TransactionInput = Omit<Transcation, 'id'>;

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData {
    transactions: Transcation[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transcation[]>([]);

    useEffect(() => {
        api.get<{ transactions: Transcation[] }>('transactions')
            .then(response => setTransactions(response.data?.transactions));
    }, []);

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post<TransactionInput, AxiosResponse<{ transaction: Transcation }>>('transactions', transactionInput);
        const { transaction } = response.data;
        setTransactions([
            ...transactions,
            transaction
        ]);
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionsContext);
    return context;
}