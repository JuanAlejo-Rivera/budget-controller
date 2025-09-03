import { useEffect, useMemo } from "react"
import BudgetForm from "./components/BudgetForm"
import { useBudget } from "./hooks/useBudget"
import { BudgetTracker } from "./components/BudgetTracker"
import ExpenseModal from "./components/ExpenseModal"
import ExpenseList from "./components/ExpenseList"

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FilterByCategory from './components/FilterByCategory';

function App() {

  const { state } = useBudget()
  const isValidBudget = useMemo(() => state.budget > 0, [state.budget])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state.expenses))
    localStorage.setItem('budgets', JSON.stringify(state.budget))
  }, [state.expenses, state.budget])



  return (
    <>
      <header className="bg-gradient-to-r from-blue-700 to-blue-800 p-4 shadow-md">
        <h1 className="text-center font-bold text-4xl text-white">
          Planificador De Gastos
        </h1>
      </header>

      {/* Fondo general */}
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 relative overflow-hidden">

        {/* Iconos decorativos en el fondo */}
        <div className="absolute inset-0 bg-[url('/piggybank.svg')] bg-repeat opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/money.svg')] bg-repeat opacity-5"></div>


        <div className="relative z-10 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
          {isValidBudget ? <BudgetTracker /> : <BudgetForm />}
        </div>

        {isValidBudget && (
          <main className="relative z-10 max-w-3xl mx-auto py-10">
            <FilterByCategory />
            <ExpenseList />
            <ExpenseModal />
          </main>
        )}
      </div>

      <ToastContainer />
    </>
  )

}

export default App
