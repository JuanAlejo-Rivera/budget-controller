import { useMemo, useState } from "react"
import { useBudget } from "../hooks/useBudget"


export default function BudgetForm() {

    const [budget, setBudget] = useState<number | null>(null)
    const { dispatch } = useBudget()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(e.target.valueAsNumber)
    }

    const isValid = useMemo(() => {
        return budget === null || isNaN(budget) || budget <= 0
    }, [budget])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'add-budget', payload: { budget: Number(budget) } })
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                    Define tu presupuesto
                </label>

                <p className="text-gray-800 font-bold max-w-2xl text-xl text-center mx-auto">
                    Planea tu presupuesto y mantén siempre el control de tus finanzas.
                </p>
                <input
                    id="budget"
                    type="number"
                    className="w-full bg-white border border-gray-200 p-2 rounded-2xl"
                    placeholder="Define tu presupuesto"
                    name="budget"
                    value={budget ?? ""}
                    onChange={handleChange}
                />
            </div>


            <input
                type="submit"
                value="Definir presupuesto"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer w-full p-2 text-white font-bold uppercase disabled:opacity-50 rounded-2xl"
                disabled={isValid}
            />

        </form>
    )
}

