export type Expense = {
    id: string
    expenseName: string
    amount: number
    category: string
    date: Value
}

//esto es un gasto temporal por que no va a tener id, lo hacemos con el omit
export type DraftExpense = Omit<Expense, 'id'>

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];


export type Category = {
    id: string
    name: string
    icon: string
}