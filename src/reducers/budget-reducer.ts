import type { Category, DraftExpense } from './../types/index';
// 🔸 Definimos las acciones posibles que puede manejar el reducer.

import { v4 as uuid4 } from 'uuid'
import type { Expense } from "../types"

// En este caso, solo hay una acción: 'add-budget', que recibe un número.
export type BudgetActions =
  { type: 'add-budget', payload: { budget: number } } |
  { type: 'show-modal' } |
  { type: 'close-modal' } |
  { type: 'add-expense', payload: { expense: DraftExpense } } |
  { type: 'remove-expense', payload: { id: Expense['id'] } } |
  { type: 'get-expense-by-id', payload: { id: Expense['id'] } } |
  { type: 'update-expense', payload: { expense: Expense } } |
  { type: 'reset-app' } |
  { type: 'add-filter-category', payload: { id: Category['id'] } }

// Solo un tipo
// Define la forma del estado, no guarda nada.
export type BudgetState = {
  budget: number
  modal: boolean
  expenses: Expense[]
  editingId: Expense['id']
  currentCategory: Category['id']
}

const initialBudget = (): number => {
  const localStorageBudget = localStorage.getItem('budgets')
  return localStorageBudget ? +localStorageBudget : 0
}

const initialExpenses = (): Expense[] => {
  const localStorageExpense = localStorage.getItem('expenses')
  return localStorageExpense ? JSON.parse(localStorageExpense) : []
}

//  Un valor real
// Es el estado inicial que usás al montar el componente.
export const initialState: BudgetState = {
  budget: initialBudget(),
  modal: false,
  expenses: initialExpenses(),
  editingId: '',
  currentCategory: ''
}

const createExpense = (draftExpense: DraftExpense): Expense => {
  return {
    ...draftExpense,
    id: uuid4()
  }
}

// 🔸 Esta es la función reducer.
// Recibe el estado actual y una acción, y devuelve un nuevo estado.
export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetActions
) => {

  // 🔹 Agrega o actualiza el presupuesto
  if (action.type === "add-budget") {
    return {
      ...state,
      budget: action.payload.budget
    }
  }

  // 🔹 Abre el modal de agregar/editar gasto
  if (action.type === "show-modal") {
    return {
      ...state,
      modal: true
    }
  }

  // 🔹 Cierra el modal
  if (action.type === "close-modal") {
    return {
      ...state,
      modal: false,
      editingId: ''
    }
  }

  // 🔹 Crea y agrega un nuevo gasto
  if (action.type === 'add-expense') {
    const expense = createExpense(action.payload.expense)
    return {
      ...state,
      expenses: [...state.expenses, expense],
      modal: false
    }
  }

  // 🔹 Elimina un gasto por ID
  if (action.type === 'remove-expense') {
    return {
      ...state,
      expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
    }
  }

  // 🔹 Establece el ID del gasto a editar y abre el modal
  if (action.type === 'get-expense-by-id') {
    return {
      ...state,
      editingId: action.payload.id,
      modal: true
    }
  }

  // 🔹 Actualiza un gasto existente por ID
  if (action.type === 'update-expense') {
    return {
      ...state,
      //si el gasto guardado es igual al que queremos editar
      //se remplaza con el ternario si no, se deja igual
      expenses: state.expenses.map(expense =>
        expense.id === action.payload.expense.id
          ? action.payload.expense
          : expense
      ),
      modal: false,
      editingId: ''
    }
  }

  if (action.type === 'reset-app') {
    return {
      ...state,
      budget: 0,
      expenses: [],
    }
  }


  if (action.type === 'add-filter-category') {
    return {
      ...state,
      currentCategory: action.payload.id
    }
  }



  // 🔹 Si la acción no es reconocida, devolvemos el estado tal cual está.
  return state
}
