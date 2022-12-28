export type ValidationErrors = {
    title?: string;
    amount?: string;
    date?: string;
}

export type LoginForm = {
    email: string;
    password: string;
}

export type User = {
    email: string;
    password: string;
    expenses: Expense[];
}

export type Expense = {
    title: string;
    amount: number;
    date: Date;
    User?: User;
}

